#!/usr/bin/env node
/**
 * Sync Production DB directly via Supabase REST API.
 *
 * Bypasses Next.js /api/admin/data (which has been returning 500 with
 * 'Invalid API key' on production despite valid keys — likely a code/init
 * issue not worth debugging for a one-shot data migration).
 *
 * Strategy: idempotent per row. For each row in the seed file:
 *   - If a row with the same (title, eventDate/serviceDate/code) exists → update
 *   - Else → insert
 * Then delete rows whose (title, date) isn't in the seed (carefully!).
 *
 * Usage:
 *   node scripts/sync-prod-db.mjs                  # sync all 3 tables
 *   node scripts/sync-prod-db.mjs --tables=roster  # sync roster only
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// --------------------------------------------------------------------------
// Load .env.local
// --------------------------------------------------------------------------
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
const SVC_KEY = envMap.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = envMap.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TABLES_ARG = process.argv.find((a) => a.startsWith('--tables='));
const TABLES = TABLES_ARG
  ? TABLES_ARG.slice('--tables='.length).split(',')
  : ['roster', 'announcements', 'inventory'];

// --------------------------------------------------------------------------
// REST helpers
// --------------------------------------------------------------------------
async function rest(method, tablePath, body = null, prefer = 'return=minimal') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${tablePath}`, {
    method,
    headers: {
      apikey: SVC_KEY,
      Authorization: `Bearer ${SVC_KEY}`,
      'Content-Type': 'application/json',
      Prefer: prefer,
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${tablePath} → HTTP ${res.status}: ${text.slice(0, 250)}`);
  }
  if (prefer.includes('return=representation')) {
    return res.json();
  }
  return null;
}

async function selectAll(table) {
  // Pagination — Supabase caps at 1000 rows per request
  let all = [];
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const rows = await rest(
      'GET',
      `${table}?select=*&offset=${offset}&limit=${pageSize}`,
      null,
      'return=representation',
    );
    if (!rows || rows.length === 0) break;
    all.push(...rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

async function deleteById(table, id) {
  await rest('DELETE', `${table}?id=eq.${id}`);
}

async function upsertRow(table, row) {
  // Upsert via PostgREST — requires a UNIQUE constraint or Primary Key.
  // All tables have id (uuid PK). We pass id explicitly so subsequent calls
  // overwrite instead of inserting duplicates.
  return rest(
    'POST',
    table,
    row,
    'return=representation,resolution=merge-duplicates',
  );
}

// --------------------------------------------------------------------------
// seedData loader
// --------------------------------------------------------------------------
function loadSeedData() {
  let src = fs.readFileSync(path.join(ROOT, 'src/lib/seedData.ts'), 'utf8');
  src = src
    .replace(/^import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^import\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^export\s+const\s+(INITIAL_\w+)\s*:\s*\w+\[\]\s*=/gm, 'const $1 =')
    .replace(/^export\s+const\s+(INITIAL_\w+)\s*:\s*\w+\s*=/gm, 'const $1 =');
  const module = { exports: {} };
  const fn = new Function(
    'exports', 'module',
    src + '\nmodule.exports = { INITIAL_ROSTER, INITIAL_ANNOUNCEMENTS, INITIAL_INVENTORY };',
  );
  fn(module.exports, module);
  return module.exports;
}

// --------------------------------------------------------------------------
// Mappers — match src/lib/storage.ts to*DB functions
// --------------------------------------------------------------------------
function toAnnouncementDB(m) {
  return {
    id: m.id.startsWith('ann-') ? undefined : m.id,
    title: m.title,
    category: m.category,
    content: m.content,
    event_date: m.eventDate,
    is_pinned: !!m.isPinned,
    is_published: m.isPublished !== false,
    badge_text: m.badgeText || null,
    author: m.author || null,
  };
}

function toRosterDB(m) {
  return {
    id: m.id.startsWith('rst-') ? undefined : m.id,
    service_category: m.serviceCategory,
    service_date: m.serviceDate,
    role: m.role,
    servant_name: m.servantName,
    phone: m.phone || null,
    status: m.status,
    notes: m.notes || null,
  };
}

function toInventoryDB(m) {
  return {
    id: m.id.startsWith('inv-') ? undefined : m.id,
    name: m.name,
    category: m.category,
    code: m.code,
    quantity: m.quantity,
    is_checked: !!m.isChecked,
    condition: m.condition,
    location: m.location,
    notes: m.notes || null,
    last_checked_at: m.lastCheckedAt || null,
    checked_by: m.checkedBy || null,
  };
}

// --------------------------------------------------------------------------
// Sync strategies per table
// --------------------------------------------------------------------------
async function syncRoster(seed) {
  console.log('\n── Sync servant_rosters ──');
  const existing = await selectAll('servant_rosters');
  console.log(`  existing: ${existing.length}`);
  const seedRows = seed.map(toRosterDB);

  // Match by (service_category, service_date, role, servant_name)
  const matchKey = (r) => `${r.service_category}|${r.service_date}|${r.role}|${r.servant_name}`;

  // 1) Upsert all seed rows (id auto-generated if undefined; PostgREST
  //    merge-duplicates won't trigger because no PK conflict)
  let added = 0;
  let updated = 0;
  for (const row of seedRows) {
    const matched = existing.find(
      (e) => matchKey(e) === matchKey(row) && e.role === row.role,
    );
    if (matched) {
      // Update in place
      const payload = { ...row, id: matched.id };
      delete payload.id && delete payload.id; // keep
      await rest('PATCH', `servant_rosters?id=eq.${matched.id}`, row);
      updated++;
    } else {
      const payload = { ...row };
      delete payload.id;
      await rest('POST', 'servant_rosters', payload, 'return=representation');
      added++;
    }
  }
  console.log(`  ✓ ${added} added, ${updated} updated`);

  // 2) Delete rows no longer in seed (matched by key)
  const seedKeys = new Set(seedRows.map(matchKey));
  const stale = existing.filter((e) => !seedKeys.has(matchKey(e)));
  for (const row of stale) {
    await deleteById('servant_rosters', row.id);
  }
  console.log(`  ✓ ${stale.length} stale rows deleted`);
}

async function syncAnnouncements(seed) {
  console.log('\n── Sync announcements ──');
  const existing = await selectAll('announcements');
  console.log(`  existing: ${existing.length}`);
  const seedRows = seed.map(toAnnouncementDB);
  const matchKey = (r) => `${r.title}|${r.event_date}`;

  let added = 0;
  let updated = 0;
  for (const row of seedRows) {
    const matched = existing.find((e) => matchKey(e) === matchKey(row));
    if (matched) {
      await rest('PATCH', `announcements?id=eq.${matched.id}`, row);
      updated++;
    } else {
      const payload = { ...row };
      delete payload.id;
      await rest('POST', 'announcements', payload, 'return=representation');
      added++;
    }
  }
  console.log(`  ✓ ${added} added, ${updated} updated`);

  const seedKeys = new Set(seedRows.map(matchKey));
  const stale = existing.filter((e) => !seedKeys.has(matchKey(e)));
  for (const row of stale) {
    await deleteById('announcements', row.id);
  }
  console.log(`  ✓ ${stale.length} stale rows deleted`);
}

async function syncInventory(seed) {
  console.log('\n── Sync inventory_items ──');
  const existing = await selectAll('inventory_items');
  console.log(`  existing: ${existing.length}`);
  const seedRows = seed.map(toInventoryDB);
  const matchKey = (r) => r.code; // code is unique

  let added = 0;
  let updated = 0;
  for (const row of seedRows) {
    const matched = existing.find((e) => e.code === row.code);
    if (matched) {
      await rest('PATCH', `inventory_items?id=eq.${matched.id}`, row);
      updated++;
    } else {
      const payload = { ...row };
      delete payload.id;
      await rest('POST', 'inventory_items', payload, 'return=representation');
      added++;
    }
  }
  console.log(`  ✓ ${added} added, ${updated} updated`);

  const seedCodes = new Set(seedRows.map((r) => r.code));
  const stale = existing.filter((e) => !seedCodes.has(e.code));
  for (const row of stale) {
    await deleteById('inventory_items', row.id);
  }
  console.log(`  ✓ ${stale.length} stale rows deleted`);
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------
(async () => {
  console.log(`Target: ${SUPABASE_URL}`);
  console.log(`Tables: ${TABLES.join(', ')}`);

  const seed = loadSeedData();
  const runners = {
    roster: () => syncRoster(seed.INITIAL_ROSTER),
    announcements: () => syncAnnouncements(seed.INITIAL_ANNOUNCEMENTS),
    inventory: () => syncInventory(seed.INITIAL_INVENTORY),
  };

  try {
    for (const t of TABLES) {
      if (!runners[t]) throw new Error(`Unknown table '${t}'`);
      await runners[t]();
    }
    console.log('\n✅ Sync selesai');
  } catch (e) {
    console.error('\n❌ Gagal:', e.message);
    process.exit(1);
  }
})();