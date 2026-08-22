const fs = require('fs');
const path = require('path');
const https = require('https');

const allPhotos = [
  // 1. Front building & Main Landmark (Google Maps)
  {
    name: 'hero-church.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn7sGtVv4sen98e5oVnasR96X4ZtZJXML6N7unJzejIFp1dn8bOR9NrPJOkJLdDI1oXwFnf0r6PbS8hVVhRB2uadIuzIRgbLAr3vTV7bK_HPy01IJpyn4zPxsy5PdflSypjoq0P6i5VYeMi=s1600',
    fallback: 'https://i.ytimg.com/vi/ZTrwdYZeIEI/maxresdefault.jpg'
  },
  // 2. Ps. Yohanes Sutono Mimbar / Firman (Real YouTube / Stream)
  {
    name: 'pastor-yohanes.jpg',
    url: 'https://i.ytimg.com/vi/Fbl1lR8DUGo/maxresdefault.jpg',
    fallback: 'https://i.ytimg.com/vi/Fbl1lR8DUGo/hqdefault.jpg'
  },
  // 3. Ibadah Raya General Ministry
  {
    name: 'ministry-general.jpg',
    url: 'https://i.ytimg.com/vi/IFykGKA2E0Q/maxresdefault.jpg',
    fallback: 'https://i.ytimg.com/vi/IFykGKA2E0Q/hqdefault.jpg'
  },
  // 4. Youth Ministry (Grow Generation PRBK)
  {
    name: 'ministry-youth.jpg',
    url: 'https://i.ytimg.com/vi/2KDP5QDnjtU/maxresdefault.jpg',
    fallback: 'https://i.ytimg.com/vi/2KDP5QDnjtU/hqdefault.jpg'
  },
  // 5. Kids Ministry (COC Kidz)
  {
    name: 'ministry-kidz.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkn0Ct57qs-kPFSFyQlQa1FPvsxCeIAVv23Cpoubjm-NnnMMWFzqTBOp7YSIHno3vsSM2nhwV1WwjZ3ko065Xgd4BiV_A5HW2nHdLkQLsWuFA6Bko5DeCXxhsna8QXn_JQQUjfSUCbYLx7f=s1600',
    fallback: 'https://i.ytimg.com/vi/9eiplLwnhc4/maxresdefault.jpg'
  },
  // 6. Hana Fellowship (Kaum Wanita)
  {
    name: 'ministry-hana.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnSIfvWuLH_y2wXEx57PFihhu6mFx58BvphdXNUaMO27-Ln0r6JPJGmzvTYj20FDcnV5WThOcjk6D9K8hMhcajAcOJZfPkGDydOUtYiKp6iGyptUtg37Ls18ytM4VAtwcaDEdKeg0DH22YO=s1600',
    fallback: 'https://i.ytimg.com/vi/thHUKVhvZjU/maxresdefault.jpg'
  },
  // 7. Gallery 1 - Praise & Worship DS Worship
  {
    name: 'gallery-1.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkVXRHdVVBrUdJnWuRBGGNvzbyBPwN3KPMJYM5BxXYDWxjpdZJjvH8kL0Ou40XroZYnQYu1FXZajqUcB1rtySkeYqXKLHS8dgT1B69WElpRDbz6ARoGQ7F1CllbHfzkPaUiNqSm8P4nIfs=s1600',
    fallback: 'https://i.ytimg.com/vi/k1K8qRnwwlg/maxresdefault.jpg'
  },
  // 8. Gallery 2 - Ibadah & Perjamuan Kudus
  {
    name: 'gallery-2.jpg',
    url: 'https://i.ytimg.com/vi/eu3gJ8QE7C4/maxresdefault.jpg',
    fallback: 'https://i.ytimg.com/vi/eu3gJ8QE7C4/hqdefault.jpg'
  },
  // 9. Gallery 3 - Suasana Ruang Ibadah & Jemaat
  {
    name: 'gallery-3.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn7sGtVv4sen98e5oVnasR96X4ZtZJXML6N7unJzejIFp1dn8bOR9NrPJOkJLdDI1oXwFnf0r6PbS8hVVhRB2uadIuzIRgbLAr3vTV7bK_HPy01IJpyn4zPxsy5PdflSypjoq0P6i5VYeMi=s1600',
    fallback: 'https://i.ytimg.com/vi/Etqw92WoJJg/maxresdefault.jpg'
  },
  // 10. Gallery 4 - Perayaan & Ibadah Spesial
  {
    name: 'gallery-4.jpg',
    url: 'https://i.ytimg.com/vi/ZTrwdYZeIEI/maxresdefault.jpg',
    fallback: 'https://i.ytimg.com/vi/ZTrwdYZeIEI/hqdefault.jpg'
  },
  // 11. Gallery 5 - Pelayanan Musik & Multimedia
  {
    name: 'gallery-5.jpg',
    url: 'https://i.ytimg.com/vi/9eiplLwnhc4/maxresdefault.jpg',
    fallback: 'https://i.ytimg.com/vi/9eiplLwnhc4/hqdefault.jpg'
  },
  // 12. Gallery 6 - Khotbah & Firman Tuhan
  {
    name: 'gallery-6.jpg',
    url: 'https://i.ytimg.com/vi/thHUKVhvZjU/maxresdefault.jpg',
    fallback: 'https://i.ytimg.com/vi/thHUKVhvZjU/hqdefault.jpg'
  },
  // 13. Gallery 7 - Persekutuan Doa & Pelayanan
  {
    name: 'gallery-7.jpg',
    url: 'https://i.ytimg.com/vi/T5wlvtdz7Ds/maxresdefault.jpg',
    fallback: 'https://i.ytimg.com/vi/T5wlvtdz7Ds/hqdefault.jpg'
  },
  // 14. Gallery 8 - Komunitas & Kebersamaan Jemaat
  {
    name: 'gallery-8.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnSIfvWuLH_y2wXEx57PFihhu6mFx58BvphdXNUaMO27-Ln0r6JPJGmzvTYj20FDcnV5WThOcjk6D9K8hMhcajAcOJZfPkGDydOUtYiKp6iGyptUtg37Ls18ytM4VAtwcaDEdKeg0DH22YO=s1600',
    fallback: 'https://i.ytimg.com/vi/k1K8qRnwwlg/maxresdefault.jpg'
  }
];

