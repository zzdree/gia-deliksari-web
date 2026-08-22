# Product Requirements Document (PRD)
## Project: GIA Deliksari Web Platform (Public & Admin Portal)
**Version:** 2.0.0 — Modern Sanctuary & Digital Hospitality Redesign  
**Target Platform:** Multi-device Web Application (Mobile First, Tablet, Desktop)  
**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL, Lucide Icons  
**Repository:** [https://github.com/zzdree/gia-deliksari-web](https://github.com/zzdree/gia-deliksari-web)  
**Live Production URL:** [https://gia-deliksari-web.vercel.app](https://gia-deliksari-web.vercel.app)  

---

## 1. Executive Summary & Design Benchmark

GIA Deliksari Semarang (*"GROWING CHURCH! 🔥"*) adalah gereja lokal yang dinamis, bertumbuh, dan berakar kuat di wilayah Gunungpati, Semarang. 

Berdasarkan riset mendalam terhadap platform web gereja kontemporer terkemuka (seperti **GMS Church**, **JPCC (Jakarta Praise Community Church)**, **Hillsong**, dan tren *Church Web Design 2025/2026*), versi 2.0.0 mengusung filosofi **"Contemporary Sanctuary & Digital Hospitality"**:
- Menghadirkan keramahan digital (*digital hospitality*) untuk jemaat baru (*first-time visitors*)
- Menyajikan jadwal dan countdown ibadah berikutnya secara interaktif
- Menampilkan struktur keluarga pastoral lengkap (**Ps. Yohanes Sutono, Ibu Santini, Kak Noel Yosan S.Th., Vellin**)
- Menyediakan pusat warta, arsip khotbah multimedia, pendaftaran sakramen, persembahan digital (BCA, Mandiri, BRI), dan portal admin operasional yang terintegrasi dengan database Supabase PostgreSQL.

---

## 2. Platform Information Architecture & Routes

| Modul | Route Publik / Admin | Deskripsi & Autentikasi |
|---|---|---|
| 🕊️ **Public Portal** | [`/`](/) & [`/public`](/public) | Halaman beranda utama dengan 11 seksi interaktif (Hero, Baru di Sini, Tentang & Pastoral, 4 Pelayanan, Khotbah, Warta, Jadwal, Layanan, Persembahan, Galeri, Lokasi & FAQ). |
| 🛡️ **Admin Portal** | [`/admin`](/admin) | Dashboard operasional terlindungi PIN (`9900`): Manajemen warta, plotting jadwal pelayan 4 kategori (General, Youth, Kidz, Hana), dan audit inventaris realtime. |
| 📦 **GitHub Source** | [**github.com/zzdree/gia-deliksari-web**](https://github.com/zzdree/gia-deliksari-web) | Source code repositori resmi. |

---

## 3. Detailed Feature Specifications

### 3.1. Public Landing Experience

#### 1. Smart Navigation & Header
- Sticky navbar dengan *frosted backdrop blur*, logo resmi gereja ([`public/images/logo.png`](file:///C:/ANDREAS/gia-deliksari-web/public/images/logo.png)), 10 tautan anchor navigasi, **Dark/Light Mode Toggle**, dan tombol akses cepat **"Portal Admin"**.
- Mobile menu drawer yang mulus dan ramah sentuhan.

#### 2. Hero Visual & Live Countdown Hub (`#beranda`)
- Tagline resmi: *"Gereja yang Bertumbuh & Memberkati Kota Semarang"* dan *"GIA DELIKSARI • GROWING CHURCH! 🔥"*.
- **Live Countdown Banner**: Menghitung mundur waktu secara dinamis menuju Ibadah Raya Minggu berikutnya (Pukul 09.00 WIB) dengan indikator hari, jam, dan menit.
- Visual frame beresolusi tinggi dengan foto gedung & ibadah gereja ([`hero-church.jpg`](file:///C:/ANDREAS/gia-deliksari-web/public/images/hero-church.jpg)), status `● Live Onsite`, waktu ibadah `09.00 - 11.00 WIB`, serta floating badge `✝ 4 Komunitas Ibadah (General • Youth • Kidz • Hana)`.
- 3 Tombol Aksi Utama: *Rencanakan Kunjungan*, *Lihat Warta Terkini*, dan *Tonton Khotbah YouTube*.

#### 3. Digital Hospitality: "Baru Pertama Kali di Sini? / Plan Your Visit" (`#tentang`)
- 4 Panduan ramah jemaat baru:
  - 📍 **Lokasi Strategis & Parkir**: Area parkir mobil & motor yang aman dan luas di Deliksari Gunungpati.
  - 👶 **Keluarga & Anak**: Ibadah anak COC Kidz yang interaktif dan penuh sukacita.
  - 🎵 **Pujian & Penyembahan**: Suasana ibadah hangat dan hadirat Tuhan bersama tim DS Worship.
  - 🤝 **Penyambutan Hangat**: Tim usher dan pastoral siap mendampingi setiap pengunjung baru.

#### 4. Tentang Gereja & Keluarga Penggembalaan (`#tentang`)
- Kartu profil keluarga gembala dengan foto pastoral ([`pastor-yohanes.jpg`](file:///C:/ANDREAS/gia-deliksari-web/public/images/pastor-yohanes.jpg)):
  - **Ps. Yohanes Sutono** (Gembala Sidang)
  - **Ibu Santini** (Ibu Gembala)
  - **Kak Noel Yosan, S.Th.** (Youth & Teaching Pastor)
  - **Vellin** (Worship Leader & Youth Leader)
- Visi & Misi Gereja: Bertumbuh dalam firman, berakar dalam kasih, dan berdampak bagi kota Semarang.

#### 5. 4 Komunitas Ibadah & Pelayanan Generasi (`#pelayanan`)
- **1. Ibadah Raya / General Service**: Minggu 09.00 – 11.00 WIB.
- **2. Grow Generation (PRBK Youth & Teen)**: Sabtu 18.00 – 20.00 WIB.
- **3. COC Kidz (Children Of Christ / Sekolah Minggu)**: Minggu 09.30 – 10.30 WIB.
- **4. Persekutuan Wanita Hana & Komsel Ekklesia**: Jadwal selang-seling 4 minggu (Hana: 18.00–20.00 WIB / Komsel: 18.30–20.00 WIB).
- Informasi PIC, rentang usia jemaat, dan link pendaftaran persekutuan.

#### 6. Arsip Khotbah & Video Streaming (`#khotbah`)
- Sorotan khotbah terkini dengan ringkasan ayat firman Tuhan.
- Link langsung menuju channel YouTube resmi `@GIADeliksariSemarang`.

#### 7. Papan Warta Jemaat & Cetak Buletin (`#warta`)
- Filter warta berdasarkan kategori pelayanan dan rentang waktu (*Semua, Minggu Ini, Bulan Ini*).
- Indikator pin badge emas untuk warta penting/prioritas.
- Fitur **"Cetak Buletin Warta"** (Modal pratinjau buletin siap cetak atau ekspor PDF).

#### 8. Jadwal Ibadah & Agenda Mingguan (`#jadwal`)
- Rincian jam ibadah utama + jadwal kegiatan mingguan:
  - **Selasa**: Pelayanan Kunjungan Jemaat & Doa Konseling Rumah Tangga.
  - **Sabtu**: Latihan Musik DS Worship & Pembekalan Tim Pelayan.
- Pratinjau jadwal pelayan ibadah (Servant Roster) pekan berjalan.

#### 9. Pusat Layanan Pastoral & Sakramen (`#layanan`)
- 4 Tab Formulir Interaktif:
  1. *Permohonan Doa & Konseling / Kunjungan Jemaat Selasa*
  2. *Pendaftaran Sakramen Baptisan Selam / Penyerahan Anak*
  3. *Pendaftaran Bergabung Komsel Ekklesia*
  4. *Pendaftaran Pelayan Ibadah (Musik, Singers, Usher, Multimedia)*
- Terhubung otomatis ke WhatsApp pastoral dengan pesan terformat rapi.

#### 10. Persembahan & Perpuluhan Digital (`#persembahan`)
- Informasi Rekening Bank Resmi:
  - **BCA**: `246-098-7711` (GIA Deliksari)
  - **Bank Mandiri**: `136-00-1928374-1` (GIA Deliksari)
  - **BRI**: `0341-01-002938-53-0` (GIA Deliksari)
- Fitur **1-Klik Salin Nomor Rekening** dengan notifikasi toast visual.
- Tombol konfirmasi bukti transfer via WhatsApp ke bendahara gereja.

#### 11. Galeri Dokumentasi Foto & Visual Lightbox (`#galeri`)
- 8 foto dokumentasi fisik gereja dan kegiatan ibadah riil.
- Filter kategori & *Full-screen Lightbox Modal* dengan zoom dan navigasi.

#### 12. Lokasi, Rute Google Maps & FAQ Jemaat (`#kontak` / `#lokasi`)
- Alamat lengkap: *Jl. Kolonel Hadijanto, Deliksari, Gunung Pati, Kota Semarang*.
- Peta interaktif & tombol navigasi Google Maps.
- FAQ Accordion untuk pertanyaan umum jemaat dan pengunjung baru.

---

### 3.2. Admin Operational Portal (`/admin`)
- **Autentikasi PIN**: Default password `9900` dengan autocomplete yang ramah peramban.
- **Ringkasan Operasional**: Statistik total warta aktif, jumlah pelayan terdaftar di 4 kategori, dan status kesiapan inventaris ibadah.
- **Manajemen Warta**: CRUD pengumuman, status draft/publish, pin priority.
- **Plotting Tugas Pelayan (Servants Roster)**: Tab 4 kategori (General, Youth, Kidz, Hana) dengan input peran, nama pelayan, dan nomor kontak.
- **Checklist Inventaris & Sound System**: Audit realtime kelayakan fasilitas ibadah (Sound, Multimedia, Musik, Ruangan).
- **Sinkronisasi Supabase PostgreSQL & Offline Fallback**.
