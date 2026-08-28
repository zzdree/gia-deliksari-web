// Test whether the service account can read or upload to the new folder
const { google } = require('googleapis');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const e = {};
env.split(/\r?\n/).forEach((l) => {
  if (!l || l.startsWith('#')) return;
  const i = l.indexOf('=');
  if (i < 0) return;
  e[l.slice(0, i)] = l
    .slice(i + 1)
    .replace(/^['"]|['"]$/g, '')
    .trim();
});

const pk = (e.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const auth = new google.auth.JWT({
  email: e.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: pk,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });

const NEW_FOLDER = '1a76JE6FUhebVf2OUUHuxsUSZGHPQ_XmK';

(async () => {
  console.log('Service account:', e.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  console.log('');

  // 1. List children of new folder
  console.log(`[1] List children of new folder ${NEW_FOLDER}...`);
  try {
    const r = await drive.files.list({
      q: `'${NEW_FOLDER}' in parents and trashed=false`,
      fields: 'files(id,name,mimeType,size,createdTime,webViewLink)',
      pageSize: 20,
    });
    console.log(`    OK - found ${r.data.files.length} files`);
    r.data.files.forEach((f) =>
      console.log(`    - ${f.name} (${f.id}) [${f.mimeType}]`)
    );
  } catch (err) {
    console.log('    ERR:', err.code, String(err.message).slice(0, 200));
  }

  // 2. Try uploading a small test file to new folder
  console.log('');
  console.log(`[2] Try uploading test file to new folder...`);
  try {
    const r = await drive.files.create({
      requestBody: {
        name: `_permission_test_${Date.now()}.txt`,
        parents: [NEW_FOLDER],
      },
      media: {
        mimeType: 'text/plain',
        body: 'Permission test from service account',
      },
      fields: 'id,name,webViewLink',
      supportsAllDrives: true,
    });
    console.log('    OK uploaded:', r.data.id, r.data.name);
    console.log('    link:', r.data.webViewLink);

    // Clean up
    await drive.files.delete({ fileId: r.data.id, supportsAllDrives: true });
    console.log('    (cleaned up)');
  } catch (err) {
    console.log('    ERR:', err.code, String(err.message).slice(0, 300));
  }
})().catch((err) => {
  console.error('FATAL', err.message);
  process.exit(1);
});
