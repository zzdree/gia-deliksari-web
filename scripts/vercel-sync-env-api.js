// Sync .env.local → Vercel via REST API (most reliable, no CLI prompts).
const fs = require('fs');
const path = require('path');
const https = require('https');

const auth = JSON.parse(
  fs.readFileSync(path.join(process.env.USERPROFILE, '.vercel', 'auth.json'), 'utf8')
);
const TOKEN = auth.token;

const envTxt = fs.readFileSync('.env.local', 'utf8');
const env = {};
envTxt.split(/\r?\n/).forEach((l) => {
  if (!l || l.trim().startsWith('#')) return;
  const i = l.indexOf('=');
  if (i < 0) return;
  const k = l.slice(0, i).trim();
  let v = l.slice(i + 1).replace(/^['"]|['"]$/g, '').trim();
  env[k] = v;
});

// Sensitive keys (private key + tokens) get type=encrypted+sensitive.
const SENSITIVE = new Set([
  'SUPABASE_ACCESS_TOKEN',
  'YOUTUBE_API_KEY',
  'GOOGLE_DRIVE_API_KEY',
  'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
]);

const serverOnly = Object.entries(env).filter(
  ([k, v]) => !k.startsWith('NEXT_PUBLIC_') && v && v.length > 0
);

console.log('Syncing', serverOnly.length, 'server env vars via REST API.\n');

function api(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        host: 'api.vercel.com',
        method,
        path: urlPath,
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => {
          const parsed = buf ? (() => { try { return JSON.parse(buf); } catch { return buf; } })() : null;
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getExisting(projectId) {
  const res = await api('GET', `/v10/projects/${projectId}/env`);
  if (res.status !== 200) {
    console.log('GET env list failed:', res.status, JSON.stringify(res.body).slice(0, 200));
    return [];
  }
  return res.body.envs || [];
}

async function createEnv(projectId, key, value, type, target) {
  return api('POST', `/v10/projects/${projectId}/env`, {
    key,
    value,
    type,
    target: [target],
  });
}

async function deleteEnv(projectId, envId) {
  return api('DELETE', `/v10/projects/${projectId}/env/${envId}`);
}

(async () => {
  // Get project id
  const proj = await api('GET', '/v9/projects/gia-deliksari-web');
  if (proj.status !== 200) {
    console.error('Project lookup failed:', proj.status, JSON.stringify(proj.body).slice(0, 200));
    process.exit(1);
  }
  const projectId = proj.body.id;
  console.log('Project ID:', projectId, '\n');

  const existing = await getExisting(projectId);
  const byKey = new Map();
  for (const e of existing) {
    if (!byKey.has(e.key)) byKey.set(e.key, []);
    byKey.get(e.key).push(e);
  }

  let added = 0, updated = 0, skipped = 0, failed = 0;
  for (const [k, v] of serverOnly) {
    const type = SENSITIVE.has(k) ? 'sensitive' : 'plain';
    for (const target of ['production', 'preview']) {
      const match = byKey.get(k)?.find((e) => e.target.includes(target));
      // Always delete+recreate to be safe (avoid stale values).
      if (match) {
        const del = await deleteEnv(projectId, match.id);
        if (del.status >= 200 && del.status < 300) {
          // ok
        } else {
          console.log(`  ! ${k} ${target}: delete-old failed (${del.status}), continuing`);
        }
      }
      const r = await createEnv(projectId, k, v, type, target);
      if (r.status >= 200 && r.status < 300) {
        console.log(`  ✓ ${k} → ${target} (${type})`);
        added++;
      } else {
        console.log(`  ✗ ${k} → ${target}: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
        failed++;
      }
    }
  }

  console.log(`\nDone. added=${added} failed=${failed}`);
})();
