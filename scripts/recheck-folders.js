// Re-test with metadata-only scope to get clean view
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
  scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
});
const drive = google.drive({ version: 'v3', auth });

const ids = [
  '1a76JE6FUhebVf2OUUHuxsUSZGHPQ_XmK',
  '1wUYR6VAsbrIhOKCPtRQmuILWUqbbMr7C',
  '1T_ahqCtmOjdFl0L-MNu7bIQo-8Oz8y9h',
];

(async () => {
  for (const id of ids) {
    try {
      const r = await drive.files.get({
        fileId: id,
        fields: 'id,name,mimeType,shared,driveId,capabilities,owners',
        supportsAllDrives: true,
      });
      const d = r.data;
      console.log(`\n[${id}]  (${d.name})`);
      console.log('  shared       :', d.shared);
      console.log('  driveId      :', d.driveId || '(My Drive)');
      console.log('  capabilities :', JSON.stringify(d.capabilities));
      console.log('  owners       :', JSON.stringify((d.owners || []).map(o => o.emailAddress)));
    } catch (err) {
      console.log(`\n[${id}]  ERR ${err.code} ${String(err.message).slice(0, 150)}`);
    }
  }
})();
