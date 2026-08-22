# Product Requirements Document (PRD)
## Project: GIA Deliksari Web Platform (Public & Admin Portal)
**Version:** 1.0.0  
**Target:** Web Application (Responsive Desktop & Mobile)  
**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase, Lucide Icons  

---

## 1. Executive Summary & Objective
GIA Deliksari Semarang (*"GROWING CHURCH!"*) memerlukan platform web modern, cepat, dan responsif dengan dua modul utama:
1. **Public Portal (Landing Page)**: Pusat informasi publik untuk jemaat dan calon jemaat mengenai profil gereja, gembala sidang, 4 pilar pelayanan/kategori ibadah, jadwal ibadah, papan pengumuman/warta jemaat untuk minggu depan dan bulan ini, galeri dokumentasi foto, serta lokasi & kontak.
2. **Admin Portal**: Panel manajemen operasional gereja yang intuitif dan aman untuk mengelola papan warta/pengumuman, penjadwalan & plotting tugas pelayan (Roster Duty) per 4 kategori ibadah, serta pengelolaan inventaris/perlengkapan gereja (Inventory Checklist).

---

## 2. Target Persona & User Roles
- **Jemaat Umum & Pengunjung Baru**: Mengakses jadwal ibadah, lokasi GMaps, warta gereja terbaru, informasi pelayanan anak & pemuda, serta khotbah/streaming YouTube.
- **Pengurus & Pelayan Gereja (Admin/Media Team)**: Memperbarui pengumuman mingguan/bulanan, mengatur jadwal dan pembagian tugas pelayan di 4 kategori ibadah, serta mengecek kesiapan alat/inventaris gereja sebelum ibadah dimulai.

---

## 3. Core Feature Specifications

### 3.1. Public Landing Page
- **Header & Navbar**: Brand logo, navigasi cepat (Tentang, Pelayanan, Jadwal & Pengumuman, Galeri, Kontak), dan **Dark/Light Mode Switcher**.
- **Hero Section**: Tagline *"GROWING CHURCH!"*, pesan selamat datang, tombol CTA (Lihat Jadwal, Lokasi GMaps, Tonton Streaming).
- **Tentang Kami & Gembala Sidang**: Profil GIA Deliksari dipimpin oleh Ps. Yohanes Sutono.
- **4 Kategori Pelayanan & Ibadah**:
  1. **COC Kidz (Children Of Christ / KAA)**: Pelayanan anak-anak usia dini hingga sekolah dasar.
  2. **Grow Generation (PRBK / Youth & Teen)**: Komunitas pemuda & remaja yang dinamis dan berakar pada firman.
  3. **Hana Fellowship**: Persekutuan wanita / kaum ibu & keluarga.
  4. **General Service (Ibadah Umum / Raya)**: Ibadah raya mingguan untuk seluruh jemaat.
- **Papan Informasi & Warta Jemaat**:
  - Filter / Tab: "Minggu Depan", "Bulan Ini", "Semua Pengumuman".
  - Kartu pengumuman dengan tanggal, kategori, deskripsi, dan lampiran/badge penting.
- **Jadwal Ibadah Mingguan**: Tabel & kartu interaktif jadwal pelaksanaan ibadah lengkap dengan jam & lokasi.
- **Galeri Dokumentasi Foto**: Grid foto suasana ibadah, kegiatan outdoor, dan kebersamaan jemaat (diambil dari GMaps & dokumentasi resmi).
- **Lokasi & Kontak**: Integrasi Google Maps, rute alamat (Jl. Kolonel Hadijanto), link Instagram & channel YouTube resmi.
- **Footer**: Hak Cipta © 2026 GIA Deliksari (All Rights Reserved) dan info media tim.

### 3.2. Admin Portal (/admin)
- **Dashboard Overview**: Ringkasan jumlah pengumuman aktif, total pelayan terdaftar, dan status inventaris gereja.
- **Manajemen Papan Pengumuman (Announcements)**:
  - Form Input & Edit: Judul, kategori (Umum, Kidz, Youth, Hana), tanggal mulai, tanggal selesai, deskripsi, status aktif/draft.
  - Opsi hapus dan pencarian pengumuman.
- **Manajemen & Penjadwalan Pelayan (Roster / Pelayan)**:
  - Tab 4 Kategori: **Kidz**, **Youth**, **Hana**, **General**.
  - Form Input Petugas Pelayan: Nama pelayan, role tugas (Worship Leader, Singers, Musisi/Band, Multimedia/Operator, Usher/Kolektan, Doa Syafaat, Guru SM, dsb.), tanggal tugas, catatan.
  - Filter & Cetak/Export ringkasan tugas per minggu.
- **Manajemen Inventaris Gereja (Inventory Checklist)**:
  - Kategori perlengkapan: Audio / Sound System, Multimedia & Kamera, Musik & Alat Musik, Perlengkapan Ibadah / Ruangan.
  - Fitur **Centang / Uncentang (Checklist Status)**: Kesiapan alat (Ready / Normal / Perlu Pengecekan / Rusak) sebelum ibadah dimulai.
  - Form Tambah / Edit Barang: Nama barang, kode/lokasi rak, jumlah unit, kondisi, dan status ketersediaan.
- **Database & Integrasi Supabase**:
  - Tabel nnouncements, servants_roster, inventory_items.
  - Fallback offline / local storage state jika koneksi Supabase belum terisi API Key, sehingga aplikasi tetap 100% fungsional seketika.

---

## 4. Non-Functional Requirements
- **Desain & Estetika**: Modern, bersih, berwibawa, tipografi elegan, micro-interaction halus, bebas dari template murahan.
- **Responsivitas**: 100% adaptif untuk layar smartphone (mobile-first), tablet, dan desktop resolusi tinggi.
- **Aksesibilitas & Performa**: Skor Lighthouse tinggi, image optimization, Semantic HTML, dukungan penuh Dark & Light mode.
