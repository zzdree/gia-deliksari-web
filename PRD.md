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
- `/admin` — Portal Pengurus/Majelis Gereja (dilindungi kata sandi master `'1515'`; lihat INFO.md §10).
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

---

## 6. Hybrid Storage Architecture: Drive Gudang + Supabase Etalase CDN

### 6.1 Prinsip Dasar
- **Google Drive = Gudang Master Abadi** — file original resolusi penuh, kapasitas Google Drive gereja (~15 GB gratis Gmail / unlimited Workspace), jemaat tidak punya kredensial langsung
- **Supabase = Etalase Metadata + Thumbnail CDN** — hanya simpan pointer `drive_file_id` + `thumb_url` (kompres 800px WebP via Supabase Image Transform), hemat storage
- **Jemaat boleh upload + download, TIDAK boleh hapus/edit** — token Drive hanya di server (Next.js API route), tidak ada endpoint delete/edit di layer jemaat
- **Setiap foto baru otomatis muncul di Galeri** — diacak setiap kali load (randomize via SQL `ORDER BY RANDOM()`)

### 6.2 Schema `gallery_items` (Update)
Tambah kolom baru untuk integrasi Drive:
- `drive_file_id` (text, nullable) — ID file di Google Drive untuk reverse-lookup
- `drive_web_view_link` (text, nullable) — link "Buka di Drive" jemaat untuk download versi penuh
- `thumb_url` (text) — URL thumbnail kompres via Supabase Image Transform (`?width=800&quality=70`)
- `uploader_name` (text, nullable) — nama jemaat yang upload (opsional, untuk kredit)
- `is_published` (boolean, default true) — flag tampil di galeri publik

Field lama `image` (data URL base64) tetap di-support untuk backward compatibility dengan foto yang sudah ada di Supabase.

### 6.3 Alur Upload Jemaat
1. Jemaat buka `UploadPhotoModal.tsx` dari `GallerySection`
2. Pilih foto + opsional isi `title`, `category`, `uploaderName`
3. Submit → `POST /api/gallery/upload` (Next.js API route)
4. Server pakai **OAuth refresh token gereja** (`GOOGLE_OAUTH_REFRESH_TOKEN`) untuk upload ke folder Drive `1wUYR6VAsbrIhOKCPtRQmuILWUqbbMr7C`
5. Server download file dari Drive → generate thumbnail 800px WebP → upload ke Supabase Storage bucket `church-gallery/public/`
6. Server insert metadata ke tabel `gallery_items` (drive_file_id, thumb_url, uploader_name, dll)
7. Response `{ success: true, galleryItem: {...} }` → modal close → galeri refresh

### 6.4 Alur Baca Galeri Publik
1. `GET /api/public/data?table=gallery_items&limit=12&random=true`
2. Supabase query: `SELECT * FROM gallery_items WHERE is_published = true ORDER BY RANDOM() LIMIT 12`
3. Return 12 item random ke frontend
4. Frontend render `<img src={thumb_url}>` → Supabase Image Transform serve versi terkompres on-the-fly
5. Klik foto → lightbox + tombol "Lihat Resolusi Penuh" → buka `drive_web_view_link` di tab baru (jemaat bisa download dari Drive)

### 6.5 Auto-Compress via Supabase Image Transform
- Bucket `church-gallery` di-set **public**
- Aktifkan **Image Transformation** di Supabase Dashboard → Storage → Settings (1 toggle)
- Setiap URL `https://[project].supabase.co/storage/v1/render/image/public/church-gallery/public/[file].jpg?width=800&quality=70` otomatis serve versi terkompres
- **Biaya**: gratis sampai 100 image transform/detik, $5 per 100k setelahnya (sangat murah untuk traffic gereja)

### 6.6 Security Model (Jemaat Tidak Bisa Hapus/Edit)
1. Jemaat tidak pernah pegang kredensial Drive — token hanya di server (Next.js API route, env var)
2. API route `/api/gallery/upload` hanya terima `multipart/form-data` untuk create file baru
3. **TIDAK ADA endpoint DELETE/EDIT** di layer jemaat
4. Folder Drive `gia-deliksari-web-upload` permission default `reader` untuk anyone-with-link (cuma read/download)
5. `drive_web_view_link` cuma bisa dibuka (read-only) — jemaat perlu login Google pribadi mereka untuk download, atau bisa langsung "Add to My Drive" untuk copy ke akun sendiri
6. Jemaat yang ingin hapus foto → hubungi admin via WhatsApp (manual dari admin panel)

---

## 7. GaleriSync Worker (Sinkronisasi Drive → Web)

