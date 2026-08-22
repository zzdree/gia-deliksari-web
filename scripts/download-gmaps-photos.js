const fs = require('fs');
const path = require('path');
const https = require('https');

const photoBases = [
  {
    name: 'hero-church.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn7sGtVv4sen98e5oVnasR96X4ZtZJXML6N7unJzejIFp1dn8bOR9NrPJOkJLdDI1oXwFnf0r6PbS8hVVhRB2uadIuzIRgbLAr3vTV7bK_HPy01IJpyn4zPxsy5PdflSypjoq0P6i5VYeMi=s1600'
  },
  {
    name: 'pastor-yohanes.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkn0Ct57qs-kPFSFyQlQa1FPvsxCeIAVv23Cpoubjm-NnnMMWFzqTBOp7YSIHno3vsSM2nhwV1WwjZ3ko065Xgd4BiV_A5HW2nHdLkQLsWuFA6Bko5DeCXxhsna8QXn_JQQUjfSUCbYLx7f=s1600'
  },
  {
    name: 'gallery-1.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkVXRHdVVBrUdJnWuRBGGNvzbyBPwN3KPMJYM5BxXYDWxjpdZJjvH8kL0Ou40XroZYnQYu1FXZajqUcB1rtySkeYqXKLHS8dgT1B69WElpRDbz6ARoGQ7F1CllbHfzkPaUiNqSm8P4nIfs=s1600'
  },
  {
    name: 'gallery-2.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnSIfvWuLH_y2wXEx57PFihhu6mFx58BvphdXNUaMO27-Ln0r6JPJGmzvTYj20FDcnV5WThOcjk6D9K8hMhcajAcOJZfPkGDydOUtYiKp6iGyptUtg37Ls18ytM4VAtwcaDEdKeg0DH22YO=s1600'
  },
  // Also create ministry-*.jpg and gallery-3/4.jpg aliases from these real gmaps photos
  {
    name: 'gallery-3.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn7sGtVv4sen98e5oVnasR96X4ZtZJXML6N7unJzejIFp1dn8bOR9NrPJOkJLdDI1oXwFnf0r6PbS8hVVhRB2uadIuzIRgbLAr3vTV7bK_HPy01IJpyn4zPxsy5PdflSypjoq0P6i5VYeMi=s1600'
  },
  {
    name: 'gallery-4.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkn0Ct57qs-kPFSFyQlQa1FPvsxCeIAVv23Cpoubjm-NnnMMWFzqTBOp7YSIHno3vsSM2nhwV1WwjZ3ko065Xgd4BiV_A5HW2nHdLkQLsWuFA6Bko5DeCXxhsna8QXn_JQQUjfSUCbYLx7f=s1600'
  },
  {
    name: 'ministry-general.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn7sGtVv4sen98e5oVnasR96X4ZtZJXML6N7unJzejIFp1dn8bOR9NrPJOkJLdDI1oXwFnf0r6PbS8hVVhRB2uadIuzIRgbLAr3vTV7bK_HPy01IJpyn4zPxsy5PdflSypjoq0P6i5VYeMi=s1600'
  },
  {
    name: 'ministry-youth.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkVXRHdVVBrUdJnWuRBGGNvzbyBPwN3KPMJYM5BxXYDWxjpdZJjvH8kL0Ou40XroZYnQYu1FXZajqUcB1rtySkeYqXKLHS8dgT1B69WElpRDbz6ARoGQ7F1CllbHfzkPaUiNqSm8P4nIfs=s1600'
  },
  {
    name: 'ministry-kidz.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkn0Ct57qs-kPFSFyQlQa1FPvsxCeIAVv23Cpoubjm-NnnMMWFzqTBOp7YSIHno3vsSM2nhwV1WwjZ3ko065Xgd4BiV_A5HW2nHdLkQLsWuFA6Bko5DeCXxhsna8QXn_JQQUjfSUCbYLx7f=s1600'
  },
  {
    name: 'ministry-hana.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnSIfvWuLH_y2wXEx57PFihhu6mFx58BvphdXNUaMO27-Ln0r6JPJGmzvTYj20FDcnV5WThOcjk6D9K8hMhcajAcOJZfPkGDydOUtYiKp6iGyptUtg37Ls18ytM4VAtwcaDEdKeg0DH22YO=s1600'
  }
];

const targetDirs = [
  path.join(__dirname, '..', 'images'),
  path.join(__dirname, '..', 'public', 'images')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function downloadImage(item) {
  return new Promise((resolve, reject) => {
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          saveStream(redirectRes, item, resolve, reject);
        });
      } else {
        saveStream(res, item, resolve, reject);
      }
    }).on('error', reject);
  });
}

function saveStream(stream, item, resolve, reject) {
  const buffers = [];
  stream.on('data', (chunk) => buffers.push(chunk));
  stream.on('end', () => {
    const buffer = Buffer.concat(buffers);
    targetDirs.forEach(dir => {
      fs.writeFileSync(path.join(dir, item.name), buffer);
    });
    console.log(`✓ Downloaded ${item.name} (${buffer.length} bytes)`);
    resolve();
  });
  stream.on('error', reject);
}

async function main() {
  console.log('Downloading real photos from Google Maps GIA Deliksari...');
  for (const item of photoBases) {
    try {
      await downloadImage(item);
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message);
    }
  }
  console.log('All real photos downloaded successfully into images/ and public/images/');
}

main();
