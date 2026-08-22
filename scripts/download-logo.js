const fs = require('fs');
const path = require('path');
const https = require('https');

const logoSources = [
  {
    name: 'logo.png',
    url: 'https://yt3.googleusercontent.com/U8XB_2AhbIcjRniC7BEtVnmOHGCRx8kcpaBj3vEoE_v_iN_kjUls9n6i0ea3DBlqsmGPyI3eJA=s900-c-k-c0x00ffffff-no-rj'
  },
  {
    name: 'logo.jpg',
    url: 'https://yt3.googleusercontent.com/U8XB_2AhbIcjRniC7BEtVnmOHGCRx8kcpaBj3vEoE_v_iN_kjUls9n6i0ea3DBlqsmGPyI3eJA=s900-c-k-c0x00ffffff-no-rj'
  },
  {
    name: 'logo-ig.jpg',
    url: 'https://scontent-cgk1-2.cdninstagram.com/v/t51.82787-19/601858837_18091870004513486_7542084463180828577_n.jpg?stp=dst-jpg_s320x320_tt6&_nc_cat=107&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=t1akj60DlRgQ7kNvwGBliKn&_nc_oc=AdoeRLYV-z4NTf0VzMZmy9QxgRHQ4sWr2nlq-3UYZC7_NVHHuhbsnvq7t88CuCjVEyw&_nc_zt=24&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_gid=IGZ7TLMlpPqz1gSK63VtYQ&_nc_ss=7ba8c&oh=00_AQH_CUy_4OwycCKeanIHmpPhFTdjGuI7Jqd3uhWfDdybGg&oe=6A8FD212'
  }
];

const targetDirs = [
  path.join(__dirname, '..', 'images'),
  path.join(__dirname, '..', 'public', 'images')
];

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, redirectRes => {
          const bufs = [];
          redirectRes.on('data', c => bufs.push(c));
          redirectRes.on('end', () => {
            const buf = Buffer.concat(bufs);
            targetDirs.forEach(d => fs.writeFileSync(path.join(d, item.name), buf));
            console.log(`✓ Saved ${item.name} (${buf.length} bytes)`);
            resolve();
          });
          redirectRes.on('error', reject);
        });
      } else {
        const bufs = [];
        res.on('data', c => bufs.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(bufs);
          targetDirs.forEach(d => fs.writeFileSync(path.join(d, item.name), buf));
          console.log(`✓ Saved ${item.name} (${buf.length} bytes)`);
          resolve();
        });
        res.on('error', reject);
      }
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading official GIA Deliksari logo from IG / YT profile...');
  for (const item of logoSources) {
    try {
      await downloadFile(item);
    } catch (e) {
      console.error(`Error downloading ${item.name}:`, e.message);
    }
  }
  console.log('Logo download complete!');
}

run();