### 7.1 Tujuan
Handle 2 skenario upload:
- **Skenario A** (mayoritas): Jemaat upload via web → langsung masuk alur §6.3 (realtime)
- **Skenario B** (edge case): Admin upload langsung via web Drive (misal dari HP saat di gereja) → perlu sync metadata ke Supabase agar muncul di galeri web

### 7.2 Endpoint: `POST /api/gallery/sync`
- **Auth**: Admin only (cek session cookie via `admin-session.ts`)
- **Mekanisme**:
  1. List semua file di folder Drive `1wUYR6VAsbrIhOKCPtRQmuILWUqbbMr7C` (via Drive API `files.list`)
  2. Filter yang MIME type `image/*` dan `createdTime > last_sync_time`
  3. Untuk setiap file baru: download → generate thumbnail → upload ke Supabase Storage → insert ke `gallery_items` (skip jika `drive_file_id` sudah ada)
  4. Return `{ synced: N, skipped: M, errors: [] }`
- **Trigger**: Manual dari Admin Panel tombol "🔄 Sync dari Drive" (1-klik) atau cron Vercel setiap 6 jam (opsional, future)

### 7.3 Use Case
- Admin foto saat ibadah pakai HP → upload ke folder Drive gereja langsung dari Google Drive app → next morning admin klik "Sync" di admin panel → foto muncul di galeri web
- Atau: jemaat yang lebih nyaman pakai Google Drive web (drag-drop banyak foto sekaligus) → tetap bisa kontribusi tanpa lewat web form gereja

---

## 8. YouTube Auto-Sync (Recap, Sudah Aktif)

- Endpoint: `GET /api/youtube/latest`
- Fetch 6 video/livestream terbaru dari channel `UCDh3ojx9ne3HOPoBuuoKlrg` (`@GIADeliksariSemarang`)
- Caching in-memory 2 jam (konservasi kuota 10.000 unit/hari)
- Fallback ke Supabase DB atau seedData jika API key invalid / quota habis
- Tampil di `SermonsSection.tsx` di homepage
- **Status**: ✅ Live, tidak perlu perubahan

---

## 9. Setup Manual 1x (OAuth + Storage)

Diperlukan sebelum fitur §6 bisa digunakan jemaat. Butuh ~15 menit:

1. **Google Cloud Console** (`console.cloud.google.com`):
   - Enable Google Drive API
   - Create OAuth 2.0 Client ID (Web application)
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback`
   - Copy `Client ID` + `Client Secret` ke `.env.local` sebagai `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET`
2. **Generate Refresh Token**: Run `node scripts/drive-auth-setup.js` → authorize via browser sebagai `giadeliksarichurch@gmail.com` → token otomatis masuk `.env.local` sebagai `GOOGLE_OAUTH_REFRESH_TOKEN`
3. **Supabase Storage**:
   - Dashboard → Storage → New bucket `church-gallery` (Public bucket)
   - Settings → Enable Image Transformation (1 toggle)
4. **Env Vars Tambahan**:
   - `SUPABASE_SERVICE_ROLE_KEY` — dari Supabase Dashboard → Settings → API (format `eyJ...`)
   - `ADMIN_SESSION_SECRET` — random 32 char string

Setelah 4 langkah ini, jemaat bisa langsung upload via web.

---

## 10. Environment Variables Lengkap (Updated)

```
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://azgyihsukmatsggppxuz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # ← BARU (untuk admin write) — sama dengan SUPABASE_SERVICE_KEY di .env.local
SUPABASE_ACCESS_TOKEN=sbp_...                 # Management API only (jangan pakai runtime)

# === Google Drive (OAuth - BARU) ===
GOOGLE_OAUTH_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback
GOOGLE_OAUTH_REFRESH_TOKEN=1//xxx

# === Google Drive (Service Account - LEGACY, untuk read) ===
GOOGLE_SERVICE_ACCOUNT_EMAIL=gia-deliksari-web-drive@gia-deliksari-web.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# === Google Drive (Folders) ===
GOOGLE_DRIVE_UPLOAD_FOLDER_ID=1wUYR6VAsbrIhOKCPtRQmuILWUqbbMr7C
GOOGLE_DRIVE_PUBLIC_FOLDER_ID=1T_ahqCtmOjdFl0L-MNu7bIQo-8Oz8y9h
NEXT_PUBLIC_GOOGLE_DRIVE_GALLERY_URL=https://drive.google.com/drive/folders/1T_ahqCtmOjdFl0L-MNu7bIQo-8Oz8y9h

# === YouTube ===
YOUTUBE_API_KEY=AIzaSy...
YOUTUBE_CHANNEL_ID=UCDh3ojx9ne3HOPoBuuoKlrg

# === Admin ===
NEXT_PUBLIC_ADMIN_PASSWORD=1515
ADMIN_SESSION_SECRET=random-32-char-string-here  # ← BARU
```

