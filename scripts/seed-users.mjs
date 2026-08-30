#!/usr/bin/env node
/**
 * Seed initial users into the production users table.
 *
 * Idempotent: skips users that already exist (matched by username).
 *
 * Default seeded users:
 *   - andreas / 5050   → super
 *   - noel    / 1515   → admin
 *   - mara    / 1234   → treasurer
 *
 * SECURITY: passwords are hashed with bcrypt cost 10 before being sent to
 * Supabase. No plaintext password is written to disk or logs.
 *
 * Usage:
 *   node scripts/seed-users.mjs
 *   ADD_USER=andreas NEW_PASS=secret NEW_ROLE=super node scripts/seed-users.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Read env.local
const envLocal = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
const envMap = Object.fromEntries(
  envLocal
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    }),
);

const SUPABASE_URL = envMap.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = envMap.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('FATAL: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local');
  process.exit(1);
}

const BCRYPT_COST = 10;

const DEFAULT_USERS = [
  { username: 'andreas', password: '5050', role: 'super',     display_name: 'Andreas (Superuser)' },
  { username: 'noel',    password: '1515', role: 'admin',     display_name: 'Noel Yosan (Admin)' },
  { username: 'mara',    password: '1234', role: 'treasurer', display_name: 'Mara (Bendahara Youth)' },
];

async function rest(method, path, body = null, prefer = 'return=representation') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: prefer,
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  if (prefer.includes('return=representation')) {
    return res.json();
  }
  return null;
}

async function upsertUser({ username, password, role, display_name, forceRehash = false }) {
  // Check existing
  const existing = await rest(
    'GET',
    `users?select=id,role,password_hash&username=eq.${encodeURIComponent(username)}&limit=1`,
    null,
    'return=representation',
  );
  if (existing && existing.length > 0) {
    // Validate existing hash. bcrypt output is exactly 60 chars in the
    // canonical $2a$/$2b$/$2y$ format with 22-char salt + 31-char hash.
    const storedHash = existing[0].password_hash || '';
    const isValidBcrypt = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(storedHash);
    if (!isValidBcrypt || forceRehash) {
      // Rehash & update
      const password_hash = await bcrypt.hash(password, BCRYPT_COST);
      await rest('PATCH', `users?id=eq.${existing[0].id}`, {
        password_hash,
        last_login_at: null,
      });
      console.log(`  ↻ ${username.padEnd(12)} (${role.padEnd(10)}) re-hashed (was placeholder)`);
      return 'rehashed';
    }
    console.log(`  ↻ ${username.padEnd(12)} (${role.padEnd(10)}) already exists — skipping`);
    return 'skipped';
  }
  const password_hash = await bcrypt.hash(password, BCRYPT_COST);
  await rest('POST', 'users', {
    username,
    password_hash,
    role,
    display_name,
    active: true,
  });
  console.log(`  ✓ ${username.padEnd(12)} (${role.padEnd(10)}) inserted`);
  return 'inserted';
}

(async () => {
  console.log('Seeding users into Supabase…');
  let inserted = 0;
  let skipped = 0;

  for (const u of DEFAULT_USERS) {
    const result = await upsertUser(u);
    if (result === 'inserted') inserted++;
    else skipped++;
  }

  // Optional: add a single custom user via env vars
  if (process.env.ADD_USER && process.env.NEW_PASS && process.env.NEW_ROLE) {
    const result = await upsertUser({
      username: process.env.ADD_USER,
      password: process.env.NEW_PASS,
      role: process.env.NEW_ROLE,
      display_name: process.env.NEW_NAME || process.env.ADD_USER,
    });
    if (result === 'inserted') inserted++;
    else skipped++;
  }

  console.log(`\nDone. ${inserted} inserted, ${skipped} skipped.`);
})().catch((e) => {
  console.error('FATAL:', e.message);
  process.exit(1);
});