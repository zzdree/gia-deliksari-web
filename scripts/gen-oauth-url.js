// Generate OAuth consent URL without interactive prompt
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$/);
  if (m) env[m[1]] = m[2];
});

const clientId = env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Missing GOOGLE_OAUTH_CLIENT_ID or GOOGLE_OAUTH_CLIENT_SECRET');
  process.exit(1);
}

const oauth = new google.auth.OAuth2(clientId, clientSecret);
const url = oauth.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/drive.file'],
  redirect_uri: 'http://localhost:1',
});

console.log(url);
