// Add new env vars to .env.local
const fs = require('fs');
const path = '.env.local';
let txt = fs.readFileSync(path, 'utf8');

const additions = [
  ['GOOGLE_DRIVE_NEW_FOLDER_ID', '"1a76JE6FUhebVf2OUUHuxsUSZGHPQ_XmK"'],
  ['GOOGLE_DRIVE_FALLBACK_FOLDER_IDS', '"1T_ahqCtmOjdFl0L-MNu7bIQo-8Oz8y9h"'],
];

let changed = 0;
for (const [key, val] of additions) {
  if (txt.includes(`${key}=`)) {
    console.log('SKIP (exists):', key);
    continue;
  }
  // Insert before the # ========================================== block right above GOOGLE_SERVICE_ACCOUNT_EMAIL
  const marker = '\nGOOGLE_SERVICE_ACCOUNT_EMAIL=';
  if (!txt.includes(marker)) {
    console.error('Cannot find service account email line');
    process.exit(1);
  }
  txt = txt.replace(
    marker,
    `\n${key}=${val}${marker}`
  );
  changed++;
  console.log('ADDED:', key);
}

if (changed > 0) {
  fs.writeFileSync(path, txt);
  console.log('Wrote', path);
} else {
  console.log('No changes needed');
}
