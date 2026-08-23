# DESIGN SYSTEM v3.2.0 — Warm Church Cream & Sacred Crimson Edition

## 1. Design Archetype: Warm Sacred Elegance (Cream & Crimson)
- **Primary Canvas (Light)**: Warm Church Cream (`#FDFBF7`) — mencerminkan warna cat fisik dinding gedung GIA Deliksari.
- **Secondary Canvas / Surface subtle**: Soft Warm Linen Cream (`#F7F2E8`, `#EFE6D5`).
- **Primary Sacred Red**: Crimson Red (`#C5222E`) — warna merah resmi logo Gereja Isa Almasih.
- **Secondary Rich Maroon**: Burgundy Maroon (`#80141C`, `#5E0B13`).
- **Maroon Gradient**: `bg-gradient-to-r from-[#C5222E] via-[#A31823] to-[#80141C]`.
- **Text Headings**: Charcoal Espresso (`#1F1617`) pada mode terang / White Cream (`#F5EFEB`) pada mode gelap.
- **Text Body**: Warm Coffee Slate (`#5A4D4E`, `#6E5D5F`) pada mode terang / Soft Linen White (`#D5C2C4`, `#B5A1A3`) pada mode gelap.
- **Borders**: Cream Sand Border (`#EBDDCF`) pada mode terang / Dark Maroon Border (`#3A1C20`) pada mode gelap.
- **Dark Mode Background**: Velvet Maroon Charcoal (`#150B0D`) — *menggantikan slate/navy lama*.
- **Dark Mode Cards & Popovers**: Deep Maroon Plum (`#221215`, `#2A161A`).

---

## 2. Palette Tokens
| Token Name | Light Value | Dark Value | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| `canvas` | `#FDFBF7` (Warm Cream) | `#150B0D` (Deep Velvet Maroon) | Background utama seluruh halaman (Home & Admin) |
| `surface` | `#FFFFFF` (Pure White) | `#221215` (Plum Surface) | Kartu utama, container form, dialog modal |
| `surface-subtle` | `#F7F2E8` (Linen Cream) | `#2A161A` (Subtle Maroon) | Section sekunder, container filter tab, badge background |
| `primary-red` | `#C5222E` (Crimson) | `#E03643` (Bright Crimson) | Tombol CTA utama, status aktif tab, icon highlight |
| `maroon-deep` | `#80141C` (Rich Maroon) | `#B82834` (Vibrant Maroon) | Tombol hover, gradient sekunder, border badge |
| `gold-accent` | `#C59B27` (Sacred Gold) | `#E5B640` (Bright Gold) | Aksen salib, highlight ayat Alkitab, badge tersemat |
| `border-cream` | `#EBDDCF` | `#3A1C20` | Garis pembatas kartu, input field border |

---

## 3. Ministry Community Tokens & Badges
Setiap komunitas memiliki aksen warna spesifik yang seragam antara Public View dan Admin Portal:

1. **Ibadah Raya (Umum)**:
   - Light: `bg-[#FDF0F0] text-[#9A1620] border-[#F5CDD0]`
   - Dark: `dark:bg-[#331418] dark:text-[#F2828C] dark:border-[#521E25]`
   - Active Tab: `bg-[#C5222E] text-white`
2. **Grow Generation (Youth Ministry / PRBK)**:
   - Light: `bg-[#FFF2EE] text-[#C83E20] border-[#FCD2C7]`
   - Dark: `dark:bg-[#331812] dark:text-[#F88B72] dark:border-[#57241A]`
   - Active Tab: `bg-[#C83E20] text-white`
3. **Children Of Christ (COC Kidz / Sekolah Minggu)**:
   - Light: `bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5]`
   - Dark: `dark:bg-[#332612] dark:text-[#F0BE5E] dark:border-[#543E19]`
   - Active Tab: `bg-[#B87A14] text-white`
4. **Wanita Hana & Komsel Ekklesia**:
   - Light: `bg-[#FDF0F4] text-[#A6264A] border-[#F7C6D5]`
   - Dark: `dark:bg-[#33121E] dark:text-[#EA7FA0] dark:border-[#541D30]`
   - Active Tab: `bg-[#A6264A] text-white`

---

## 4. Status Kesiapan Pelayan (Roster Badges)
- **Siap Melayani (`confirmed`)**: `bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60`
- **Perlu Pengganti (`replacement`)**: `bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E] dark:border-[#543E19]`
- **Menunggu Konfirmasi (`pending`)**: `bg-[#F7F2E8] text-[#6E5D5F] border-[#EBDDCF] dark:bg-[#2A161A] dark:text-[#B5A1A3] dark:border-[#3A1C20]`

---

## 5. Standard Component Specs
- **CTA Primary Buttons**: `bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:from-[#B01D28] hover:to-[#6F1017] text-white font-bold rounded-2xl shadow-md transition-all`
- **Input / Select / Textarea**: `rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] outline-none`
- **Cards & Modals**: `rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm`
- **Dialog Backdrop**: `bg-black/60 backdrop-blur-sm`
- **Typography**:
  - Headings: `Plus Jakarta Sans`, font-extrabold/bold, tracking `-0.025em`.
  - Body: `Inter` / `system-ui`, tracking `-0.015em`, line-height relaxed.
