const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'schema.sql'), 'utf8');
const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = 'azgyihsukmatsggppxuz';

async function run() {
  if (!token) {
    console.error('SUPABASE_ACCESS_TOKEN is not defined in environment or .env.local');
    return;
  }
  console.log('Connecting to Supabase Management API...');
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });
    const status = res.status;
    const text = await res.text();
    console.log('HTTP Status:', status);
    console.log('API Response:', text);
  } catch (err) {
    console.error('Execution error:', err);
  }
}

run();
