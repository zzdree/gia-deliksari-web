# Product Requirements Document (PRD)
## Project: GIA Deliksari Web Platform (Public & Admin Portal)
**Version:** 1.2.0  
**Target:** Web Application (Responsive Desktop, Tablet & Mobile)  
**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL, Lucide Icons  
**Repository:** [https://github.com/zzdree/gia-deliksari-web](https://github.com/zzdree/gia-deliksari-web)  
**Live Production URL:** [https://gia-deliksari-web.vercel.app](https://gia-deliksari-web.vercel.app)  

---

## 1. Executive Summary & Objective
GIA Deliksari Semarang (*"GROWING CHURCH!"*) memerlukan platform web modern, cepat, dan responsif dengan dua modul akses utama:
1. **Public Portal (Landing Page - `/` & `/public`)**: Pusat informasi publik untuk jemaat dan calon jemaat mengenai profil gereja, gembala sidang (**Ps. Yohanes Sutono**), 4 pilar pelayanan/kategori ibadah, jadwal ibadah mingguan, papan warta jemaat terpadu, galeri foto dokumentasi asli terverifikasi, serta petunjuk arah navigasi & kontak resmi.
2. **Admin Portal (`/admin`)**: Panel manajemen operasional gereja yang intuitif dan aman (terproteksi kata sandi) untuk mengelola papan warta/pengumuman, penjadwalan & plotting tugas pelayan (Roster Duty) per 4 kategori ibadah, serta pengelolaan inventaris/perlengkapan ibadah gereja (Inventory Checklist & Audit).

---

## 2. Live Links & Route Map

| Modul Akses | URL Live Production | Route Lokal | Deskripsi & Autentikasi |
|---|---|---|---|
| 🕊️ **Public Portal** | [**gia-deliksari-web.vercel.app**](https://gia-deliksari-web.vercel.app) | [`/public`](/public) / [`/`](/) | Profil gereja, warta jemaat, 4 ibadah, galeri foto riil, jadwal, dan kontak. |
| 🛡️ **Admin Portal** | [**gia-deliksari-web.vercel.app/admin**](https://gia-deliksari-web.vercel.app/admin) | [`/admin`](/admin) | Manajemen warta, plotting jadwal pelayan 4 kategori, checklist inventaris. (*Default Password: `9900`*) |
| 📦 **Source Code** | [**github.com/zzdree/gia-deliksari-web**](https://github.com/zzdree/gia-deliksari-web) | `main` branch | Repositori kode sumber resmi & dokumentasi arsitektur. |

---

## 3. Core Feature Specifications

### 3.1. Public Landing Page (`/` & `/public`)
- **Header & Navbar**: Brand logo resmi gereja ([`public/images/logo.png`](file:///C:/ANDREAS/gia-deliksari-web/public/images/logo.png)), navigasi *smooth scroll* (Tentang, Pelayanan, Pengumuman, Jadwal, Galeri, Kontak), dan **Dark/Light Mode Switcher**.
- **Hero Section**: Tagline *"GROWING CHURCH! 🔥"*, pesan selamat datang berwibawa, foto tampak depan gedung fisik gereja ([`hero-church.jpg`](file:///C:/ANDREAS/gia-deliksari-web/public/images/hero-church.jpg)), dan tombol aksi CTA.
- **Tentang Kami & Gembala Sidang**: Profil pelayanan **Ps. Yohanes Sutono** lengkap dengan dokumentasi mimbar ([`pastor-yohanes.jpg`](file:///C:/ANDREAS/gia-deliksari-web/public/images/pastor-yohanes.jpg)), visi, misi, dan nilai jemaat.
- **4 Pilar Pelayanan Ibadah**:
  1. ⛪ **General Service (Ibadah Raya Umum)**: Minggu 07:00 & 16:30 WIB.
  2. 🔥 **Grow Generation (PRBK / Youth Ministry)**: Sabtu 17:00 WIB.
  3. 🎨 **COC Kidz (Children Of Christ / Sekolah Minggu)**: Minggu 07:00 WIB.
  4. 🌸 **Persekutuan Kaum Wanita Hana**: Kamis 16:00 WIB.
- **Papan Informasi & Warta Jemaat**:
  - Filter / Tab: "Minggu Depan", "Bulan Ini", "Semua Pengumuman".
  - Kartu warta dilengkapi tanggal, kategori ibadah, deskripsi, dan badge prioritas/pinned.
- **Galeri Dokumentasi Foto Asli**:
  - 8+ foto resolusi tinggi terverifikasi dari Google Maps & YouTube resmi.
  - Filter kategori (*Semua, Ibadah Raya, Praise & Worship, Pemuda, Komunitas*).
  - Tampilan *Interactive Lightbox Modal* dengan tombol Prev/Next dan deskripsi foto.
- **Jadwal Ibadah Mingguan**: Kartu terstruktur per waktu pelaksanaan, ruang ibadah, dan penanggung jawab.
- **Lokasi, Google Maps & Kontak**: Integrasi peta resmi, tautan deep link WhatsApp untuk permohonan doa/konseling pastoral, dan tautan media sosial resmi.

### 3.2. Admin Operational Portal (`/admin`)
- **Authentication Gate**: Proteksi berbasis session dengan kata sandi default `9900` dan brand logo resmi.
- **Dashboard Ringkasan**: Statistik total warta aktif, jumlah pelayan terdaftar di 4 kategori, dan progres kesiapan checklist inventaris.
- **Manajemen Papan Warta**: Tambah, ubah, hapus pengumuman, tandai prioritas (*pinned*), dan atur status publikasi (*published/draft*).
- **Plotting Tugas Pelayan Ibadah (Servants Roster)**:
  - Tab khusus 4 kategori: **General**, **Youth**, **Kidz**, dan **Hana**.
  - Form input petugas: Nama pelayan, tugas/role (WL, Singers, Pemusik, Operator Multimedia, Usher, dsb.), tanggal tugas, nomor telepon, dan status konfirmasi (*confirmed/pending/replacement*).
- **Checklist & Audit Inventaris Gereja**:
  - Kategori: Sound System, Multimedia & Kamera, Musik & Alat Musik, Perlengkapan Ibadah / Ruangan.
  - Fitur **Centang / Uncentang Realtime** untuk verifikasi kesiapan alat sebelum ibadah.
  - Status kondisi fisik (*Good / Maintenance / Broken*) dan tombol **Reset Checklist**.
- **Supabase Dual-Sync Engine**:
  - Terkoneksi ke database cloud Supabase PostgreSQL (`azgyihsukmatsggppxuz`).
  - Dilengkapi mekanisme fallback *Local Storage caching* otomatis saat offline.

---

## 4. Non-Functional Requirements & Security
- **Performa**: Static Site Generation (SSG) dengan `next/image` otomatis mengonversi gambar ke WebP/AVIF.
- **Responsivitas**: 100% responsif di layar Mobile (360px+), Tablet, hingga Desktop 4K.
- **Keamanan**: Kredensial sensitif diamankan melalui environment variables server-side; lisensi proprietary private.
- **SEO & OpenGraph**: Metadata komprehensif, semantic HTML5, dan kartu pratinjau media sosial.

---

## 5. Contact & Social Channels
- **Instagram**: [@giadeliksari](https://www.instagram.com/giadeliksari/)
- **Youth IG**: [@growgeneration_](https://www.instagram.com/growgeneration_/)
- **Kids IG**: [@cockidz](https://www.instagram.com/cockidz/)
- **YouTube**: [@GIADeliksariSemarang](https://www.youtube.com/@GIADeliksariSemarang)
- **Google Maps**: [Gereja Isa Almasih Deliksari](https://share.google/O7HqL1J615kgxt66v)
