import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

/**
 * Resolve an authorized Drive client.
 *
 * Preferred: OAuth2 refresh token belonging to the CHURCH'S OWN Gmail account
 *   (GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET / GOOGLE_OAUTH_REFRESH_TOKEN).
 *   Service accounts have zero personal storage quota since 2021, so any upload
 *   into a normal My Drive fails with 403 "Service Accounts do not have storage
 *   quota". An OAuth token of the real account uploads under its quota and needs
 *   no folder sharing at all.
 *
 * Fallback: service account (read-only capable; uploads will 403 unless the
 *   target is a Shared Drive). Kept so metadata checks still work if configured.
 */
function getDriveClient() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    try {
      const oauth = new google.auth.OAuth2(clientId, clientSecret);
      oauth.setCredentials({ refresh_token: refreshToken });
      return { drive: google.drive({ version: 'v3', auth: oauth }), mode: 'oauth' as const };
    } catch (error) {
      console.error('Failed to initialize Google Drive OAuth client:', error);
    }
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Ensure newline characters in private key are properly formatted
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: SCOPES,
    });

    return { drive: google.drive({ version: 'v3', auth }), mode: 'service-account' as const };
  } catch (error) {
    console.error('Failed to initialize Google Drive auth client:', error);
    return null;
  }
}

export type DriveUploadResult =
  | { success: true; fileId: string; fileName: string; webViewLink?: string }
  | { success: false; reason?: string; error?: string };

/**
 * Upload a file buffer to Google Drive folder
 */
export async function uploadToGoogleDrive({
  fileName,
  mimeType,
  buffer,
  folderId,
  description,
}: {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  folderId?: string;
  description?: string;
}): Promise<DriveUploadResult> {
  const client = getDriveClient();
  if (!client) {
    console.warn('Google Drive credentials not configured, skipping direct Drive upload.');
    return { success: false, reason: 'unconfigured' };
  }

  const { drive } = client;

  const targetFolderId = folderId || process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID;

  try {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const fileMetadata: { name: string; parents?: string[]; description?: string } = {
      name: fileName,
      description: description || 'Dokumentasi GIA Deliksari Web Portal',
    };

    if (targetFolderId) {
      fileMetadata.parents = [targetFolderId];
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: { mimeType, body: stream },
      fields: 'id, name, webViewLink',
    });

    return {
      success: true,
      fileId: response.data.id!,
      fileName: response.data.name!,
      webViewLink: response.data.webViewLink ?? undefined,
    };
  } catch (error: any) {
    console.error('Google Drive API upload error:', error?.message || error);

    // Translate the classic service-account quota failure into actionable guidance
    const msg = String(error?.message || '');
    if (msg.includes('storage quota') || msg.includes('Service Accounts')) {
      return {
        success: false,
        error:
          'Google menolak upload dari Service Account (tidak punya kuota penyimpanan). ' +
          'Jalankan `node scripts/drive-auth-setup.js` untuk membuat OAuth Refresh Token akun Gmail gereja.',
      };
    }

    return { success: false, error: msg || 'Google Drive upload failed' };
  }
}
