# Design System: GIA Deliksari Web Platform
**Project ID:** `gia-deliksari-web-2026`  
**Aesthetic Direction:** *Contemporary Sanctuary & Digital Hospitality*  
**DFII Score:** 14/15 (Aesthetic Impact: 5, Context Fit: 5, Implementation Feasibility: 5, Performance Safety: 5, Consistency Risk: 1)  
**Repository:** [https://github.com/zzdree/gia-deliksari-web](https://github.com/zzdree/gia-deliksari-web)  
**Live Production URL:** [https://gia-deliksari-web.vercel.app](https://gia-deliksari-web.vercel.app)  

---

## 1. Visual Theme & Atmosphere
Desain web GIA Deliksari v2.0 dirancang dengan inspirasi gereja modern terkemuka (GMS, JPCC, Hillsong) yang mengedepankan **kehangatan rohani, martabat arsitektural, dan keterbukaan bagi setiap generasi**.

- **Mood & Atmosphere**: *Warm, Reverent, Dynamic, and Hospitable*.
- **Visual Thesis**: Perpaduan kanvas obsidian berkedalaman (*Deep Slate Obsidian*) dengan aksen emas hangat (*Radiant Amber Gold*) dan pendaran halus kristal (*Frosted Glassmorphism*).
- **Differentiation Anchor**: Kartu floating identitas `✝ 4 Komunitas Ibadah`, countdown banner ibadah minggu berikutnya, dan hub keramahan jemaat baru (*"Baru Pertama Kali di Sini?"*).

---

## 2. Color Palette & Semantic Roles

### 2.1. Core System Palette
| Descriptive Name | Hex Code | Functional Role |
|---|---|---|
| **Radiant Amber Gold** | `#F59E0B` (`amber-500`) | Primary CTA, highlight kata kunci, active states, priority badges |
| **Deep Warm Amber** | `#D97706` (`amber-600`) | Hover state tombol utama, border aksen terang |
| **Glow Amber Soft** | `#FEF3C7` (`amber-100`) | Background badge terang, aksen teks gelap |
| **Deep Obsidian Dark** | `#090D16` | Background kanvas dasar pada Dark Mode |
| **Dark Slate Surface** | `#0F172A` (`slate-900`) | Background kartu, modul form, dan container gelap |
| **Elevated Glass Card** | `#1E293B` (`slate-800/80`) | Surface elevated dengan backdrop blur |
| **Pure Ceramic Light** | `#F8FAFC` (`slate-50`) | Canvas background pada Light Mode |
| **Clean White Surface** | `#FFFFFF` | Kontainer kartu dan modal pada Light Mode |
| **Luminous Emerald** | `#10B981` (`emerald-500`) | Status aktif `Live Onsite`, indikator jadwal berjalan |
| **Sacred Indigo** | `#6366F1` (`indigo-500`) | Aksen pelayanan generasi muda (Youth) |
| **Warm Rose** | `#F43F5E` (`rose-500`) | Aksen pelayanan Hana & Komsel |

---

## 3. Typography Rules
- **Display Headings**: `system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif`  
  - H1 Hero: `text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]`
  - H2 Section: `text-3xl sm:text-4xl font-extrabold tracking-tight`
  - H3 Card Title: `text-xl font-bold tracking-tight`
- **Body & Subtitles**: `text-base sm:text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-300`
- **Micro-Copy & Badges**: `text-xs font-black uppercase tracking-widest`

---

## 4. Component Stylings & Geometry

* **Buttons (Primary CTA)**: Generously rounded corners (`rounded-2xl` / `rounded-full`), amber gradient fill (`from-amber-500 to-amber-600`), high-contrast white/black text, soft glow shadow (`shadow-amber-500/25`), subtle hover scale (`hover:scale-[1.02] active:scale-[0.98]`).
* **Glass Cards & Containers**: Rounded 24px (`rounded-3xl`), border `1px` translucent (`border-slate-200/80 dark:border-white/10`), backdrop blur (`backdrop-blur-xl`), deep diffused elevation shadow.
* **Badges & Pills**: Pill-shaped (`rounded-full`), padded (`px-3.5 py-1.5`), font-bold `text-xs`, subtle border outline.
* **Form Controls**: Crisp borders (`rounded-xl border-slate-200 dark:border-slate-700`), focused ring `focus:ring-2 focus:ring-amber-500`, smooth transitions.

---

## 5. Layout & Spatial Composition
* **Whitespace & Rhythm**: Generous vertical section padding (`py-20 sm:py-28`) for breathing room.
* **Grid Hierarchy**: 12-column responsive layout transitioning gracefully from 1-column on mobile to 2/3/4-columns on desktop.
* **Controlled Elevation**: Negative z-index ambient gradients (`blur-[120px]`) behind sections to create atmospheric depth without visual clutter.

---

## 6. Live Routes Reference
* 🌐 **Public Landing**: [https://gia-deliksari-web.vercel.app](https://gia-deliksari-web.vercel.app)
* 🛡️ **Admin Portal**: [https://gia-deliksari-web.vercel.app/admin](https://gia-deliksari-web.vercel.app/admin)
* 📦 **GitHub Repository**: [https://github.com/zzdree/gia-deliksari-web](https://github.com/zzdree/gia-deliksari-web)
