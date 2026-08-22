# Design System: GIA Deliksari Web Platform
**Project ID:** `gia-deliksari-web-2026`  
**Aesthetic Theme:** Modern Spiritual & Editorial Warmth (Clean Geometry, Warm Gold & Deep Navy, Adaptive Dark/Light Mode)  
**Repository:** [https://github.com/zzdree/gia-deliksari-web](https://github.com/zzdree/gia-deliksari-web)  
**Live Application:** [https://gia-deliksari-web.vercel.app](https://gia-deliksari-web.vercel.app)  

---

## 1. Visual Philosophy & Atmosphere
Desain visual web GIA Deliksari dirancang untuk menghadirkan atmosfer **kehangatan rohani, martabat gereja, dan energi pertumbuhan iman (*"GROWING CHURCH!"*)**.

Prinsip desain utama:
- **Function-Driven Clarity**: Menghindari elemen dekoratif yang berlebihan (*no cliché gradients/gimmicks*); hierarki informasi mengutamakan kemudahan jemaat mengakses warta, jadwal, dan kontak.
- **Harmonious Contrast**: Kontras warna yang seimbang dan nyaman di mata untuk sesi baca yang lama, baik di mode siang (*Light Mode*) maupun malam (*Dark Mode*).
- **Official Brand Identity**: Menggunakan logo resmi gereja ([`public/images/logo.png`](file:///C:/ANDREAS/gia-deliksari-web/public/images/logo.png)) dan dokumentasi visual riil beresolusi tinggi.

---

## 2. Color Tokens & Semantic Roles

### 2.1. Core Palette
| Token | Light Mode Value | Dark Mode Value | Usage / Semantic Role |
|---|---|---|---|
| **Primary Accent** | `#D97706` (Amber-600) | `#F59E0B` (Amber-500) | Tombol CTA utama, badge prioritas, active states, borders |
| **Primary Brand Navy** | `#1E3A8A` (Blue-900) | `#38BDF8` (Sky-400) | Judul hero, logo badge, aksen teologi |
| **Background Canvas** | `#F8FAFC` (Slate-50) | `#0F172A` (Slate-900) | Latar belakang dasar halaman |
| **Surface / Card** | `#FFFFFF` (White) | `#1E293B` (Slate-800) | Kontainer kartu warta, modul jadwal, form input |
| **Borders & Dividers** | `#E2E8F0` (Slate-200) | `#334155` (Slate-700) | Garis pemisah halus antar komponen |
| **Text Primary** | `#0F172A` (Slate-900) | `#F8FAFC` (Slate-50) | Heading, teks isi warta, label form |
| **Text Secondary** | `#64748B` (Slate-500) | `#94A3B8` (Slate-400) | Metadata tanggal, keterangan gembala, footer |

### 2.2. Ministry Semantic Colors
- ⛪ **General Service**: `Amber` (`#D97706`) – Martabat & persekutuan jemaat raya.
- 🔥 **Grow Generation Youth**: `Indigo` (`#6366F1`) – Energi muda, dinamis, dan visioner.
- 🎨 **COC Kidz**: `Emerald` (`#10B981`) – Keceriaan, pertumbuhan awal anak-anak.
- 🌸 **Hana Fellowship**: `Rose` (`#EC4899`) – Kasih, kehangatan persekutuan wanita & keluarga.

---

## 3. Typography Hierarchy
- **Primary Typeface**: `Inter` / `system-ui` – Sans-serif geometris modern berdaya baca tinggi.
- **Headings (H1/H2/H3)**: Tracking `-0.02em`, font-weight `Bold` (700) / `Semibold` (600).
- **Body & Captions**: Line-height `1.6`, font-weight `Regular` (400) / `Medium` (500).

---

## 4. UI Components & Interaction Models
1. **Navigation Bar**: Sticky header dengan efek *backdrop blur*, navigasi desktop + drawer mobile, logo gereja berbentuk lingkaran berbingkai emas, dan switch tema.
2. **Interactive Gallery**: Grid visual 4:5 ratio dengan filter kategori dinamis, zoom hover state, dan *Full-screen Lightbox Modal* dengan tombol Prev/Next & deskripsi acara.
3. **Papan Pengumuman (Announcements)**: Filter tab waktu (*Minggu Depan / Bulan Ini / Semua*), pin badge emas untuk warta penting.
4. **Admin Inventory Checklist**: Checkbox berukuran sentuh nyaman (*touch-friendly*), animasi centang realtime, status kondisi berkode warna (*Good / Maintenance / Broken*), dan indikator koneksi Supabase Cloud Database.
5. **Theme Switcher**: Tombol pill bertekstur lembut dengan transisi ikon Sun/Moon yang halus.

---

## 5. Live Route Reference
- 🌐 **Landing Page**: [https://gia-deliksari-web.vercel.app](https://gia-deliksari-web.vercel.app)
- 🛡️ **Admin Portal**: [https://gia-deliksari-web.vercel.app/admin](https://gia-deliksari-web.vercel.app/admin)
- 📦 **GitHub Repository**: [https://github.com/zzdree/gia-deliksari-web](https://github.com/zzdree/gia-deliksari-web)
