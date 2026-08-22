const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://azgyihsukmatsggppxuz.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const announcements = [
  {
    title: 'Ibadah Raya Hari Minggu & Perjamuan Kudus',
    category: 'general',
    content: 'Mari hadir bersama keluarga dalam Ibadah Raya GIA Deliksari setiap Minggu pukul 07.00 WIB. Disertai Sakramen Perjamuan Kudus pada Minggu pertama awal bulan.',
    event_date: '2026-08-30',
    is_pinned: true,
    is_published: true,
    badge_text: 'Ibadah Utama',
    author: 'Sekretariat GIA Deliksari'
  },
  {
    title: 'Grow Generation Youth Fellowship: "Unstoppable Faith"',
    category: 'youth',
    content: 'Teman-teman kaum muda & remaja PRBK Deliksari, jangan lewatkan persekutuan sabtu ceria penuh praise and worship, firman Tuhan, dan games seru!',
    event_date: '2026-08-29',
    is_pinned: true,
    is_published: true,
    badge_text: 'Youth Service',
    author: 'Pengurus Grow Generation'
  },
  {
    title: 'Sekolah Minggu COC Kidz: "Aku Anak Terang"',
    category: 'kidz',
    content: 'Panggilan untuk semua adik-adik terkasih! Kelas Sekolah Minggu Children Of Christ (COC Kidz) hadir dengan cerita Alkitab interaktif, mewarnai, dan bernyanyi bersama.',
    event_date: '2026-08-30',
    is_pinned: false,
    is_published: true,
    badge_text: 'Kids Ministry',
    author: 'Guru Sekolah Minggu COC Kidz'
  },
  {
    title: 'Persekutuan Kaum Wanita "Hana Fellowship"',
    category: 'hana',
    content: 'Mengundang seluruh ibu-ibu dan kaum wanita jemaat dalam doa bersama, saling menguatkan, dan pendalaman firman Tuhan setiap hari Selasa sore.',
    event_date: '2026-09-01',
    is_pinned: false,
    is_published: true,
    badge_text: 'Wanita Bijak',
    author: 'Komisi Wanita Hana'
  }
];

const rosters = [
  {
    service_category: 'general',
    service_date: '2026-08-30',
    role: 'Worship Leader (WL)',
    servant_name: 'Sdr. Kevin Christian',
    phone: '081234567890',
    status: 'confirmed',
    notes: 'Latihan Sabtu pukul 18.30 WIB'
  },
  {
    service_category: 'general',
    service_date: '2026-08-30',
    role: 'Singer & Backing Vocal',
    servant_name: 'Sdri. Maria & Ibu Grace',
    phone: '081234567891',
    status: 'confirmed',
    notes: 'Dress code: Biru Navy / Putih'
  },
  {
    service_category: 'general',
    service_date: '2026-08-30',
    role: 'Pemusik (Keyboard & Bass)',
    servant_name: 'Sdr. Daniel & Sdr. Yohanes',
    phone: '081234567892',
    status: 'confirmed',
    notes: 'Cek kabel jack & instrumen jam 06.00 WIB'
  },
  {
    service_category: 'general',
    service_date: '2026-08-30',
    role: 'Multimedia & Live Stream Operator',
    servant_name: 'Sdr. Andreas',
    phone: '081234567893',
    status: 'confirmed',
    notes: 'Live streaming YouTube @GIADeliksariSemarang'
  },
  {
    service_category: 'youth',
    service_date: '2026-08-29',
    role: 'WL & Music Leader Youth',
    servant_name: 'Sdr. Samuel Pratama',
    phone: '081234567894',
    status: 'confirmed',
    notes: 'Tema: Unstoppable Faith'
  },
  {
    service_category: 'kidz',
    service_date: '2026-08-30',
    role: 'Guru Kelas Kecil & Cerita Alkitab',
    servant_name: 'Kak Ruth & Kak Ester',
    phone: '081234567895',
    status: 'confirmed',
    notes: 'Siapkan lembar aktivitas mewarnai'
  },
  {
    service_category: 'hana',
    service_date: '2026-09-01',
    role: 'Pemimpin Doa & Firman',
    servant_name: 'Ibu Ps. Yohanes Sutono',
    phone: '081234567896',
    status: 'confirmed',
    notes: 'Ruang Fellowship Lt. 1'
  }
];

const inventory = [
  {
    name: 'Wireless Microphone Shure Beta 58A',
    category: 'Sound System',
    code: 'MIC-001',
    quantity: 2,
    is_checked: true,
    condition: 'good',
    location: 'Meja Sound Operator (Rak A)',
    notes: 'Baterai AA sudah dicek penuh'
  },
  {
    name: 'Digital Audio Mixer Behringer X32',
    category: 'Sound System',
    code: 'MIX-001',
    quantity: 1,
    is_checked: true,
    condition: 'good',
    location: 'Ruang Kontrol Sound',
    notes: 'Preset ibadah raya sudah tersimpan di channel 1-16'
  },
  {
    name: 'Kamera Live Streaming & Tripod Sony',
    category: 'Multimedia & Kamera',
    code: 'CAM-001',
    quantity: 1,
    is_checked: true,
    condition: 'good',
    location: 'Balkon Tengah',
    notes: 'Capture card HDMI to OBS terpasang baik'
  },
  {
    name: 'Proyektor Utama Mimbar & Layar Motorized',
    category: 'Multimedia & Kamera',
    code: 'PRJ-001',
    quantity: 1,
    is_checked: true,
    condition: 'good',
    location: 'Plafon Depan Mimbar',
    notes: 'Koneksi HDMI ke PC Operator lancar'
  },
  {
    name: 'Keyboard Yamaha Montage 8',
    category: 'Alat Musik',
    code: 'MUS-001',
    quantity: 1,
    is_checked: true,
    condition: 'good',
    location: 'Panggung Kiri',
    notes: 'Kabel jack stereo sudah siap'
  },
  {
    name: 'Drum Akustik Set + Sabian Cymbals',
    category: 'Alat Musik',
    code: 'DRM-001',
    quantity: 1,
    is_checked: true,
    condition: 'good',
    location: 'Drum Shield Kanan',
    notes: 'Drum shield akrilik bersih'
  },
  {
    name: 'Cawan & Nampan Sakramen Perjamuan Kudus',
    category: 'Ibadah & Ruangan',
    code: 'IBD-001',
    quantity: 4,
    is_checked: true,
    condition: 'good',
    location: 'Lemari Pastori Lt. 1',
    notes: 'Sudah disterilkan dan siap pakai'
  }
];

async function seed() {
  console.log('Seeding Supabase DB...');
  
  const { data: annData, error: annErr } = await supabase.from('announcements').insert(announcements).select();
  if (annErr) console.error('Announcement insert error:', annErr);
  else console.log(`✓ Inserted ${annData.length} announcements`);

  const { data: rostData, error: rostErr } = await supabase.from('servant_rosters').insert(rosters).select();
  if (rostErr) console.error('Roster insert error:', rostErr);
  else console.log(`✓ Inserted ${rostData.length} servant rosters`);

  const { data: invData, error: invErr } = await supabase.from('inventory_items').insert(inventory).select();
  if (invErr) console.error('Inventory insert error:', invErr);
  else console.log(`✓ Inserted ${invData.length} inventory items`);

  console.log('Database seeding complete!');
}

seed();
