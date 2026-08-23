# PRD v3.2.0 — GIA Deliksari Web (Harmonized Public & Admin Edition)

## 1. Executive Summary & Vision
GIA Deliksari adalah gereja lokal yang bertumbuh (*"Growing Church!"*) berlokasi di Gunungpati, Semarang (dekat kampus UNNES).
Website ini hadir sebagai pusat informasi jemaat, media penjangkauan generasi muda dan keluarga baru, serta portal operasional pelayanan gereja.

Versi v3.2.0 menyempurnakan keselarasan visual (Warm Cream & Sacred Crimson) antara Halaman Publik (`/home` dan root `/`) dan Portal Admin (`/admin`), mengeliminasi elemen usang non-brand, serta memastikan sinkronisasi data dua arah.

---

## 2. Routing & Information Architecture
- **`/` (Root)**: Landing page publik resmi GIA Deliksari.
- **`/home`**: Alias resmi halaman publik (re-export dari root untuk UX yang jelas).
- **`/public`**: *Deprecated* — otomatis di-redirect permanen (`308 Permanent Redirect`) ke `/home` via `next.config.ts`.
- **`/admin`**: Portal khusus majelis & tim pelayan untuk mengelola warta, plotting tugas mingguan, dan inventaris gereja.

---

## 3. Brand Identity & Design System
- **Dinding & Suasana Fisik**: *Warm Church Cream* (`#FDFBF7`, `#F7F2E8`, `#EFE6D5`) — hangat, ramah, teduh, mencerminkan fisik gedung gereja.
- **Identitas Logo & Api Roh Kudus**: *Sacred Crimson & Rich Maroon* (`#C5222E`, `#80141C`, `#5E0B13`) dengan gradient `from-[#C5222E] to-[#80141C]`.
- **Nuansa Khidmat & Mode Gelap**: *Deep Velvet Maroon* (`#150B0D`, `#221215`, `#2A161A`) — konsisten di seluruh halaman publik dan admin (menggantikan tema slate/navy lama).
- **Aksen Kemuliaan & Komunitas**:
  - **Ibadah Raya / General**: Crimson (`#C5222E`)
  - **Grow Generation (Youth)**: Warm Terracotta (`#C83E20`)
  - **COC Kidz**: Sacred Gold (`#B87A14` / `#C59B27`)
  - **Wanita Hana & Komsel Ekklesia**: Rose Maroon (`#A6264A`)

---

## 4. Public Page Features (13 Core Sections)
1. **Navbar**: Translucent blur warm cream/maroon, brand logo, dark/light mode toggle, shortcut login admin.
2. **Hero Section**: Headline pastoral *"Gereja yang Mengayomi & Bertumbuh"*, countdown ibadah Minggu 07.00 WIB, floating emblem salib ✝.
3. **Panduan Jemaat Baru (`#kunjungan`)**: 4 langkah sambutan jemaat (Parkir & Penyambutan, Dresscode Casual Sopan, Ruang Anak & Bayi, Fellowship & Doa).
4. **Tentang Gereja (`#tentang`)**: Profil Gembala Ps. Yohanes Sutono & Ibu Santini, Kak Noel Yosan, S.Th. & Vellin, visi "Growing Church!".
5. **4 Komunitas Pelayanan (`#pelayanan`)**: Ibadah Raya, Grow Generation Youth, COC Kidz, Persekutuan Wanita Hana & Komsel Ekklesia.
6. **Khotbah & Firman (`#khotbah`)**: Embed video YouTube khotbah mingguan dengan tema seri renungan firman.
7. **Papan Warta Jemaat (`#warta`)**: Real-time filter warta, pinning sistem (Warta Utama tersemat), format tanggal & author, fitur cetak warta fisik.
8. **Jadwal Ibadah & Roster (`#jadwal`)**: Tab filter interaktif 4 komunitas ibadah, status kesiapan pelayan (Siap, Pengganti, Menunggu), jadwal kunjungan pastoral Selasa, dan latihan musik Sabtu.
9. **Layanan Jemaat & Formulir (`#layanan`)**: Permohonan doa, sakramen baptisan kudus, pendaftaran komsel, dan kesediaan melayani.
10. **Persembahan Kasih (`#persembahan`)**: Rekening resmi gereja (BCA, Mandiri, BRI) dengan 1-klik salin nomor rekening dan konfirmasi WhatsApp.
11. **Galeri & Momen Kegiatan (`#galeri`)**: Dokumentasi foto ibadah raya, youth camp, sekolah minggu, dan fellowship wanita dengan Lightbox preview.
12. **Lokasi, FAQ & Kontak (`#kontak`)**: Google Maps interaktif, 4 FAQ accordion, WhatsApp sekretariat, dan tautan sosial media resmi.
13. **Footer**: Quick links, strip jadwal ibadah mingguan, dan hak cipta.

---

## 5. Admin Portal Specifications (`/admin`)
- **Autentikasi**: Gate password (`NEXT_PUBLIC_ADMIN_PASSWORD` default `'9900'`) dengan persistensi `sessionStorage` (`gia_admin_authenticated`).
- **Indikator Database**: Status koneksi real-time (Supabase Cloud vs Local Storage Fallback).
- **Tab 1 — Kelola Warta Jemaat**:
  - CRUD warta (Judul, Konten, Tanggal, Penulis, Kategori, Pin/Unpin, Publish/Draft).
  - Draft filter: Warta draft hanya muncul di admin dengan badge "Draft (Tidak Tayang)".
- **Tab 2 — Plotting Jadwal Pelayan (4 Kategori)**:
  - Pembagian tab kategori (1. Ibadah Raya, 2. Grow Youth, 3. COC Kidz, 4. Wanita Hana & Komsel).
  - CRUD petugas (Peran/Role, Nama Pelayan, Tanggal Ibadah, WhatsApp/HP, Status Kesiapan, Catatan Teknis).
  - Integrasi tombol WhatsApp 1-klik untuk kirim pengingat tugas.
- **Tab 3 — Inventaris Gereja & Checklist**:
  - Pelacakan aset (Sound System, Multimedia & Kamera, Alat Musik, Ibadah & Ruangan).
  - Status kondisi barang (Baik/Normal, Perlu Pengecekan, Rusak/Servis).
  - Filter pencarian nama/kode barang dan checklist operasional ibadah.

---

## 6. Architecture & Tech Stack
- **Framework**: Next.js 15 (App Router, Static Prerendering, Server Components).
- **Styling**: Tailwind CSS v3.4 + Custom CSS Variables (Design Tokens).
- **Icons**: Lucide React Icons.
- **Database & Storage**: Supabase Database (`announcements`, `servant_rosters`, `inventory_items`) dengan fallback otomatis ke Browser LocalStorage & SeedData.
- **Deployment**: Vercel Production (`https://gia-deliksari-web.vercel.app`) terhubung dengan GitHub repository (`zzdree/gia-deliksari-web`).
