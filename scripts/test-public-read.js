// Test public access via API key
const { google } = require('googleapis');
const e = {};
require('fs')
  .readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .forEach((l) => {
    if (!l || l.startsWith('#')) return;
    const i = l.indexOf('=');
    if (i < 0) return;
    e[l.slice(0, i)] = l
      .slice(i + 1)
      .replace(/^['"]|['"]$/g, '')
      .trim();
  });

const drive = google.drive({ version: 'v3', auth: e.GOOGLE_DRIVE_API_KEY });
const ids = [
  '1a76JE6FUhebVf2OUUHuxsUSZGHPQ_XmK',
  '1wUYR6VAsbrIhOKCPtRQmuILWUqbbMr7C',
  '1T_ahqCtmOjdFl0L-MNu7bIQo-8Oz8y9h',
];

(async () => {
  for (const id of ids) {
    try {
      const r = await drive.files.list({
        q: `'${id}' in parents and trashed=false`,
        fields: 'files(id,name,mimeType,size,thumbnailLink,webContentLink,webViewLink)',
        pageSize: 5,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });
      console.log(`\n[${id}]`);
      console.log(`  found ${r.data.files.length} files via API key`);
      r.data.files.forEach((f) => {
        console.log(`    - ${f.name} (${f.id})`);
        console.log(`        webViewLink  : ${f.webViewLink || 'n/a'}`);
        console.log(`        webContentLink: ${f.webContentLink || 'n/a'}`);
        console.log(`        thumbnailLink : ${(f.thumbnailLink || '').slice(0, 80)}...`);
      });
    } catch (err) {
      console.log(`[${id}] ERR ${err.code} ${String(err.message).slice(0, 200)}`);
    }
  }
})();
