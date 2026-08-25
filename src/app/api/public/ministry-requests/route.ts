import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * Public submission endpoint for prayer / sacrament / komsel / volunteer
 * requests. Validates and rate-limits before writing via service role.
 */

const ALLOWED_TYPES = new Set(['prayer', 'sacrament', 'komsel', 'volunteer']);
const MAX_LENGTHS = { name: 120, phone: 32, message: 2000, subType: 80 };
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 5; // submissions per IP per window

// Simple in-memory sliding window (per serverless instance; good-enough abuse brake)
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (list.length >= RATE_MAX) {
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) {
    // Prevent unbounded growth: drop oldest half
    const keys = [...hits.keys()].slice(0, 2500);
    keys.forEach((k) => hits.delete(k));
  }
  return false;
}

function clean(value: unknown, maxLen: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLen) : '';
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Terlalu banyak pengiriman. Coba lagi dalam beberapa menit.' },
      { status: 429 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 });
  }

  const type = clean(body.type, 20);
  const name = clean(body.name, MAX_LENGTHS.name);
  const phone = clean(body.phone, MAX_LENGTHS.phone);
  const message = clean(body.message, MAX_LENGTHS.message);
  const subType = clean(body.sub_type || body.subType, MAX_LENGTHS.subType);
  const needPastoralVisit = Boolean(body.need_pastoral_visit ?? body.needPastoralVisit);

  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: 'Jenis permohonan tidak dikenal' }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi' }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    // Still acknowledge locally-queued items gracefully
    console.warn('[public/ministry-requests] Supabase not configured; request dropped');
    return NextResponse.json({ success: true, persisted: false });
  }

  const { error } = await supabaseAdmin.from('ministry_requests').insert([
    {
      type,
      name,
      phone,
      sub_type: subType || null,
      message: message || null,
      need_pastoral_visit: needPastoralVisit,
      status: 'new',
    },
  ]);

  if (error) {
    console.error('[public/ministry-requests] insert failed:', error.message);
    return NextResponse.json({ error: 'Gagal menyimpan permohonan' }, { status: 500 });
  }

  return NextResponse.json({ success: true, persisted: true });
}
