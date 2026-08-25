// Diagnostic: Google Drive upload end-to-end check (no external deps besides googleapis)
// Mirrors src/lib/googleDrive.ts credential resolution exactly.
// Usage: node scripts/diag-drive.js
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { google } = require('googleapis');

function loadEnv() {
  const raw = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  const env = {};
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (m && m[1] !== undefined) env[m[1]] = m[2];
  });
  return env;
}

const env = loadEnv();
const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
let privateKey = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
const FOLDER_ID = env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID;

function normalizeKey(key) {
  let k = key.replace(/\\n/g, '\n');
  if (!k.includes('\n')) {
    k = k
      .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
      .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n');
  }
  return k;
}

// Mirror src/lib/googleDrive.ts: prefer OAuth refresh token, fall back to SA
function buildAuth() {
  if (env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET && env.GOOGLE_OAUTH_REFRESH_TOKEN) {
    const oauth = new google.auth.OAuth2(env.GOOGLE_OAUTH_CLIENT_ID, env.GOOGLE_OAUTH_CLIENT_SECRET);
    oauth.setCredentials({ refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN });
    console.log('mode: OAUTH refresh token (akun Gmail gereja)');
    return oauth;
  }
  console.log('mode: SERVICE ACCOUNT (upload ke My Drive biasa akan 403 kuota!)');
  return new google.auth.JWT({ email, key: normalizeKey(privateKey), scopes: ['https://www.googleapis.com/auth/drive.file'] });
}

async function main() {
  let failed = false;

  console.log('=== 1. Credential presence ===');
  console.log('oauth client id set:', !!env.GOOGLE_OAUTH_CLIENT_ID);
  console.log('oauth refresh token set:', !!env.GOOGLE_OAUTH_REFRESH_TOKEN);
  console.log('service account email:', email || '(unset)');
  console.log('upload folder id:', FOLDER_ID || '(unset)');

  if (privateKey && !env.GOOGLE_OAUTH_REFRESH_TOKEN) {
    try {
      const crypto = require('crypto');
      crypto.createPrivateKey({ key: normalizeKey(privateKey), format: 'pem' });
      console.log('OK: SA private key parses via node crypto');
    } catch (e) {
      console.log('FAIL: SA private key cannot parse:', e.message);
      failed = true;
    }
  }

  console.log('\n=== 2. Auth + token fetch ===');
  const auth = buildAuth();
  try {
    await auth.getAccessToken();
    console.log('OK: access token acquired');
  } catch (e) {
    console.log('FAIL: token fetch:', e.message);
    process.exit(1);
  }

  const drive = google.drive({ version: 'v3', auth });

  console.log('\n=== 3. Folder access checks ===');
  const PUBLIC_FOLDER_ID = env.GOOGLE_DRIVE_PUBLIC_FOLDER_ID;
  for (const [label, id] of [['UPLOAD_FOLDER', FOLDER_ID], ['PUBLIC_FOLDER', PUBLIC_FOLDER_ID]]) {
    if (!id) { console.log(`SKIP ${label} (not set)`); continue; }
    try {
      const meta = await drive.files.get({ fileId: id, fields: 'id, name, mimeType, capabilities(canEdit)' });
      console.log(`OK ${label} (${id.slice(0, 8)}...) -> "${meta.data.name}" | canEdit: ${meta.data.capabilities?.canEdit}`);
    } catch (e) {
      console.log(`FAIL ${label} (${id}) -> ${e.status || ''} ${String(e.message).slice(0, 100)}`);
      failed = true;
    }
  }

  console.log('\n=== 4. Test file upload into upload folder ===');
  try {
    const res = await drive.files.create({
      requestBody: { name: `_diag_${Date.now()}.txt`, ...(FOLDER_ID ? { parents: [FOLDER_ID] } : {}), description: 'diagnostic' },
      media: { mimeType: 'text/plain', body: Readable.from(Buffer.from('diag ' + new Date().toISOString())) },
      fields: 'id, name, webViewLink',
    });
    console.log('OK: uploaded ->', res.data.name, '| id:', res.data.id, '| link:', res.data.webViewLink);
    await drive.files.delete({ fileId: res.data.id }).catch(() => {});
    console.log('(cleaned up test file)');
  } catch (e) {
    console.log('FAIL: upload:', e.status || '', String(e.message || e).slice(0, 200));
    if (String(e?.message).includes('storage quota')) {
      console.log('\n>> FIX: Service Account tidak punya kuota. Jalankan wizard:');
      console.log('>>   node scripts/drive-auth-setup.js');
      console.log('>> lalu isi GOOGLE_OAUTH_* di .env.local (lihat instruksi wizard).');
    }
    process.exit(1);
  }

  console.log(failed ? '\nPASSED with warnings ⚠️  (see FAIL lines above)' : '\nALL CHECKS PASSED ✅');
}

main().catch((e) => { console.error('UNEXPECTED:', e); process.exit(1); });
