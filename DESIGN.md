# Design System & Token Specification — GIA Deliksari Web Portal
**Versi:** 3.3.0 (Harmonized Public, Media Pipeline & Rolling Cloud Storage Edition)  
**Status:** In Progress / Production Ready  
**Tanggal Diperbarui:** 23 Agustus 2026  
**Identitas Brand:** Gereja Isa Almasih (GIA) Deliksari Semarang — *"Growing Church!"*  

---

## 1. Core Color Palette Tokens

### 1.1 Light Mode (Warm Church Cream & Sacred Crimson)
- **Background Primary**: `#FDFBF7` (Warm Cream Church Paper)
- **Background Secondary / Surface**: `#F7F2E8` (Muted Warm Cream)
- **Surface Card**: `#FFFFFF`
- **Border Default**: `#EBDDCF` / `#E5D3C1`
- **Text Primary**: `#1F1617` (Deep Warm Charcoal)
- **Text Secondary / Muted**: `#5A4D4E` / `#6E5D5F`
- **Primary Accent / CTA**: `#C5222E` (Sacred Crimson Red)
- **Primary Accent Gradient**: `linear-gradient(to right, #C5222E, #80141C)`
- **Gold Accent**: `#C59B27` / `#B87A14`

### 1.2 Dark Mode (Deep Velvet Maroon & Sacred Crimson)
- **Background Primary**: `#150B0D` (Deep Velvet Maroon)
- **Background Secondary / Surface**: `#221215` (Deep Velvet Surface)
- **Surface Elevated / Input**: `#2A161A`
- **Border Default**: `#3A1C20` / `#521E25`
- **Text Primary**: `#F5EFEB` (Warm White)
- **Text Secondary / Muted**: `#D5C2C4` / `#B5A1A3`
- **Primary Accent / CTA**: `#C5222E` (Sacred Crimson Red)
- **Glow Highlights**: `#C5222E/15` blur-3xl

---

## 2. Ministry Community Tokens & Badge Classes

| Kategori Komunitas | Light Badge Classes | Dark Badge Classes | Accent Color |
|---|---|---|---|
| **Ibadah Raya** | `bg-[#FDF0F0] text-[#9A1620] border-[#F5CDD0]` | `dark:bg-[#331418] dark:text-[#F2828C] dark:border-[#521E25]` | Sacred Crimson (`#C5222E`) |
| **Grow Generation Youth** | `bg-[#FFF2EE] text-[#C83E20] border-[#FCD2C7]` | `dark:bg-[#331812] dark:text-[#F88B72] dark:border-[#57241A]` | Terracotta Orange (`#C83E20`) |
| **COC Kidz (Sekolah Minggu)** | `bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5]` | `dark:bg-[#332612] dark:text-[#F0BE5E] dark:border-[#543E19]` | Warm Gold (`#B87A14`) |
| **Wanita Hana & Komsel** | `bg-[#FDF0F4] text-[#A6264A] border-[#F7C6D5]` | `dark:bg-[#33121E] dark:text-[#EA7FA0] dark:border-[#541D30]` | Dusty Rose (`#A6264A`) |

---

## 3. UI Component Specifications for Media & Storage Pipeline

### 3.1 Upload Documentation Dialog / Button
- **Trigger Button**:
  - `px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 hover:opacity-95 transition-all`
- **Upload Modal**:
  - Dialog container: `rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-2xl p-6 sm:p-8 max-w-lg`
  - Dropzone: `border-2 border-dashed border-[#EBDDCF] dark:border-[#3A1C20] hover:border-[#C5222E] rounded-2xl p-6 text-center transition-colors bg-[#F7F2E8] dark:bg-[#2A161A]`
  - Retention notice pill: `p-3 rounded-xl bg-[#FEF9EC] text-[#B87A14] border border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E] text-xs` menjelaskan foto akan diarsipkan di Google Drive dan di-cache di Galeri Web.

### 3.2 Google Drive Archive Action Button
- **Placement**: Di header atau footer `GallerySection.tsx` dan modul Media Admin.
- **Styling**: `px-5 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20] transition-colors text-xs font-bold flex items-center gap-2`
- **Icon**: Folder / Cloud / Google Drive icon + `ExternalLink`.

### 3.3 YouTube Auto-Sync Video Card
- **Thumbnail Aspect Ratio**: `16/10` or `16/9` with rounded overlay & backdrop blur play button `bg-[#C5222E]/90`.
- **Live / Latest Indicator**:
  - `px-3 py-1 rounded-xl text-xs font-bold bg-[#C5222E] text-white border border-white/20 flex items-center gap-1.5` with pulsing dot.

### 3.4 Print-Friendly Roster Layout
- Clean black & white on white paper layout with crisp borders `border-stone-200`, clear typography, and formatted columns (No, Role, Nama Petugas, Status Kesiapan, Catatan Teknis).

---

## 4. Typography & Geometry Standard
- **Headings**: `font-extrabold tracking-tight` (Google Fonts Inter / Plus Jakarta Sans)
- **Cards & Section Containers**: `rounded-[2.5rem]` or `rounded-[2rem]`
- **Inputs & Selects**: `px-4 py-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20]`
- **Buttons**: `rounded-2xl font-extrabold` with gradient `#C5222E` to `#80141C`.



