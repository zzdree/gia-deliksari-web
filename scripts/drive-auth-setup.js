#!/usr/bin/env node
/**
 * Google Drive OAuth setup — one-time interactive wizard.
 *
 * WHY: Service accounts have zero personal Drive storage quota (Google policy
 * since 2021). Uploading into a normal My Drive from a service account always
 * fails with 403 "Service Accounts do not have storage quota". The standard
 * free fix is an OAuth refresh token issued to the CHURCH'S OWN Gmail account,
 * so uploads count against the church's 15 GB and land in its My Drive.
 *
 * WHAT IT DOES: prints a consent URL, you open it in the church account's
 * browser, approve, paste the code back, and it writes the refresh token into
 * .env.local automatically.
 *
 * Usage:  node scripts/drive-auth-setup.js
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ENV_PATH = path.join(__dirname, '..', '.env.local');

function loadEnv() {
  const raw = fs.readFileSync(ENV_PATH, 'utf8');
  const env = {};
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (m) env[m[1]] = m[2];
  });
  return env;
}

function upsertEnvVar(content, key, value) {
  const re = new RegExp(`^\\s*${key}\\s*=.*$`, 'm');
  if (re.test(content)) {
    return content.replace(re, `${key}="${value}"`);
  }
  return content.trimEnd() + `\n${key}="${value}"\n`;
}

async function main() {
  const env = loadEnv();
  const clientId = env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET;

  console.log('=== Google Drive OAuth Setup — GIA Deliksari Web ===\n');

  if (!clientId || !clientSecret) {
    console.log('Belum ada OAuth Client ID. Buat dulu (5 menit):\n');
    console.log('1. Buka https://console.cloud.google.com/apis/credentials');
    console.log('   (pastikan project yang sama dengan service account: gia-deliksari-web)');
    console.log('2. "+ CREATE CREDENTIALS" -> "OAuth client ID"');
    console.log('3. Application type: "Web application"');
    console.log('4. Authorized redirect URIs, tambahkan persis:');
    console.log('   http://localhost:1');
    console.log('5. Create -> salin "Client ID" dan "Client secret"\n');
    console.log('6. Tambahkan ke .env.local:');
    console.log('   GOOGLE_OAUTH_CLIENT_ID="..."');
    console.log('   GOOGLE_OAUTH_CLIENT_SECRET="..."\n');
    process.exit(1);
  }

  const { google } = require('googleapis');
  const oauth = new google.auth.OAuth2(clientId, clientSecret);
  // drive.file scope: app can only see/manage files it created itself
  const authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive.file'],
    redirect_uri: 'http://localhost:1',
  });

  console.log('LANGKAH 1 — Buka URL ini di browser, login dengan akun Gmail GEREJA');
  console.log('(akun yang memiliki folder arsip dokumentasi), lalu klik Allow:\n');
  console.log(authUrl + '\n');
  console.log('LANGKAH 2 — Setelah di-allow, kamu akan dibawa ke http://localhost:1/');
  console.log('yang GAGAL dimuat (normal!). Salin nilai "code=XXXX" dari address bar.\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Paste code di sini: ', async (codeRaw) => {
    rl.close();
    const code = decodeURIComponent(codeRaw.trim().replace(/^.*code=/, '').replace(/&scope=.*/, ''));
    try {
      const { tokens } = await oauth.getToken(code);
      if (!tokens.refresh_token) {
        console.error('\nTidak menerima refresh token. Hapus izin aplikasi di https://myaccount.google.com/permissions lalu ulangi.');
        process.exit(1);
      }
      let content = fs.readFileSync(ENV_PATH, 'utf8');
      content = upsertEnvVar(content, 'GOOGLE_OAUTH_REFRESH_TOKEN', tokens.refresh_token);
      fs.writeFileSync(ENV_PATH, content, 'utf8');
      console.log('\n✅ Refresh token tersimpan ke .env.local');
      console.log('Sekarang upload galeri akan berjalan sebagai akun Gmail gereja sendiri.');
      console.log('Tes dengan: node scripts/diag-drive.js');
    } catch (e) {
      console.error('\nGagal menukar code menjadi token:', e.message);
      process.exit(1);
    }
  });
}

main();
