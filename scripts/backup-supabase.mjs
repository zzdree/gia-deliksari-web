#!/usr/bin/env node
/**
 * Backup Supabase ke JSON file.
 * Dipanggil dari .github/workflows/daily-backup.yml.
 *
 * Env vars yang dibutuhkan:
 *   SUPABASE_URL        — https://<project-ref>.supabase.co
 *   SUPABASE_SERVICE_KEY — service_role key (RAHASIA, bypass RLS)
 *
 * Output: backups/YYYYMMDD_HHMMSS.json
 */
import fs from 'node:fs';
import path from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const DEFAULT_TABLES = [
  'announcements',
  'gallery_items',
  'sermons',
  'ministry_requests',
  'profiles',
  'events',
  'bible_study_registrations',
  'small_groups',
  'small_group_members',
  'inventory',
];
const TABLES = process.env.BACKUP_TABLES
  ? process.env.BACKUP_TABLES.split(',').map(s => s.trim()).filter(Boolean)
  : DEFAULT_TABLES;

const PAGE_SIZE = 1000;
const OUT_DIR = path.resolve(process.cwd(), 'backups');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('ERROR: SUPABASE_URL dan SUPABASE_SERVICE_KEY harus di-set');
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

async function fetchAll(table) {
  const all = [];
  let offset = 0;
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&limit=${PAGE_SIZE}&offset=${offset}`;
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'count=exact',
      },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status} untuk ${table}: ${err.substring(0, 200)}`);
    }
    const rows = await res.json();
    if (!Array.isArray(rows)) {
      throw new Error(`Response bukan array untuk ${table}`);
    }
    all.push(...rows);
    if (rows.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
    if (offset > 50 * PAGE_SIZE) {
      console.warn(`[${table}] cap 50k baris tercapai`);
      break;
    }
  }
  return all;
}

async function main() {
  const startedAt = new Date().toISOString();
  console.log(`[${startedAt}] Mulai backup ${TABLES.length} tabel...`);

  const snapshot = {
    _meta: {
      exported_at: startedAt,
      supabase_url: SUPABASE_URL.replace(/\/$/, '').replace(/^https?:\/\//, ''),
      table_count: TABLES.length,
      tool: 'gia-deliksari-web/scripts/backup-supabase.mjs',
    },
    tables: {},
  };

  const failed = [];
  for (const t of TABLES) {
    try {
      const rows = await fetchAll(t);
      snapshot.tables[t] = rows;
      console.log(`  ✓ ${t}: ${rows.length} baris`);
    } catch (err) {
      console.error(`  ✗ ${t}: ${err.message}`);
      failed.push({ table: t, error: err.message });
    }
  }

  snapshot._meta.failed_tables = failed;
  snapshot._meta.total_rows = Object.values(snapshot.tables)
    .reduce((s, r) => s + (Array.isArray(r) ? r.length : 0), 0);

  const ts = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 13);
  const outFile = path.join(OUT_DIR, `${ts}.json`);
  fs.writeFileSync(outFile, JSON.stringify(snapshot, null, 2));

  console.log(`[DONE] Disimpan ke ${outFile}`);
  console.log(`       Total: ${snapshot._meta.total_rows} baris, ${failed.length} tabel gagal`);

  if (failed.length > 0) {
    fs.writeFileSync('backup-error.log',
      `Backup completed with errors:\n${JSON.stringify(failed, null, 2)}`);
    process.exit(2); // exit non-zero supaya GitHub Actions tandai sebagai failed
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  fs.writeFileSync('backup-error.log', err.stack || err.message);
  process.exit(1);
});
