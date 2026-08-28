// Debug script: probe Drive folders from Vercel environment perspective
const https = require('https');

async function callApi(path, method = 'GET', body = null) {
  const url = 'https://gia-deliksari-web.vercel.app' + path;
  const data = body ? JSON.stringify(body) : null;
  return new Promise((resolve) => {
    const req = https.request(
      {
        method,
        hostname: 'gia-deliksari-web.vercel.app',
        path,
        headers: {
          ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve({ status: res.statusCode, body: buf }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    if (data) req.write(data);
    req.end();
  });
}

async function callForm(path, fields, file) {
  const boundary = '----' + Math.random().toString(36).slice(2);
  const CRLF = '\r\n';
  const parts = [];
  for (const [k, v] of Object.entries(fields)) {
    parts.push(`--${boundary}${CRLF}Content-Disposition: form-data; name="${k}"${CRLF}${CRLF}${v}${CRLF}`);
  }
  if (file) {
    parts.push(`--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="${file.name}"${CRLF}Content-Type: ${file.type}${CRLF}${CRLF}`);
  }
  let body = Buffer.from(parts.join(''), 'utf8');
  if (file) body = Buffer.concat([body, file.buf, Buffer.from(CRLF, 'utf8')]);
  body = Buffer.concat([body, Buffer.from(`--${boundary}--${CRLF}`, 'utf8')]);
  
  return new Promise((resolve) => {
    const req = https.request(
      {
        method: 'POST',
        hostname: 'gia-deliksari-web.vercel.app',
        path,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve({ status: res.statusCode, body: buf }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log('\n=== Debugging from production ===\n');
  
  // 1. Gallery sync (POST with empty body to trigger auth check)
  try {
    const r = await callApi('/api/gallery/sync', 'POST', {});
    console.log('Gallery sync (POST):', r.status, r.body.slice(0, 200));
  } catch (e) { console.log('Gallery sync error:', e.message); }

  // 2. Test upload with debug
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );
  const r = await callForm('/api/gallery/upload', {
    title: 'debug-test',
    category: 'kegiatan',
    date: new Date().toISOString().slice(0, 10),
    uploaderName: 'debug-script',
  }, { name: 'debug.png', type: 'image/png', buf: png });
  
  console.log('\nUpload result:', r.status);
  console.log('Body:', r.body.slice(0, 800));
  
  // 3. Check gallery items
  try {
    const r = await callApi('/api/public/data?table=gallery_items&random=true&limit=20');
    console.log('\nGallery items (random):', r.status, r.body.slice(0, 300));
  } catch (e) { console.log('Gallery items error:', e.message); }
})();
