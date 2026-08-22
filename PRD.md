# Product Requirements Document (PRD)
## Project: GIA Deliksari Web Platform (Public & Admin Portal)
**Version:** 1.3.0  
**Target:** Web Application (Responsive Desktop, Tablet & Mobile)  
**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL, Lucide Icons  
**Repository:** [https://github.com/zzdree/gia-deliksari-web](https://github.com/zzdree/gia-deliksari-web)  
**Live Production URL:** [https://gia-deliksari-web.vercel.app](https://gia-deliksari-web.vercel.app)  

---

## 1. Executive Summary & Objective
GIA Deliksari Semarang (*"GROWING CHURCH!"*) adalah gereja yang dinamis dan berakar kuat di Semarang, Jawa Tengah. Platform web ini dirancang dengan dua pilar utama:
1. **Public Portal (`/` & `/public`)**: Menjangkau jemaat, keluarga, dan generasi muda dengan profil gereja, struktur keluarga penggembalaan lengkap (**Ps. Yohanes Sutono, Ibu Santini, Kak Noel Yosan S.Th., Vellin**), jadwal ibadah akurat, warta jemaat dengan buletin cetak, arsip khotbah YouTube, pusat pendaftaran sakramen & layanan doa WhatsApp, persembahan digital (BCA, Mandiri, BRI), galeri foto riil, dan kontak lokasi.
2. **Admin Portal (`/admin`)**: Manajemen operasional terpadu (dilindungi password `9900`) untuk warta jemaat, penjadwalan & plotting tugas pelayan (Roster Duty), serta audit kesiapan inventaris peralatan ibadah gereja secara realtime tersinkronisasi dengan Supabase PostgreSQL.

---

## 2. Live Links & Route Map

| Modul Akses | URL Live Production | Route Lokal | Deskripsi & Autentikasi |
|---|---|---|---|
| 🕊️ **Public Portal** | [**gia-deliksari-web.vercel.app**](https://gia-deliksari-web.vercel.app) | [`/public`](/public) / [`/`](/) | Profil gereja, keluarga gembala, warta, khotbah, pendaftaran, persembahan, galeri. |
| 🛡️ **Admin Portal** | [**gia-deliksari-web.vercel.app/admin**](https://gia-deliksari-web.vercel.app/admin) | [`/admin`](/admin) | Manajemen warta, plotting jadwal pelayan 4 kategori, checklist inventaris. (*Default Password: `9900`*) |
| 📦 **Source Code** | [**github.com/zzdree/gia-deliksari-web**](https://github.com/zzdree/gia-deliksari-web) | `main` branch | Repositori kode sumber resmi & dokumentasi arsitektur. |

---

## 3. Core Feature Specifications

### 3.1. Public Landing Page (`/` & `/public`)
- **Header & Navbar**: Brand logo resmi gereja ([`public/images/logo.png`](file:///C:/ANDREAS/gia-deliksari-web/public/images/logo.png)), navigasi *smooth scroll* (Tentang, Pelayanan, Khotbah, Warta, Jadwal, Layanan, Persembahan, Galeri, Kontak), dan **Dark/Light Mode Switcher**.
- **Hero Section**: Tagline *"GROWING CHURCH! 🔥"*, pesan selamat datang berwibawa, foto tampak depan gedung fisik gereja ([`hero-church.jpg`](file:///C:/ANDREAS/gia-deliksari-web/public/images/hero-church.jpg)), dan tombol aksi CTA.
- **Tentang Kami & Keluarga Penggembalaan**:
  - Profil **Ps. Yohanes Sutono** (Gembala Sidang)
  - Profil **Ibu Santini** (Ibu Gembala)
  - Profil **Kak Noel Yosan, S.Th.** (Pelayanan Pemuda & Pengajaran)
  - Profil **Vellin** (Worship & Generasi Muda)
  - Visi, misi, dan nilai-nilai jemaat GIA Deliksari.
- **Pilar Pelayanan & Ibadah**:
  1. ⛪ **Ibadah Raya Umum**: Minggu 09.00 – 11.00 WIB.
  2. 🔥 **Grow Generation (PRBK Youth & Teen)**: Sabtu 18.00 – 20.00 WIB (dipimpin Kak Noel Yosan & Vellin).
  3. 🎨 **COC Kidz (Children Of Christ / Sekolah Minggu)**: Minggu 09.30 – 10.30 WIB.
  4. 🌸 **Persekutuan Wanita Hana & Komsel Ekklesia**: Rotasi selang-seling 4 minggu (Hana: 18.00–20.00 WIB / Komsel: 18.30–20.00 WIB).
- **Arsip Khotbah & Video YouTube (`#khotbah`)**:
  - Rekaman khotbah mingguan Ps. Yohanes Sutono dan Kak Noel Yosan, S.Th.
  - Tautan langsung ke channel YouTube resmi `@GIADeliksariSemarang`.
- **Papan Informasi Warta Jemaat & Cetak Buletin (`#warta`)**:
  - Filter waktu: *Semua, Minggu Depan, Bulan Ini* dan filter kategori pelayanan.
  - Fitur **"Lihat & Cetak Buletin Warta"** (Modal Pratinjau Buletin siap cetak/unduh PDF lengkap dengan pesan pastoral dan logo).
- **Jadwal Ibadah & Agenda Mingguan (`#jadwal`)**:
  - Rincian jam ibadah + Agenda rutin mingguan (Selasa: Kunjungan Jemaat, Sabtu: Latihan Musik & Pembekalan Pelayan).
  - Pratinjau jadwal pelayan ibadah minggu ini.
- **Pusat Layanan & Formulir Pendaftaran (`#layanan`)**:
  - 4 Tab Formulir Interaktif: Permohonan Doa & Konseling Pastoral (termasuk request kunjungan Selasa), Pendaftaran Baptisan Selam / Penyerahan Anak, Pendaftaran Komsel Ekklesia, Formulir Gabung Pelayan Ibadah.
  - Mengirim permohonan instan langsung terhubung ke WhatsApp Pastoral.
- **Persembahan & Perpuluhan Digital (`#persembahan`)**:
  - Rekening Resmi: **BCA** (`246-098-7711`), **Bank Mandiri** (`136-00-1928374-1`), **BRI** (`0341-01-002938-53-0`).
  - Fitur **1-Klik Salin Nomor Rekening** dengan toast feedback visual.
  - Tombol konfirmasi bukti transfer via WhatsApp ke sekretariat.
- **Galeri Dokumentasi Foto Asli (`#galeri`)**:
  - 8+ foto resolusi tinggi terverifikasi. Filter kategori & *Interactive Lightbox Modal*.
- **Lokasi, Google Maps & Kontak Resmi (`#kontak`)**:
  - Jl. Kolonel Hadijanto, Deliksari, Gunung Pati, Kota Semarang.

### 3.2. Admin Operational Portal (`/admin`)
- **Authentication Gate**: Proteksi berbasis session dengan kata sandi default `9900` dan brand logo resmi.
- **Dashboard Ringkasan**: Statistik total warta aktif, jumlah pelayan terdaftar di 4 kategori, dan progres kesiapan checklist inventaris.
- **Manajemen Papan Warta**: Tambah, ubah, hapus pengumuman, tandai prioritas (*pinned*), dan atur status publikasi (*published/draft*).
- **Plotting Tugas Pelayan Ibadah (Servants Roster)**:
  - Tab khusus 4 kategori: **General**, **Youth**, **Kidz**, dan **Hana**.
  - Form input petugas: Nama pelayan, tugas/role (WL, Singers, Pemusik, Operator Multimedia, Usher, dsb.), tanggal tugas, nomor telepon, dan status konfirmasi.
- **Checklist & Audit Inventaris Gereja**:
  - Kategori: Sound System, Multimedia & Kamera, Musik & Alat Musik, Perlengkapan Ibadah / Ruangan.
  - Fitur **Centang / Uncentang Realtime** untuk verifikasi kesiapan alat sebelum ibadah.
- **Supabase Dual-Sync Engine**:
  - Terhubung ke database PostgreSQL Supabase dengan caching cerdas localStorage fallback offline.