### 3.4 Print-Friendly Roster Layout
- Clean black & white on white paper layout with crisp borders `border-stone-200`, clear typography, and formatted columns (No, Role, Nama Petugas, Status Kesiapan, Catatan Teknis).

---

---

## 5. Gallery Section UI Specifications (Public Homepage)

### 5.1 Gallery Grid Container
- **Section Wrapper**: `py-16 sm:py-20 bg-[#FDFBF7] dark:bg-[#150B0D]`
- **Section Header** (Judul + Subtitle + 2 Tombol Aksi):
  - Title: `text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F1617] dark:text-[#F5EFEB]`
  - Subtitle: `text-sm sm:text-base text-[#5A4D4E] dark:text-[#D5C2C4] mt-2 max-w-2xl`
  - Action row: `flex flex-wrap items-center gap-3 mt-6`
- **Tombol "📷 Unggah Foto Momen"** (Primary):
  - `px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 hover:opacity-95 transition-all`
- **Tombol "📁 Buka Arsip Google Drive"** (Secondary):
  - `px-5 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20] transition-colors text-xs font-bold flex items-center gap-2`

### 5.2 Gallery Grid (12 Foto Random)
- **Container**: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4`
- **Card Item**:
  - `group relative aspect-square overflow-hidden rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] cursor-pointer hover:border-[#C5222E] transition-all`
  - `<img>` tag: `w-full h-full object-cover group-hover:scale-105 transition-transform duration-500`
  - Loading state: skeleton shimmer `animate-pulse bg-gradient-to-r from-[#F7F2E8] via-[#EBDDCF] to-[#F7F2E8] dark:from-[#2A161A] dark:via-[#3A1C20] dark:to-[#2A161A]`
  - Hover overlay: `absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity`
  - Hover info: judul foto + uploader name di bottom-left, `text-white text-xs font-bold`

### 5.3 "Tampilkan Lebih Banyak" Pagination
- **Tombol**: `px-6 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20] transition-colors text-sm font-bold flex items-center gap-2 mx-auto`
- **Behavior**: Klik → fetch 12 foto random lagi (replace grid, bukan append) untuk体验 "acak tiap load"

### 5.4 Empty State
- **Icon**: CloudOff atau ImageIcon Lucide, `w-16 h-16 text-[#5A4D4E] dark:text-[#B5A1A3] mx-auto`
- **Text**: `text-base text-[#5A4D4E] dark:text-[#D5C2C4] mt-4 text-center`
- **Copy**: "Belum ada foto momen. Yuk upload foto kegiatan gerejamu!"

---

## 6. Upload Photo Modal Specifications

### 6.1 Modal Trigger & Container
- **Trigger**: Tombol "📷 Unggah Foto Momen" di Gallery Section header
- **Dialog Container**: `rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-2xl p-6 sm:p-8 max-w-lg w-full`
- **Header**:
  - Title: `text-2xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB]`
  - Subtitle: `text-sm text-[#5A4D4E] dark:text-[#D5C2C4] mt-1`

### 6.2 Dropzone
- **Container**: `border-2 border-dashed border-[#EBDDCF] dark:border-[#3A1C20] hover:border-[#C5222E] rounded-2xl p-6 text-center transition-colors bg-[#F7F2E8] dark:bg-[#2A161A]`
- **Icon**: UploadCloud Lucide, `w-12 h-12 text-[#5A4D4E] dark:text-[#B5A1A3] mx-auto`
- **Text**:
  - Primary: `text-sm font-bold text-[#1F1617] dark:text-[#F5EFEB] mt-3` → "Klik atau drop foto di sini"
  - Secondary: `text-xs text-[#5A4D4E] dark:text-[#B5A1A3] mt-1` → "JPG/PNG/WebP, max 10 MB"
- **Preview Thumbnail**: Setelah pilih file, tampil preview di dropzone dengan `aspect-square max-w-[200px] mx-auto rounded-xl object-cover`

### 6.3 Form Fields
- **Field Container**: `space-y-4 mt-6`
- **Input Title** (required):
  - Label: `text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB] mb-1.5 block`
  - Input: `w-full px-4 py-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] focus:border-[#C5222E] focus:outline-none transition-colors`
  - Placeholder: "Contoh: Ibadah Raya Minggu ke-32"
- **Input Category** (required, dropdown):
  - Style sama dengan input title
  - Options: Ibadah Raya, Youth, Kidz, Wanita Hana, Komsel, Umum
- **Input Uploader Name** (optional):
  - Style sama
  - Placeholder: "Nama kamu (opsional, untuk kredit)"

### 6.4 Retention Notice Pill
- **Container**: `p-3 rounded-xl bg-[#FEF9EC] text-[#B87A14] border border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E] text-xs flex items-start gap-2 mt-4`
- **Icon**: Info Lucide, `w-4 h-4 flex-shrink-0 mt-0.5`
- **Copy**: "Foto akan diarsipkan permanen di Google Drive gereja dan di-cache di Galeri Web (kompres otomatis). Kamu bisa download dari tombol 'Lihat Resolusi Penuh', tapi tidak bisa edit/hapus."

### 6.5 Action Buttons
- **Container**: `flex items-center gap-3 mt-6`
- **Tombol Batal** (Secondary):
  - `flex-1 px-4 py-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20] transition-colors text-sm font-bold`
- **Tombol Unggah** (Primary, disabled saat loading):
  - `flex-1 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white text-sm font-bold shadow-sm hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`
  - Loading: spinner `animate-spin w-4 h-4` + text "Mengunggah..."

### 6.6 Error States
- **Upload gagal**: Toast merah `bg-[#C5222E] text-white px-4 py-3 rounded-2xl shadow-lg` dengan pesan error friendly
- **File terlalu besar**: Validasi client-side sebelum submit, tampil error inline di bawah dropzone
- **Network error**: Retry button di toast

---

## 7. Lightbox Modal (Klik Foto di Galeri)

### 7.1 Container
- **Backdrop**: `fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8`
- **Image Container**: `relative max-w-5xl w-full max-h-[90vh] flex flex-col`
- **Image**: `w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl`

### 7.2 Action Bar (Bawah Foto)
- **Container**: `flex flex-wrap items-center gap-3 mt-4 p-4 rounded-2xl bg-[#221215]/80 backdrop-blur-md border border-white/10`
- **Tombol "⬇️ Lihat Resolusi Penuh"** (Primary):
  - `px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white text-xs font-bold shadow-sm flex items-center gap-2 hover:opacity-95 transition-all`
  - Buka `drive_web_view_link` di tab baru (jemaat download dari Google Drive)
- **Tombol "✕ Tutup"** (Ghost):
  - `px-5 py-2.5 rounded-2xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors flex items-center gap-2`
- **Info Text** (kredit uploader): `text-xs text-white/70 ml-auto` → "Diupload oleh [nama] • [tanggal]"

### 7.3 Navigation
- **Tombol Prev/Next**: `absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white`
- **Posisi**: prev di `left-4`, next di `right-4`
- **Icon**: ChevronLeft / ChevronRight Lucide

---

## 8. Storage Status Indicators (Admin Panel)

### 8.1 Storage Overview Card (di Admin → Media)
- **Container**: `p-6 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20]`
- **Header**: `text-lg font-extrabold text-[#1F1617] dark:text-[#F5EFEB] flex items-center gap-2`
  - Icon: HardDrive Lucide
- **Status Rows**:
  - Each row: `flex items-center justify-between py-3 border-b border-[#EBDDCF] dark:border-[#3A1C20] last:border-0`
  - Label: `text-sm font-bold text-[#1F1617] dark:text-[#F5EFEB]`
  - Value: `text-sm text-[#5A4D4E] dark:text-[#D5C2C4]`
  - Status Badge:
    - ✅ Active: `px-2 py-0.5 rounded-lg bg-[#FDF0F0] text-[#9A1620] text-xs font-bold border border-[#F5CDD0] dark:bg-[#331418] dark:text-[#F2828C]`
    - ❌ Not Configured: `px-2 py-0.5 rounded-lg bg-[#FEF9EC] text-[#B87A14] text-xs font-bold border border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E]`

### 8.2 Status Rows Content
- **Google Drive Folder**: Label "📁 Folder Upload" | Value: "[Nama folder]" | Status: ✅ Active / ❌
- **OAuth Token**: Label "🔑 OAuth Refresh Token" | Value: "Valid until [date]" | Status: ✅ / ❌
- **Supabase Storage**: Label "☁️ Bucket church-gallery" | Value: "[X] MB / 1 GB" | Status: ✅ / ❌
- **Image Transform**: Label "🎨 Image Transform" | Value: "Enabled" | Status: ✅ / ❌
- **Total Gallery Items**: Label "📸 Total Foto di Galeri" | Value: "[N] foto"

### 8.3 Sync Button (Admin → Media)
- **Tombol "🔄 Sync dari Drive"**:
  - `w-full mt-4 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white text-sm font-bold shadow-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50`
  - Loading: spinner + "Menyinkronkan..."
  - Result toast: "✅ Berhasil sync [N] foto baru" / "ℹ️ Tidak ada foto baru"

---

## 9. Brand Consistency Notes

- **Warna utama**: Sacred Crimson `#C5222E` → Deep Maroon `#80141C` (gradient) untuk semua CTA primary
- **Border radius**: `rounded-2xl` (16px) untuk buttons/inputs, `rounded-[2.5rem]` (40px) untuk modal/dialog
- **Spacing**: konsisten pakai Tailwind tokens (`gap-3`, `p-6`, `mt-4`, dst)
- **Dark mode**: setiap warna light punya pasangan dark yang tercantum di §1.2
- **Icons**: gunakan Lucide React exclusively (sudah ada di stack) — UploadCloud, HardDrive, CloudOff, Info, ChevronLeft, ChevronRight, ExternalLink, X
- **Font**: Inter / Plus Jakarta Sans, `font-extrabold tracking-tight` untuk heading, `font-medium` untuk body
