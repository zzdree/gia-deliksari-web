import { ImageResponse } from 'next/og';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * Dynamic Open Graph image for /info page.
 *
 * Next.js convention: any opengraph-image.tsx in a route segment is auto-picked
 * up by the metadata system. Image is rendered on-demand, cached at edge.
 *
 * Composition: branded chrome + first 3 upcoming warta titles + countdown
 * to nearest event. Color palette follows DESIGN.md (Sacred Crimson / Warm Cream).
 *
 * No external fonts — uses platform default (system-ui) for maximum compat
 * with image-rendering pipeline (edge runtime + OG scrapers).
 */

export const runtime = 'edge';
export const alt = 'GIA Deliksari Semarang — Papan Warta & Jadwal Pelayanan';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function fetchUpcoming() {
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return { announcements: [], nextEvent: null };
  }
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: announcements }, { data: roster }] = await Promise.all([
    supabaseAdmin
      .from('announcements')
      .select('title, category, event_date')
      .eq('is_published', true)
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(3),
    supabaseAdmin
      .from('servant_rosters')
      .select('service_date, service_category')
      .gte('service_date', today)
      .order('service_date', { ascending: true })
      .limit(1),
  ]);
  return {
    announcements: announcements ?? [],
    nextEvent: roster?.[0] ?? null,
  };
}

const CATEGORY_LABEL: Record<string, string> = {
  general: 'Ibadah Raya',
  youth: 'Grow Youth',
  kidz: 'COC Kidz',
  hana: 'Wanita Hana',
};

function fmtDate(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default async function Image() {
  const { announcements, nextEvent } = await fetchUpcoming();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #FDFBF7 0%, #FDF0F0 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 60,
          position: 'relative',
        }}
      >
        {/* Top decorative crimson bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: 'linear-gradient(to right, #C5222E, #80141C)',
            display: 'flex',
          }}
        />

        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #C5222E, #80141C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 900,
              color: 'white',
              boxShadow: '0 8px 24px rgba(197,34,46,0.4)',
            }}
          >
            G
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#1F1617', letterSpacing: '-1px' }}>
              GIA DELIKSARI
            </div>
            <div style={{ fontSize: 18, color: '#6E5D5F', fontWeight: 600, marginTop: 4 }}>
              Semarang · Growing Church!
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 36 }}>
          <div style={{ fontSize: 22, color: '#9A1620', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
            📋 Papan Warta & Jadwal Pelayanan
          </div>
          <div style={{ fontSize: 52, color: '#1F1617', fontWeight: 900, lineHeight: 1.1, marginTop: 12 }}>
            Warta Jemaat
            <br />
            <span style={{ color: '#C5222E' }}>Minggu Ini</span>
          </div>
        </div>

        {/* Warta list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          {announcements.length === 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 24,
                background: 'rgba(255,255,255,0.6)',
                borderRadius: 20,
                border: '2px solid #EBDDCF',
              }}
            >
              <div style={{ fontSize: 28 }}>📅</div>
              <div style={{ fontSize: 22, color: '#6E5D5F', fontStyle: 'italic' }}>
                Warta jemaat akan tampil di sini setelah pengurus menginputnya.
              </div>
            </div>
          ) : (
            announcements.map((a, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: 20,
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: 18,
                  borderLeft: '8px solid #C5222E',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    background: '#FDF0F0',
                    color: '#9A1620',
                    fontSize: 14,
                    fontWeight: 800,
                    padding: '6px 12px',
                    borderRadius: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    minWidth: 120,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {CATEGORY_LABEL[a.category] || a.category}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: '#1F1617',
                      lineHeight: 1.2,
                      maxWidth: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {a.title}
                  </div>
                  <div style={{ fontSize: 16, color: '#6E5D5F', marginTop: 4 }}>
                    📅 {fmtDate(a.event_date)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 32,
            paddingTop: 24,
            borderTop: '2px solid #EBDDCF',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 16, color: '#5A4D4E', fontWeight: 600 }}>
              gia-deliksari-web.vercel.app/info
            </div>
            {nextEvent && (
              <div style={{ fontSize: 14, color: '#B87A14', marginTop: 4 }}>
                ⏰ Ibadah terdekat: {fmtDate(nextEvent.service_date)} —{' '}
                {CATEGORY_LABEL[nextEvent.service_category] || nextEvent.service_category}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: 14,
              color: '#9A1620',
              fontWeight: 800,
              padding: '8px 16px',
              background: '#FDF0F0',
              borderRadius: 12,
              border: '2px solid #F5CDD0',
            }}
          >
            🔥 Growing Church
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}