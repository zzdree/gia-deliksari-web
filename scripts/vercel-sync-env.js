// Sync .env.local to Vercel using vercel env add via direct spawn (no shell).
// For values that may need quoting (e.g. private keys with newlines), we
// pass --value with the value inline.
const { spawnSync } = require('child_process');
const fs = require('fs');

const envTxt = fs.readFileSync('.env.local', 'utf8');
const env = {};
envTxt.split(/\r?\n/).forEach((l) => {
  if (!l || l.trim().startsWith('#')) return;
  const i = l.indexOf('=');
  if (i < 0) return;
  const k = l.slice(0, i).trim();
  const v = l
    .slice(i + 1)
    .replace(/^['"]|['"]$/g, '')
    .trim();
  env[k] = v;
});

const serverOnly = Object.entries(env).filter(
  ([k]) => !k.startsWith('NEXT_PUBLIC_') && env[k] && env[k].length > 0
);

console.log('Will sync', serverOnly.length, 'server env vars to Vercel.\n');

let ok = 0, fail = 0, existed = 0;
for (const [k, v] of serverOnly) {
  for (const target of ['production', 'preview']) {
    const r = spawnSync(
      'vercel',
      ['env', 'add', k, target, '--value', v, '--yes'],
      { encoding: 'utf8', windowsHide: true }
    );
    const out = (r.stdout || '') + (r.stderr || '');
    if (r.status === 0 || out.includes('Updated') || out.includes('Added')) {
      console.log(`  ✓ ${k} → ${target}`);
      ok++;
    } else if (out.toLowerCase().includes('already')) {
      console.log(`  = ${k} → ${target} (already exists)`);
      existed++;
    } else {
      console.log(`  ✗ ${k} → ${target}: ${out.slice(0, 250)}`);
      fail++;
    }
  }
}

console.log(`\nDone. added=${ok} existed=${existed} failed=${fail}`);
