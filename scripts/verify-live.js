// End-to-end verification of the live Vercel deployment.
const SITE = process.env.SITE_URL || 'https://gia-deliksari-web.vercel.app';

const log = (label, ok, extra = '') =>
  console.log(`  ${ok ? '✓' : '✗'} ${label}${extra ? ' — ' + extra : ''}`);

async function get(p) {
  const r = await fetch(SITE + p);
  const text = await r.text();
  return { status: r.status, body: text };
}

async function postJson(p, data) {
  const r = await fetch(SITE + p, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const text = await r.text();
  return { status: r.status, body: text };
}

function buildMultipart(fields, file) {
  const boundary = '----' + Math.random().toString(36).slice(2);
  const CRLF = '\r\n';
  const parts = [];
  for (const [k, v] of Object.entries(fields)) {
    parts.push(
      `--${boundary}${CRLF}Content-Disposition: form-data; name="${k}"${CRLF}${CRLF}${v}${CRLF}`
    );
  }
  if (file) {
    parts.push(
      `--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="${file.name}"${CRLF}Content-Type: ${file.type}${CRLF}${CRLF}`
    );
  }
  let body = Buffer.from(parts.join(''), 'utf8');
  if (file) body = Buffer.concat([body, file.buf, Buffer.from(CRLF, 'utf8')]);
  body = Buffer.concat([body, Buffer.from(`--${boundary}--${CRLF}`, 'utf8')]);
  return { body, contentType: `multipart/form-data; boundary=${boundary}` };
}

function snippet(t, n = 220) {
  try { return JSON.stringify(JSON.parse(t)).slice(0, n); } catch { return t.slice(0, n); }
}

(async () => {
  console.log(`\n=== Verifying ${SITE} ===\n`);

  // 1. Home
  try {
    const r = await get('/');
    log('Home (/)', r.status >= 200 && r.status < 400, `HTTP ${r.status}`);
  } catch (e) { log('Home (/)', false, e.message); }

  // 2. Public data — gallery random
  try {
    const r = await get('/api/public/data?table=gallery_items&random=true&limit=6');
    const ok = r.status === 200;
    const arr = JSON.parse(r.body).items || [];
    log('Public gallery random', ok && arr.length >= 0, `HTTP ${r.status} items=${arr.length}`);
  } catch (e) { log('Public gallery random', false, e.message); }

  // 3. Public data — announcements
  try {
    const r = await get('/api/public/data?table=announcements');
    const ok = r.status === 200;
    const arr = JSON.parse(r.body).items || [];
    log('Public announcements', ok, `HTTP ${r.status} items=${arr.length}`);
  } catch (e) { log('Public announcements', false, e.message); }

  // 4. Public data — sermons
  try {
    const r = await get('/api/public/data?table=sermons');
    const ok = r.status === 200;
    const arr = JSON.parse(r.body).items || [];
    log('Public sermons', ok, `HTTP ${r.status} items=${arr.length}`);
  } catch (e) { log('Public sermons', false, e.message); }

  // 5. Public data — servant_rosters
  try {
    const r = await get('/api/public/data?table=servant_rosters');
    const ok = r.status === 200;
    const arr = JSON.parse(r.body).items || [];
    log('Public servant_rosters', ok, `HTTP ${r.status} items=${arr.length}`);
  } catch (e) { log('Public servant_rosters', false, e.message); }

  // 6. YouTube latest
  try {
    const r = await get('/api/youtube/latest');
    const ok = r.status === 200;
    let detail = `HTTP ${r.status}`;
    try {
      const j = JSON.parse(r.body);
      detail += ` source=${j.source} count=${(j.sermons || j.videos || []).length}`;
    } catch {}
    log('YouTube latest', ok, detail);
  } catch (e) { log('YouTube latest', false, e.message); }

  // 7. Gallery upload (real Drive+Supabase round trip)
  console.log('\n  -- Gallery upload (1x1 PNG) --');
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );
  const { body, contentType } = buildMultipart(
    {
      title: 'verify-e2e',
      category: 'kegiatan',
      date: new Date().toISOString().slice(0, 10),
      uploaderName: 'verify-script',
    },
    { name: 'verify.png', type: 'image/png', buf: png }
  );
  try {
    const r = await fetch(SITE + '/api/gallery/upload', {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body,
    });
    const text = await r.text();
    let parsed = null;
    try { parsed = JSON.parse(text); } catch {}
    const ok = r.status === 200 && parsed?.success;
    let extra = `HTTP ${r.status}`;
    if (parsed?.googleDrive) {
      extra += ` drive.synced=${parsed.googleDrive.synced}`;
      if (parsed.googleDrive.fileId) extra += ` fileId=${parsed.googleDrive.fileId}`;
      if (parsed.googleDrive.link) extra += ` link=${parsed.googleDrive.link}`;
      if (parsed.googleDrive.error) extra += ` driveError=${parsed.googleDrive.error}`;
    }
    log('Gallery upload', ok, extra);
    if (!ok) console.log('    Raw body:', text.slice(0, 600));

    // 8. If drive synced, verify the link is publicly readable
    if (ok && parsed?.googleDrive?.link) {
      try {
        const linkCheck = await fetch(parsed.googleDrive.link, { redirect: 'follow' });
        const linkOk = linkCheck.status >= 200 && linkCheck.status < 400;
        log('  └─ Drive link publicly readable', linkOk, `HTTP ${linkCheck.status}`);
      } catch (e) {
        log('  └─ Drive link publicly readable', false, e.message);
      }
    }
  } catch (e) { log('Gallery upload', false, e.message); }

  // 9. Fetch the gallery back to confirm the new item appears
  try {
    const r = await get('/api/public/data?table=gallery_items&random=true&limit=20');
    const arr = JSON.parse(r.body).items || [];
    const found = arr.find((it) => (it.title || '').includes('verify-e2e'));
    log('Verify-e2e appears in public gallery', !!found, `items=${arr.length}`);
  } catch (e) { log('Verify-e2e appears in public gallery', false, e.message); }

  console.log('\n=== Done ===\n');
})();
