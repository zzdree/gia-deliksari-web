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
