# Design System: GIA Deliksari Web Platform
**Project ID:** gia-deliksari-web-2026  
**Aesthetic Style:** Modern Spiritual & Editorial Warmth (High-legibility, Clean Geometry, Adaptive Theme)

---

## 1. Visual Theme & Atmosphere
Desain web GIA Deliksari mengusung perpaduan suasana **hangat, ramah, dan penuh semangat pertumbuhan rohani (*"GROWING CHURCH!"*)**. Nuansa visual dirancang bersih (*clean*), berwibawa namun bersahabat, dengan kontras yang nyaman di mata baik pada mode terang (*Light Mode*) maupun mode gelap (*Dark Mode*). 

Tidak menggunakan warna neon acak atau gradasi murah; seluruh palet warna dipilih secara harmonis berbasis nada Deep Royal Navy, Warm Gold/Amber accents, dan Crisp Slate grays.

---

## 2. Color Palette & Functional Roles

### Light Mode
- **Primary Accent (Warm Divine Gold / Amber):** #D97706 (Amber-600) / #B45309 (Amber-700) – Digunakan untuk tombol aksi utama, badge penting, dan penanda sorotan.
- **Primary Brand Navy:** #1E3A8A (Blue-900) / #1E293B (Slate-800) – Digunakan untuk teks judul utama, navbar brand, dan penegasan hierarki.
- **Background Base:** #F8FAFC (Slate-50) – Latar belakang kanvas yang bersih dan lembut.
- **Surface / Card Background:** #FFFFFF (Pure White) – Latar belakang kartu konten dan form.
- **Border / Divider:** #E2E8F0 (Slate-200) – Garis pemisah halus tanpa bayangan berlebihan.
- **Text Primary:** #0F172A (Slate-900) – Teks bacaan dengan tingkat keterbacaan maksimal.
- **Text Secondary:** #64748B (Slate-500) – Keterangan pendukung, label tanggal, dan metadata.

### Dark Mode
- **Background Base:** #0F172A (Slate-900) – Kanvas gelap yang elegan dan tidak melelahkan mata.
- **Surface / Card Background:** #1E293B (Slate-800) – Kartu penampung konten dengan kontras seimbang.
- **Border / Divider:** #334155 (Slate-700) – Garis tepi kartu yang lembut.
- **Primary Accent:** #F59E0B (Amber-500) – Kontras terang untuk aksi dan fokus.
- **Text Primary:** #F8FAFC (Slate-50) – Teks putih terang yang mudah dibaca.
- **Text Secondary:** #94A3B8 (Slate-400) – Teks sekunder yang nyaman dipandang.

### Ministry Color Badges
- **COC Kidz:** #10B981 (Emerald Green) – Ceria, segar, melambangkan pertumbuhan anak.
- **Grow Generation (Youth):** #6366F1 (Indigo / Electric Violet) – Energik, modern, dinamis.
- **Hana Fellowship:** #EC4899 (Rose Pink) – Kasih, kehangatan ibu & keluarga.
- **General Service:** #D97706 (Amber Gold) – Keagungan, hikmat, dan persekutuan raya.

---

## 3. Typography Rules
- **Display & Heading Font:** *Plus Jakarta Sans* / *Inter* (Google Fonts) – Bobot Bold (700) dan Semi-Bold (600) dengan letter-spacing proporsional (-0.02em untuk heading besar).
- **Body Text:** *Inter* – Bobot Regular (400) dan Medium (500), line-height 1.6 untuk kenyamanan membaca pengumuman dan jadwal.
- **Badge & Label:** Font Medium (500) atau Semi-Bold (600) dengan uppercase tracking halus.

---

## 4. Component Stylings
- **Buttons:** Sudut membulat modern (ounded-xl / 12px), efek hover dengan elevasi halus dan transisi 200ms (ctive:scale-[0.98]).
- **Cards & Containers:** Permukaan bertekstur halus, sudut melengkung 16px (ounded-2xl), border tipis (1px solid), bayangan sangat halus (shadow-sm hingga shadow-md saat hover).
- **Inputs, Dropdowns & Textarea:** Border terdefinisi tegas dengan transisi ring fokus amber/gold (ocus:ring-2 focus:ring-amber-500 focus:border-amber-500).
- **Checklist Toggle (Inventory):** Checkbox interaktif ukuran besar dengan transisi animasi centang hijau dan status coret garis/badge jelas.
- **Theme Switcher:** Tombol pill minimalis dengan ikon Matahari (Sun) dan Bulan (Moon).

---

## 5. Layout Principles & Responsiveness
- **Max Content Width:** Container utama max-w-7xl (1280px) dengan padding dinamis (px-4 sm:px-6 lg:px-8).
- **Grid Layout:** 
  - Mobile: 1 Kolom vertikal yang mudah di-scroll.
  - Tablet: 2 Kolom proporsional.
  - Desktop: 3-4 Kolom untuk kartu pelayanan, pengumuman, dan inventaris.
- **Admin Sidebar / Tab Navigation:** Tab navigasi yang responsif, beralih ke mobile drawer/bottom navigation saat diakses via ponsel.
