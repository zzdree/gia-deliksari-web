// Test Drive folder access with current credentials
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
if (!e.GOOGLE_SERVICE_ACCOUNT_EMAIL || !pk) {
  console.log('NO_SERVICE_ACCOUNT');
  process.exit(0);
}

const auth = new google.auth.JWT({
  email: e.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: pk,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

const targets = [
  { id: '1a76JE6FUhebVf2OUUHuxsUSZGHPQ_XmK', tag: 'NEW (user-given)' },
  { id: '1wUYR6VAsbrIhOKCPtRQmuILWUqbbMr7C', tag: 'OLD upload folder' },
  { id: '1T_ahqCtmOjdFl0L-MNu7bIQo-8Oz8y9h', tag: 'OLD public folder' },
];

(async () => {
  for (const t of targets) {
    try {
      const r = await drive.files.get({
        fileId: t.id,
        fields:
          'id,name,mimeType,driveId,capabilities,owners(emailAddress),shared,parents',
        supportsAllDrives: true,
      });
      const d = r.data;
      console.log(`\n[OK] ${t.id}  (${t.tag})`);
      console.log('    name       :', d.name);
      console.log('    type       :', d.mimeType);
      console.log('    shared     :', d.shared);
      console.log('    driveId    :', d.driveId || '(My Drive / personal)');
      console.log('    canRead    :', d.capabilities && d.capabilities.canRead);
      console.log('    canAddChild:', d.capabilities && d.capabilities.canAddChildren);
      console.log('    parents    :', JSON.stringify(d.parents));
      console.log('    owners     :', JSON.stringify((d.owners || []).map((o) => o.emailAddress)));
    } catch (err) {
      console.log(`\n[ERR] ${t.id}  (${t.tag})`);
      console.log('    code:', err.code);
      console.log('    msg :', String(err.message).slice(0, 200));
    }
  }
})().catch((err) => {
  console.error('FATAL', err.message);
  process.exit(1);
});
