// Test the smart folder resolver picks a writable folder
const { chooseUploadFolder, _resetFolderProbeCache } = require('../src/lib/googleDrive.ts');
// Can't import TS directly in Node. So we re-implement the test via raw API:
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

const candidates = [
  e.GOOGLE_DRIVE_UPLOAD_FOLDER_ID,
  e.GOOGLE_DRIVE_NEW_FOLDER_ID,
  ...(e.GOOGLE_DRIVE_FALLBACK_FOLDER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean),
].filter(Boolean);

(async () => {
  console.log('Testing', candidates.length, 'candidate folders...\n');
  for (const fid of candidates) {
    let canAdd = false;
    let viaProbe = false;
    try {
      const r = await drive.files.get({
        fileId: fid,
        fields: 'capabilities,name',
        supportsAllDrives: true,
      });
      canAdd = !!(r.data.capabilities && r.data.capabilities.canAddChildren);
      console.log(
        `  ${canAdd ? '✓' : '✗'} ${fid} (${r.data.name})  capabilities.canAddChildren=${canAdd}`
      );
    } catch (err) {
      console.log(`  ? ${fid}  err=${err.code}`);
    }
    if (!canAdd) {
      // try probe
      try {
        const probe = await drive.files.create({
          requestBody: { name: `_probe_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.txt`, parents: [fid] },
          media: { mimeType: 'text/plain', body: 'probe' },
          fields: 'id',
          supportsAllDrives: true,
        });
        if (probe.data.id) {
          await drive.files.delete({ fileId: probe.data.id, supportsAllDrives: true }).catch(() => {});
          canAdd = true;
          viaProbe = true;
          console.log(`    -> writable via probe upload (${probe.data.id})`);
        }
      } catch (err) {
        console.log(`    -> probe failed: ${err.code} ${String(err.message).slice(0, 80)}`);
      }
    }
    console.log(`     RESULT: ${canAdd ? 'WRITABLE' : 'NOT WRITABLE'}${viaProbe ? ' (via probe)' : ''}\n`);
  }
})();