const targetDirs = [
  path.join(__dirname, '..', 'images'),
  path.join(__dirname, '..', 'public', 'images')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          const buffers = [];
          redirectRes.on('data', chunk => buffers.push(chunk));
          redirectRes.on('end', () => resolve({ buffer: Buffer.concat(buffers), status: redirectRes.statusCode }));
          redirectRes.on('error', reject);
        });
      } else {
        const buffers = [];
        res.on('data', chunk => buffers.push(chunk));
        res.on('end', () => resolve({ buffer: Buffer.concat(buffers), status: res.statusCode }));
        res.on('error', reject);
      }
    }).on('error', reject);
  });
}

async function processPhoto(item) {
  try {
    let result = await downloadUrl(item.url);
    if (result.status !== 200 || result.buffer.length < 5000) {
      if (item.fallback) {
        console.log(`Using fallback for ${item.name}...`);
        result = await downloadUrl(item.fallback);
      }
    }
    
    targetDirs.forEach(dir => {
      fs.writeFileSync(path.join(dir, item.name), result.buffer);
    });
    console.log(`✓ Saved ${item.name} (${result.buffer.length} bytes)`);
  } catch (err) {
    console.error(`Failed ${item.name}:`, err.message);
  }
}

async function main() {
  console.log('Downloading comprehensive real photo collection for GIA Deliksari...');
  for (const item of allPhotos) {
    await processPhoto(item);
  }
  console.log('Finished downloading all real photos!');
}

main();
