# Product Requirements Document (PRD) — GIA Deliksari Web Portal
**Versi:** 3.3.0 (Harmonized Public, Media Pipeline & Rolling Cloud Storage Edition)  
**Status:** In Progress / Production Ready  
**Tanggal Diperbarui:** 23 Agustus 2026  
**Identitas Gereja:** Gereja Isa Almasih (GIA) Deliksari Semarang — *"Growing Church!"*  
**Penggembalaan:** Ps. Yohanes Sutono & Ibu Santini | Kak Noel Yosan & Vellin  
**Target URL Live:** https://gia-deliksari-web.vercel.app  

---

## 1. Executive Summary & Vision
GIA Deliksari Web Portal adalah platform pelayanan digital terintegrasi untuk jemaat, majelis, dan tim pastoral Gereja Isa Almasih Deliksari Semarang. Platform ini menggabungkan:
1. **Public Web Experience**: Informasi jadwal ibadah (4 komunitas: Ibadah Raya, Youth, Kidz, Hana), warta jemaat berkategori, transparansi persembahan QRIS, renungan rohani, galeri dokumentasi kegiatan, dan formulir layanan digital (Doa/Konseling, Sakramen Baptisan, Komsel Ekklesia, Volunteer Pelayan).
2. **Automated Media & YouTube Pipeline**: Integrasi YouTube Data API v3 untuk auto-sync rekaman khotbah & live streaming mingguan langsung dari channel `@GIADeliksariSemarang`.
3. **Hybrid Rolling Storage Gallery**: Pipeline unggah foto kegiatan jemaat dengan integrasi Google Drive (penyimpanan arsip master abadi) dan Supabase Storage (buffer/cache aktif 30–50 foto terbaru dengan auto-prune agar kuota 1 GB tidak pernah habis).
4. **Admin & Pastoral Management Portal (`/admin`)**: Dashboard terpadu 5 modul (Warta, Roster Pelayanan, Permohonan Layanan, CMS Media, Inventaris Alat) dilengkapi ekspor cetak lembar jadwal A4 dan broadcast WhatsApp massal.

---

## 2. Information Architecture & Routing

### 2.1 Route Map
- `/` & `/home` — Beranda publik jemaat (13 section visual).
- `/public` — *Deprecated*, diarahkan via HTTP 308 Permanent Redirect ke `/home`.
- `/admin` — Portal Pengurus/Majelis Gereja (dilindungi kata sandi master `'9900'`).
- `/api/youtube/latest` — API Route untuk fetch & cache video khotbah terbaru YouTube Data API v3.
- `/api/gallery/upload` — API Route untuk upload foto dokumentasi, sinkronisasi Google Drive & rolling cache Supabase Storage.
- `/manifest.webmanifest` — PWA Web App Manifest.

---

## 3. Media & Storage Architecture: YouTube v3 & Hybrid Google Drive

### 3.1 YouTube Data API v3 Auto-Sync Pipeline
- **Endpoint**: `/api/youtube/latest`
- **Mekanisme**:
  - Mengambil daftar video/livestream terbaru dari channel `@GIADeliksariSemarang` menggunakan `YOUTUBE_API_KEY` dan `YOUTUBE_CHANNEL_ID`.
  - **Caching Strategy**: Cache response selama 1–6 jam di memori / serverless cache untuk menghemat kuota harian YouTube API (10.000 unit/hari).
  - **Fallback Cerdas**: Jika API Key belum disetel atau kuota habis, otomatis fallback ke data CMS lokal / Supabase database.

### 3.2 Hybrid Rolling Gallery: Google Drive Master + Supabase Storage Cache
- **Tantangan Kuota**: Kapasitas free-tier Supabase Storage adalah 1 GB, sedangkan foto dokumentasi gereja bertambah terus setiap minggu.
- **Solusi**:
  1. **Google Drive = Permanent Master Archive (Abadi)**: Setiap foto yang diunggah jemaat/panitia disimpan permanen di Google Drive gereja (kapasitas besar, resolusi asli / RAW/HD).
  2. **Supabase Storage = Fast Web Rolling Cache (30–50 Foto Terbaru)**: Hanya foto kegiatan terkini (30 hari / 30–50 file) yang di-cache di Supabase Storage untuk performa web instan.
  3. **Auto-Prune Mechanism**: Ketika jumlah foto di Supabase Storage melebihi batas (misal > 50 item), sistem otomatis menghapus cache foto terlama dari Supabase Storage tanpa menghapus file master di Google Drive.
  4. **Google Drive Button**: Halaman galeri menyediakan tombol *"📁 Buka Arsip Lengkap di Google Drive"* untuk melihat seluruh album dokumentasi masa lalu.

---

## 4. Spesifikasi Modul Portal Admin (`/admin`)

1. **Warta Jemaat**: CRUD warta, pin/unpin warta penting, filter publish/draft, kategori komunitas.
2. **Roster Pelayanan**: Plotting petugas ibadah 4 kategori, WhatsApp konfirmasi, **Cetak Jadwal Mingguan format A4**, dan **Template Broadcast WhatsApp 1-klik**.
3. **Layanan & Permohonan Jemaat**: Manajemen permohonan doa, baptisan, komsel, dan volunteer dengan filter status (`new`, `in_progress`, `completed`) serta tautan WhatsApp pastoral langsung.
4. **CMS Khotbah & Galeri**: Pengelolaan manual/sinkronisasi video khotbah, penambahan foto galeri, dan pembersihan cache galeri.
5. **Inventaris & Checklist Alat**: Checklist kesiapan sound system, multimedia kamera, alat musik, dan ruangan sebelum ibadah.

---

## 5. Technology Stack
- **Framework**: Next.js 15.5.23 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v3.4.17 (Vanilla tokens, strict brand palette)
- **Database & Storage**: Supabase (PostgreSQL, Row Level Security, Supabase Storage) + LocalStorage Dual Layer
- **Cloud & Media**: Vercel Serverless, Google Drive API v3, YouTube Data API v3
- **Icons**: Lucide React + Custom SVG Icons (WhatsApp, YouTube, BCA, Mandiri, BRI, QRIS)
