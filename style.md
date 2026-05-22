# Santap — Design System & Website Style Guide
**Version 2.0 — Complete Reference**

> Dokumen ini adalah sumber kebenaran tunggal untuk seluruh keputusan visual Santap, mulai dari landing page, halaman produk, dashboard merchant, hingga halaman error. Style ini berlaku untuk semua permukaan website — bukan hanya halaman pemasaran.

---

## Daftar Isi

1. [Brand Direction](#1-brand-direction)
2. [Design Principles](#2-design-principles)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Shape Language](#6-shape-language)
7. [Elevation & Shadow](#7-elevation--shadow)
8. [Glassmorphism](#8-glassmorphism)
9. [Background System](#9-background-system)
10. [Component: Button](#10-component-button)
11. [Component: Card](#11-component-card)
12. [Component: Form](#12-component-form)
13. [Component: Navigation](#13-component-navigation)
14. [Component: Badge & Tag](#14-component-badge--tag)
15. [Component: Modal & Overlay](#15-component-modal--overlay)
16. [Component: Toast & Alert](#16-component-toast--alert)
17. [Component: Table](#17-component-table)
18. [Component: Loading & Skeleton](#18-component-loading--skeleton)
19. [Mobile Mockup](#19-mobile-mockup)
20. [Image Style](#20-image-style)
21. [Icon System](#21-icon-system)
22. [Animation & Motion](#22-animation--motion)
23. [Micro Interaction](#23-micro-interaction)
24. [Responsive System](#24-responsive-system)
25. [Page-Specific Style](#25-page-specific-style)
26. [Dark Mode](#26-dark-mode)
27. [Accessibility](#27-accessibility)
28. [CSS Custom Properties — Full Reference](#28-css-custom-properties--full-reference)
29. [Tailwind Config](#29-tailwind-config)
30. [Do & Don't](#30-do--dont)

---

## 1. Brand Direction

### Identitas Visual

**Warm Minimal Food-Tech**

Santap adalah aplikasi pemesanan makanan untuk restoran, kafe, foodcourt, kantin, dan UMKM kuliner. Desain harus mencerminkan tiga hal sekaligus: kenyamanan brand makanan, kecanggihan produk digital modern, dan keramahan UMKM lokal.

```
Bersih seperti app produktivitas modern.
Hangat seperti brand makanan yang terpercaya.
Rapi seperti produk SaaS yang serius.
Mudah seperti kantin di pojok kampus.
```

### Karakter Visual

| Atribut       | Arah yang benar         | Hindari                        |
|---------------|-------------------------|--------------------------------|
| Bentuk        | Rounded, pill, organic  | Sharp, angular, geometric kaku |
| Warna         | Warm white, orange, hitam | Ungu, biru neon, gradient mesh agresif |
| Tipografi     | Tebal, clean, confident | Serif dekoratif, script, terlalu tipis |
| Foto          | Natural, warm lighting  | AI-generated, over-edited, studio plastik |
| Animasi       | Smooth, subtle, tactile | Dramatis, bounce berlebihan, parallax agresif |
| Layout        | Lapang, asimetris ringan | Padat, grid sempurna, terlalu simetris |

### Tone Visual per Halaman

| Halaman              | Tone                             |
|----------------------|----------------------------------|
| Landing / Marketing  | Premium, inspiring, confident    |
| Produk / Features    | Clear, helpful, educational      |
| Dashboard Merchant   | Efficient, clean, data-forward   |
| Checkout / Onboarding| Friendly, guided, reassuring     |
| Error / Empty State  | Warm, helpful, non-threatening   |
| Blog / Artikel       | Editorial, readable, focused     |

---

## 2. Design Principles

### P1 — Mobile-First, Not Mobile-Only
Desain dimulai dari layar 375px. Desktop adalah perluasan, bukan versi berbeda. Komponen harus bekerja sempurna di mobile sebelum dioptimalkan untuk desktop.

### P2 — Food is the Hero
Visual makanan selalu lebih penting dari elemen dekoratif. Jika ada pilihan antara ornamen desain dan foto makanan yang bagus, pilih foto makanan.

### P3 — One Focus Per Card
Setiap card memiliki satu tujuan: satu menu, satu fitur, satu CTA. Jangan jejalkan terlalu banyak informasi dalam satu card.

### P4 — Orange Earns Its Place
Warna oranye hanya untuk elemen yang butuh perhatian. Jika semua oranye, tidak ada yang menarik perhatian.

### P5 — Whitespace is Structure
Ruang kosong bukan pemborosan — itu adalah cara Santap mengomunikasikan kualitas. Layout padat terasa murahan.

### P6 — Animation Serves Function
Animasi hanya ada jika ia memberi informasi atau feedback. Animasi yang tidak berguna = distraksi.

### P7 — Consistent, Not Identical
Halaman berbeda boleh punya karakter berbeda, tapi font, warna, radius, dan shadow harus konsisten dari token yang sama.

---

## 3. Color System

### 3.1 Brand Colors

```css
/* Orange — Primary Action */
--color-orange:        #FF6A00;
--color-orange-hover:  #E85F00;
--color-orange-active: #D45600;
--color-orange-soft:   #FFF1E8;
--color-orange-faint:  #FFF7F1;
--color-orange-border: rgba(255, 106, 0, 0.20);
--color-orange-shadow: rgba(255, 106, 0, 0.24);

/* Black — Strong Contrast */
--color-black:        #090909;
--color-black-soft:   #171717;
--color-black-medium: #222222;

/* White & Cream */
--color-white:        #FFFFFF;
--color-cream:        #FFFBF7;
--color-warm:         #FFF8F0;
--color-warm-deep:    #FFF0E0;
```

### 3.2 Neutral Scale

```css
--color-gray-950: #0F0F0F;
--color-gray-900: #1F1F1F;
--color-gray-800: #2E2E2E;
--color-gray-700: #3F3F3F;
--color-gray-600: #525252;
--color-gray-500: #737373;
--color-gray-400: #A3A3A3;
--color-gray-300: #D4D4D4;
--color-gray-200: #E8E8E8;
--color-gray-150: #F0F0F0;
--color-gray-100: #F4F4F4;
--color-gray-50:  #FAFAFA;
```

### 3.3 Semantic Colors

```css
/* Success */
--color-success:       #16A34A;
--color-success-soft:  #F0FDF4;
--color-success-border: rgba(22, 163, 74, 0.20);

/* Warning */
--color-warning:       #D97706;
--color-warning-soft:  #FFFBEB;
--color-warning-border: rgba(217, 119, 6, 0.20);

/* Danger */
--color-danger:        #DC2626;
--color-danger-soft:   #FEF2F2;
--color-danger-border: rgba(220, 38, 38, 0.20);

/* Info */
--color-info:          #2563EB;
--color-info-soft:     #EFF6FF;
--color-info-border:   rgba(37, 99, 235, 0.20);
```

### 3.4 Food Accent Colors

Hanya sebagai aksen kecil — kategori menu, badge, dekorasi ringan. Jangan dominan.

```css
--food-green:   #22C55E;  /* Sayur, vegan */
--food-red:     #EF4444;  /* Pedas, daging */
--food-yellow:  #FBBF24;  /* Nasi, goreng */
--food-brown:   #8B5E34;  /* Kopi, cokelat */
--food-purple:  #A855F7;  /* Minuman, dessert */
--food-teal:    #14B8A6;  /* Seafood, segar */
```

### 3.5 Rasio Penggunaan

```
White / warm background   60–70%
Black / dark text         15–20%
Gray (neutral UI)          8–12%
Orange (accent/CTA)        5–10%
Semantic colors (util)      2–5%
Food accents               maks 3%
```

### 3.6 Aturan Warna

**Oranye dipakai untuk:**
- Primary CTA button
- Harga menu (price highlight)
- Badge aktif / selected state
- Icon highlight & active tab
- Hover state untuk elemen interaktif
- Garis aksen dan dekoratif tipis
- Rating star (dipakai kuning/oranye)

**Hitam dipakai untuk:**
- Semua headline dan display text
- Floating cart / FAB button
- Dark button variant
- Navbar dark variant (halaman dengan hero gelap)
- Area premium / dark section

**Putih & Cream dipakai untuk:**
- Background utama halaman
- Card surface
- Input field
- Mockup phone frame
- Section wrapper

**Abu dipakai untuk:**
- Body text dan caption
- Border dan divider
- Placeholder
- Disabled state
- Inactive tab / nav item
- Icon secondary

**Jangan pernah:**
- Menggunakan gradient ungu-biru sebagai aksen
- Memakai warna neon atau fluorescent
- Menggunakan warna food accent lebih dari satu per komponen
- Menggabungkan lebih dari 3 warna aksen dalam satu section

---

## 4. Typography

### 4.1 Font Stack

```css
--font-display: 'Plus Jakarta Sans', 'Satoshi', 'Geist', system-ui, sans-serif;
--font-body:    'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
--font-ui:      'Plus Jakarta Sans', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;
```

Import (Google Fonts):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 4.2 Type Scale

#### Display — Hero & marketing besar

```css
.type-display-2xl {
  font-size: clamp(56px, 9vw, 104px);
  line-height: 0.92;
  letter-spacing: -0.06em;
  font-weight: 800;
}

.type-display-xl {
  font-size: clamp(48px, 7.5vw, 88px);
  line-height: 0.94;
  letter-spacing: -0.055em;
  font-weight: 800;
}

.type-display-lg {
  font-size: clamp(40px, 6vw, 72px);
  line-height: 0.96;
  letter-spacing: -0.05em;
  font-weight: 800;
}
```

#### Heading — Section & halaman dalam

```css
.type-h1 {
  font-size: clamp(32px, 4.5vw, 56px);
  line-height: 1.02;
  letter-spacing: -0.045em;
  font-weight: 750;
}

.type-h2 {
  font-size: clamp(26px, 3.5vw, 44px);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 700;
}

.type-h3 {
  font-size: clamp(22px, 2.8vw, 34px);
  line-height: 1.10;
  letter-spacing: -0.03em;
  font-weight: 700;
}

.type-h4 {
  font-size: 22px;
  line-height: 1.18;
  letter-spacing: -0.025em;
  font-weight: 700;
}

.type-h5 {
  font-size: 18px;
  line-height: 1.25;
  letter-spacing: -0.02em;
  font-weight: 700;
}

.type-h6 {
  font-size: 16px;
  line-height: 1.30;
  letter-spacing: -0.015em;
  font-weight: 700;
}
```

#### Body — Teks konten

```css
.type-body-xl {
  font-size: 20px;
  line-height: 1.70;
  letter-spacing: -0.01em;
  font-weight: 400;
  color: var(--color-gray-500);
}

.type-body-lg {
  font-size: 18px;
  line-height: 1.68;
  letter-spacing: -0.01em;
  font-weight: 400;
  color: var(--color-gray-500);
}

.type-body-md {
  font-size: 16px;
  line-height: 1.65;
  letter-spacing: -0.005em;
  font-weight: 400;
  color: var(--color-gray-500);
}

.type-body-sm {
  font-size: 14px;
  line-height: 1.58;
  font-weight: 400;
  color: var(--color-gray-500);
}

.type-body-xs {
  font-size: 12px;
  line-height: 1.50;
  font-weight: 400;
  color: var(--color-gray-400);
}
```

#### UI Text — Label, badge, navigasi

```css
.type-label-lg {
  font-size: 15px;
  line-height: 1;
  letter-spacing: -0.01em;
  font-weight: 700;
}

.type-label-md {
  font-size: 13px;
  line-height: 1;
  letter-spacing: -0.01em;
  font-weight: 700;
}

.type-label-sm {
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0.02em;
  font-weight: 700;
  text-transform: uppercase;
}

.type-overline {
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0.10em;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-orange);
}
```

### 4.3 Typographic Rules

**Headline:** Selalu tebal (700–800), tight letter-spacing negatif, hitam. Jangan panjang. Jangan lebih dari 2 baris di hero.

**Body:** Abu (#737373). Bukan hitam. Bukan abu sangat terang. Line height lebar (1.65+) agar mudah dibaca.

**Price:** Selalu oranye, weight 800, letter-spacing -0.03em. Ini adalah elemen paling menonjol pada food card.

**Overline:** Sebelum section heading, kecil, uppercase, oranye, letter-spacing lebar. Gunakan untuk konteks ("Fitur Utama", "Mengapa Santap").

**Links:** Hitam dengan underline oranye tipis. Jangan biru default browser.

```css
a {
  color: var(--color-black);
  text-decoration: underline;
  text-decoration-color: var(--color-orange);
  text-underline-offset: 3px;
  text-decoration-thickness: 1.5px;
}
```

---

## 5. Spacing & Layout

### 5.1 Spacing Scale

Gunakan kelipatan 4px. Basis spacing adalah 8px.

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
--space-40: 160px;
```

### 5.2 Container

```css
.container {
  max-width: 1180px;
  margin-inline: auto;
  padding-inline: var(--space-6);   /* 24px */
}

.container-lg {
  max-width: 1380px;
  margin-inline: auto;
  padding-inline: var(--space-8);   /* 32px */
}

.container-sm {
  max-width: 780px;
  margin-inline: auto;
  padding-inline: var(--space-6);
}

.container-xs {
  max-width: 560px;
  margin-inline: auto;
  padding-inline: var(--space-6);
}

@media (min-width: 1024px) {
  .container        { padding-inline: var(--space-8); }
  .container-lg     { padding-inline: var(--space-10); }
}
```

### 5.3 Section Spacing

```css
.section        { padding-block: var(--space-24); }   /* 96px */
.section-lg     { padding-block: var(--space-32); }   /* 128px */
.section-sm     { padding-block: var(--space-16); }   /* 64px */
.section-xs     { padding-block: var(--space-12); }   /* 48px */

@media (max-width: 768px) {
  .section      { padding-block: var(--space-16); }   /* 64px */
  .section-lg   { padding-block: var(--space-20); }   /* 80px */
  .section-sm   { padding-block: var(--space-12); }   /* 48px */
}
```

### 5.4 Grid System

```css
/* Dua kolom — konten + visual */
.grid-2-visual {
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: var(--space-16);
  align-items: center;
}

/* Tiga kolom — feature card */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

/* Empat kolom — grid padat */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}

/* Auto-fit — responsive */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}

@media (max-width: 1024px) {
  .grid-2-visual { grid-template-columns: 1fr; gap: var(--space-12); }
  .grid-3        { grid-template-columns: 1fr 1fr; }
  .grid-4        { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  .grid-3, .grid-4 { grid-template-columns: 1fr; }
}
```

### 5.5 Visual Offset (Layout Asimetris)

Untuk menghindari layout yang terlalu template-like, gunakan offset ringan pada elemen visual:

```css
/* Mockup phone offset */
.mockup-offset-right {
  transform: translateX(32px) translateY(-16px);
}

.mockup-offset-left {
  transform: translateX(-32px) translateY(24px);
}

/* Grid visual slight asymmetry */
.grid-2-visual.offset-right > *:last-child {
  margin-block-start: 48px;
}

/* Card stagger (tidak sama tinggi semua) */
.card-stagger > *:nth-child(even) {
  margin-block-start: 24px;
}
```

---

## 6. Shape Language

### 6.1 Radius Tokens

```css
--radius-xs:   6px;
--radius-sm:   10px;
--radius-md:   14px;
--radius-lg:   20px;
--radius-xl:   28px;
--radius-2xl:  36px;
--radius-3xl:  48px;
--radius-pill: 9999px;
```

### 6.2 Panduan Radius per Komponen

```
Button (semua ukuran)   : pill (9999px)
Badge / tag             : pill (9999px)
Search bar              : pill (9999px)
Chip / category         : pill (9999px)
Floating CTA            : pill (9999px)
Floating Cart           : pill (9999px)
Navbar                  : pill (9999px)
Tooltip                 : sm (10px)
Input field             : md (14px)
Select / dropdown       : md (14px)
Small card              : lg (20px)
Feature card            : xl (28px)
Food card               : lg (20px)
Large card              : xl (28px)
Elevated / hero card    : 2xl (36px)
Phone mockup frame      : 3xl (48px)
Image wrapper           : xl (28px)
Large image block       : 2xl (36px)
Modal                   : 2xl (36px)
Toast                   : lg (20px)
Tab group wrapper       : lg (20px)
Table wrapper           : xl (28px)
```

**Aturan umum:** Elemen kecil = radius kecil. Elemen besar = radius besar. Jangan memakai radius flat (0–4px) kecuali untuk divider atau decorative rule tipis.

---

## 7. Elevation & Shadow

### 7.1 Shadow Tokens

```css
/* Surface shadows */
--shadow-xs:  0 1px 4px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03);
--shadow-sm:  0 4px 12px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(0, 0, 0, 0.05);
--shadow-md:  0 8px 20px rgba(0, 0, 0, 0.06), 0 16px 40px rgba(0, 0, 0, 0.07);
--shadow-lg:  0 16px 40px rgba(0, 0, 0, 0.09), 0 28px 64px rgba(0, 0, 0, 0.08);
--shadow-xl:  0 24px 64px rgba(0, 0, 0, 0.12), 0 40px 90px rgba(0, 0, 0, 0.10);

/* Floating / elevated */
--shadow-float:    0 18px 48px rgba(0, 0, 0, 0.18);
--shadow-floating: 0 24px 60px rgba(0, 0, 0, 0.22);

/* Brand */
--shadow-orange:   0 8px 24px rgba(255, 106, 0, 0.20), 0 16px 42px rgba(255, 106, 0, 0.14);
--shadow-orange-lg: 0 16px 48px rgba(255, 106, 0, 0.28), 0 28px 64px rgba(255, 106, 0, 0.16);
--shadow-dark:     0 16px 48px rgba(0, 0, 0, 0.28);

/* Inner (untuk pressed state) */
--shadow-inset:    inset 0 1px 3px rgba(0, 0, 0, 0.08);
```

### 7.2 Panduan Elevation per Komponen

```
Divider / hairline       : tidak ada shadow
Default card             : shadow-sm
Feature card             : shadow-md
Elevated card            : shadow-lg
Navbar (scrolled)        : shadow-xs → shadow-sm
Dropdown menu            : shadow-lg
Modal                    : shadow-xl
Phone mockup             : shadow-xl + shadow-dark
Floating CTA / FAB       : shadow-float
Floating cart            : shadow-floating
Primary button (oranye)  : shadow-orange
Dark button              : shadow-dark
```

### 7.3 Hover Elevation

Saat hover, elevasi meningkat satu level:

```css
.card-hover {
  transition: box-shadow 220ms ease, transform 220ms ease, border-color 220ms ease;
}

.card-hover:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.card-hover:active {
  box-shadow: var(--shadow-xs);
  transform: translateY(0) scale(0.99);
}
```

---

## 8. Glassmorphism

Hanya dipakai sebagai aksen — bukan sebagai style utama.

### 8.1 Glass Variants

```css
/* Light glass — navbar, floating card */
.glass-light {
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.70);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

/* Warm glass — floating element di atas background warm */
.glass-warm {
  background: rgba(255, 248, 240, 0.80);
  backdrop-filter: blur(22px) saturate(1.3);
  -webkit-backdrop-filter: blur(22px) saturate(1.3);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.07);
}

/* Orange tint glass — elemen di atas area oranye */
.glass-orange {
  background: rgba(255, 241, 232, 0.82);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 106, 0, 0.14);
  box-shadow: 0 8px 28px rgba(255, 106, 0, 0.10);
}

/* Dark glass — overlay di atas foto/dark section */
.glass-dark {
  background: rgba(9, 9, 9, 0.74);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.26);
  color: #FFFFFF;
}

/* Subtle glass — card secondary ringan */
.glass-subtle {
  background: rgba(255, 255, 255, 0.52);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.50);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}
```

### 8.2 Kapan Pakai Glass

**Pakai glass untuk:**
- Sticky navbar (glass-light)
- Floating cart / FAB
- Mini overlay card di atas foto makanan
- Price tag mengambang
- Tooltip / popover
- Category pill di atas hero image

**Jangan pakai glass untuk:**
- Semua card di satu halaman
- Background section utama
- Primary button
- Form input (gunakan white solid)

---

## 9. Background System

### 9.1 Background Tokens

```css
/* Page backgrounds */
--bg-page:         #FFFBF7;   /* Warm cream — default */
--bg-page-white:   #FFFFFF;   /* Pure white */
--bg-page-soft:    #FAFAFA;   /* Soft gray */

/* Section backgrounds */
--bg-section-warm: #FFF8F0;
--bg-section-gray: #F4F4F4;
--bg-section-cream: #FFFBF7;
--bg-section-dark:  #090909;
--bg-section-black: #0A0A0A;

/* Card backgrounds */
--bg-card:         #FFFFFF;
--bg-card-soft:    #FAFAFA;
--bg-card-warm:    #FFFBF7;
--bg-card-orange:  #FFF1E8;
```

### 9.2 Background Presets

```css
/* Default body */
body {
  background:
    radial-gradient(circle at 15% 10%, rgba(255, 106, 0, 0.07) 0%, transparent 30%),
    radial-gradient(circle at 88% 16%, rgba(255, 186, 120, 0.10) 0%, transparent 28%),
    radial-gradient(circle at 50% 80%, rgba(255, 240, 220, 0.12) 0%, transparent 36%),
    linear-gradient(180deg, var(--bg-page) 0%, #FFFFFF 50%, #FAFAFA 100%);
}

/* Hero dark — untuk halaman dengan hero gelap */
.bg-hero-dark {
  background:
    radial-gradient(circle at top left, rgba(255, 106, 0, 0.18) 0%, transparent 32%),
    radial-gradient(circle at bottom right, rgba(255, 140, 60, 0.12) 0%, transparent 28%),
    linear-gradient(135deg, #0A0A0A 0%, #171717 100%);
}

/* Section alternating */
.bg-section-alt {
  background:
    radial-gradient(circle at 90% 50%, rgba(255, 106, 0, 0.05) 0%, transparent 40%),
    var(--bg-section-warm);
}

/* Dark food section */
.bg-food-dark {
  background:
    linear-gradient(180deg, rgba(9, 9, 9, 0.60) 0%, rgba(9, 9, 9, 0.95) 100%),
    url('/textures/food-bg.jpg') center/cover no-repeat;
  color: #FFFFFF;
}
```

### 9.3 Noise Texture (Optional)

```css
.noise-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/noise.png');
  opacity: 0.025;
  pointer-events: none;
  z-index: 0;
}
```

### 9.4 Decorative Glow

```css
.glow-orange {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 106, 0, 0.14) 0%, transparent 65%);
  filter: blur(2px);
  pointer-events: none;
}

.glow-warm {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 200, 120, 0.16) 0%, transparent 65%);
  pointer-events: none;
}
```

---

## 10. Component: Button

### 10.1 Variants

```css
/* === PRIMARY === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-pill);
  font-family: var(--font-ui);
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  border: none;
  outline: none;
  text-decoration: none;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
  white-space: nowrap;
}

.btn-primary {
  background: var(--color-orange);
  color: #FFFFFF;
  box-shadow: var(--shadow-orange);
}

.btn-primary:hover {
  background: var(--color-orange-hover);
  box-shadow: var(--shadow-orange-lg);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0) scale(0.97);
  box-shadow: var(--shadow-orange);
}

/* === DARK === */
.btn-dark {
  background: var(--color-black);
  color: #FFFFFF;
  box-shadow: var(--shadow-dark);
}

.btn-dark:hover {
  background: var(--color-black-soft);
  transform: translateY(-2px);
}

/* === SECONDARY === */
.btn-secondary {
  background: #FFFFFF;
  color: var(--color-black);
  border: 1.5px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  border-color: var(--color-orange-border);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* === GHOST === */
.btn-ghost {
  background: transparent;
  color: var(--color-black);
  border: 1.5px solid var(--color-gray-200);
}

.btn-ghost:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-300);
}

/* === ORANGE OUTLINE === */
.btn-orange-outline {
  background: transparent;
  color: var(--color-orange);
  border: 1.5px solid var(--color-orange);
}

.btn-orange-outline:hover {
  background: var(--color-orange-soft);
}

/* === ORANGE SOFT === */
.btn-orange-soft {
  background: var(--color-orange-soft);
  color: var(--color-orange);
  border: none;
}

.btn-orange-soft:hover {
  background: var(--color-orange-faint);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
```

### 10.2 Sizes

```css
.btn-xs {
  height: 32px;
  padding-inline: 14px;
  font-size: 12px;
  gap: 6px;
}

.btn-sm {
  height: 40px;
  padding-inline: 18px;
  font-size: 14px;
}

.btn-md {             /* default */
  height: 48px;
  padding-inline: 22px;
  font-size: 15px;
}

.btn-lg {
  height: 56px;
  padding-inline: 28px;
  font-size: 16px;
}

.btn-xl {
  height: 64px;
  padding-inline: 36px;
  font-size: 18px;
}
```

### 10.3 States

```css
/* Disabled */
.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.42;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Loading */
.btn.loading {
  pointer-events: none;
  opacity: 0.80;
}

.btn.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 9999px;
  animation: spin 700ms linear infinite;
}
```

### 10.4 CTA Arrow Interaction

```css
.btn-arrow .arrow-icon {
  transition: transform 180ms ease;
}

.btn-arrow:hover .arrow-icon {
  transform: translateX(3px);
}
```

---

## 11. Component: Card

### 11.1 Base Card

```css
.card {
  background: var(--bg-card);
  border: 1px solid rgba(232, 232, 232, 0.85);
  border-radius: var(--radius-xl);   /* 28px */
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-elevated {
  background: var(--bg-card);
  border: 1px solid rgba(232, 232, 232, 0.70);
  border-radius: var(--radius-2xl);  /* 36px */
  box-shadow: var(--shadow-md);
}
```

### 11.2 Food Card

```css
.food-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);   /* 20px */
  padding: var(--space-4);           /* 16px */
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(232, 232, 232, 0.72);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.food-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-orange-border);
}

.food-card__image {
  border-radius: var(--radius-md);   /* 14px */
  aspect-ratio: 4/3;
  object-fit: cover;
  width: 100%;
}

.food-card__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-black);
  margin-block: var(--space-2);
  letter-spacing: -0.02em;
}

.food-card__price {
  color: var(--color-orange);
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -0.03em;
}

.food-card__restaurant {
  font-size: 12px;
  color: var(--color-gray-400);
}
```

### 11.3 Feature Card

```css
.feature-card {
  background: #FFFFFF;
  border-radius: var(--radius-2xl);  /* 36px */
  padding: var(--space-8);           /* 32px */
  border: 1px solid rgba(232, 232, 232, 0.80);
  box-shadow: var(--shadow-sm);
  transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-orange-border);
}

.feature-card.accent-orange {
  background: linear-gradient(135deg, #FFF1E8 0%, #FFFFFF 60%);
  border-color: rgba(255, 106, 0, 0.15);
}

.feature-card.accent-dark {
  background: linear-gradient(135deg, #171717 0%, #0A0A0A 100%);
  border-color: rgba(255, 255, 255, 0.06);
  color: #FFFFFF;
}
```

### 11.4 Stat Card

```css
.stat-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);   /* 28px */
  padding: var(--space-6);           /* 24px */
  border: 1px solid var(--color-gray-150);
  box-shadow: var(--shadow-xs);
}

.stat-card__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-gray-400);
  margin-bottom: var(--space-2);
}

.stat-card__value {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-black);
  letter-spacing: -0.04em;
  line-height: 1;
}

.stat-card__delta {
  font-size: 13px;
  font-weight: 600;
  margin-top: var(--space-2);
}

.stat-card__delta.up   { color: var(--color-success); }
.stat-card__delta.down { color: var(--color-danger); }
```

### 11.5 Testimonial Card

```css
.testimonial-card {
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  border: 1px solid rgba(232, 232, 232, 0.80);
  box-shadow: var(--shadow-sm);
  position: relative;
}

.testimonial-card::before {
  content: '\201C';
  position: absolute;
  top: 24px;
  left: 32px;
  font-size: 72px;
  line-height: 1;
  color: var(--color-orange);
  font-weight: 800;
  opacity: 0.25;
}
```

---

## 12. Component: Form

### 12.1 Input

```css
.input-base {
  display: block;
  width: 100%;
  height: 52px;
  padding-inline: var(--space-5);    /* 20px */
  border-radius: var(--radius-md);   /* 14px */
  background: #FFFFFF;
  border: 1.5px solid var(--color-gray-200);
  color: var(--color-black);
  font-size: 15px;
  font-weight: 500;
  font-family: var(--font-ui);
  transition: border-color 160ms ease, box-shadow 160ms ease;
  outline: none;
}

.input-base::placeholder {
  color: var(--color-gray-400);
  font-weight: 400;
}

.input-base:hover {
  border-color: var(--color-gray-300);
}

.input-base:focus {
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.12);
}

.input-base.error {
  border-color: var(--color-danger);
}

.input-base.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
}

.input-base:disabled {
  background: var(--color-gray-50);
  color: var(--color-gray-400);
  cursor: not-allowed;
}
```

### 12.2 Search Pill

```css
.search-pill {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 52px;
  padding-inline: var(--space-5);
  border-radius: var(--radius-pill);
  background: #FFFFFF;
  border: 1.5px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.search-pill:focus-within {
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.12), var(--shadow-md);
}

.search-pill input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-black);
}
```

### 12.3 Select & Dropdown

```css
.select-base {
  appearance: none;
  height: 52px;
  padding-inline: var(--space-5);
  padding-right: 44px;
  border-radius: var(--radius-md);
  background: #FFFFFF url("data:image/svg+xml,...") no-repeat right 16px center;
  border: 1.5px solid var(--color-gray-200);
  color: var(--color-black);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 160ms ease;
}

.select-base:focus {
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.12);
  outline: none;
}
```

### 12.4 Checkbox & Radio

```css
.checkbox,
.radio {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-300);
  border-radius: 6px;   /* checkbox */
  cursor: pointer;
  transition: background-color 160ms ease, border-color 160ms ease;
  position: relative;
  flex-shrink: 0;
}

.radio {
  border-radius: 9999px;
}

.checkbox:checked,
.radio:checked {
  background: var(--color-orange);
  border-color: var(--color-orange);
}

.checkbox:checked::after {
  content: '';
  position: absolute;
  inset: 3px 2px;
  background: url("data:image/svg+xml,...") center/contain no-repeat;
}
```

### 12.5 Toggle Switch

```css
.toggle {
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: 9999px;
  background: var(--color-gray-200);
  cursor: pointer;
  transition: background-color 200ms ease;
  flex-shrink: 0;
}

.toggle.on {
  background: var(--color-orange);
}

.toggle__thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background: #FFFFFF;
  box-shadow: var(--shadow-sm);
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.toggle.on .toggle__thumb {
  transform: translateX(24px);
}
```

### 12.6 Form Group

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-gray-700);
  letter-spacing: -0.01em;
}

.form-hint {
  font-size: 13px;
  color: var(--color-gray-400);
}

.form-error {
  font-size: 13px;
  color: var(--color-danger);
  display: flex;
  align-items: center;
  gap: 6px;
}
```

---

## 13. Component: Navigation

### 13.1 Floating Navbar (Marketing)

```css
.navbar {
  position: sticky;
  top: 16px;
  z-index: 100;
  margin-inline: auto;
  width: min(1120px, calc(100% - 32px));
  height: 66px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid rgba(232, 232, 232, 0.72);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  padding-inline: var(--space-6);
  transition: box-shadow 300ms ease, background-color 300ms ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--shadow-md);
}

.navbar__logo {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-black);
  letter-spacing: -0.04em;
  text-decoration: none;
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-left: auto;
  margin-right: auto;
}

.navbar__link {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-600);
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  text-decoration: none;
  transition: color 160ms ease, background-color 160ms ease;
}

.navbar__link:hover {
  color: var(--color-black);
  background: var(--color-gray-100);
}

.navbar__link.active {
  color: var(--color-orange);
  background: var(--color-orange-soft);
}

.navbar__cta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
```

### 13.2 Dashboard Sidebar

```css
.sidebar {
  width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: #FFFFFF;
  border-right: 1px solid var(--color-gray-150);
  padding: var(--space-6) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 44px;
  padding-inline: var(--space-4);
  border-radius: var(--radius-lg);   /* 20px */
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-600);
  text-decoration: none;
  transition: color 160ms ease, background-color 160ms ease;
}

.sidebar__item:hover {
  color: var(--color-black);
  background: var(--color-gray-100);
}

.sidebar__item.active {
  color: var(--color-orange);
  background: var(--color-orange-soft);
  font-weight: 700;
}

.sidebar__item.active .sidebar__icon {
  color: var(--color-orange);
}
```

### 13.3 Tab Group

```css
.tab-group {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--color-gray-100);
  border-radius: var(--radius-pill);
  padding: 4px;
}

.tab-item {
  height: 36px;
  padding-inline: 18px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-500);
  cursor: pointer;
  transition: color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
  border: none;
  background: transparent;
}

.tab-item:hover {
  color: var(--color-gray-700);
}

.tab-item.active {
  color: var(--color-black);
  background: #FFFFFF;
  box-shadow: var(--shadow-sm);
}
```

### 13.4 Breadcrumb

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 13px;
  color: var(--color-gray-400);
}

.breadcrumb__item {
  color: var(--color-gray-400);
  text-decoration: none;
  transition: color 160ms ease;
}

.breadcrumb__item:hover {
  color: var(--color-black);
}

.breadcrumb__item.current {
  color: var(--color-black);
  font-weight: 600;
}

.breadcrumb__separator {
  color: var(--color-gray-300);
  font-size: 12px;
}
```

---

## 14. Component: Badge & Tag

```css
/* Base badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

/* Sizes */
.badge-sm { height: 20px; padding-inline: 8px;  font-size: 11px; }
.badge-md { height: 24px; padding-inline: 10px; font-size: 12px; }
.badge-lg { height: 28px; padding-inline: 12px; font-size: 13px; }

/* Variants */
.badge-orange  { background: var(--color-orange-soft);  color: var(--color-orange); }
.badge-success { background: var(--color-success-soft);  color: var(--color-success); }
.badge-danger  { background: var(--color-danger-soft);   color: var(--color-danger); }
.badge-warning { background: var(--color-warning-soft);  color: var(--color-warning); }
.badge-info    { background: var(--color-info-soft);     color: var(--color-info); }
.badge-neutral { background: var(--color-gray-100);      color: var(--color-gray-700); }
.badge-dark    { background: var(--color-black);          color: #FFFFFF; }

/* Dot indicator */
.badge-dot::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: currentColor;
  flex-shrink: 0;
}

/* Category chip */
.category-chip {
  height: 36px;
  padding-inline: 16px;
  border-radius: var(--radius-pill);
  background: #FFFFFF;
  border: 1px solid var(--color-gray-200);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-gray-700);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  transition: all 160ms ease;
}

.category-chip:hover {
  border-color: var(--color-orange-border);
  color: var(--color-orange);
}

.category-chip.active {
  background: var(--color-orange);
  border-color: var(--color-orange);
  color: #FFFFFF;
  box-shadow: var(--shadow-orange);
}
```

---

## 15. Component: Modal & Overlay

```css
/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(9, 9, 9, 0.48);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

/* Modal container */
.modal {
  background: #FFFFFF;
  border-radius: var(--radius-2xl);  /* 36px */
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  padding: var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--color-gray-150);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body {
  padding: var(--space-8);
}

.modal-footer {
  padding: var(--space-6) var(--space-8);
  border-top: 1px solid var(--color-gray-150);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

/* Drawer (mobile bottom sheet) */
.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.16);
  max-height: 90vh;
  overflow-y: auto;
  z-index: 200;
  padding-bottom: env(safe-area-inset-bottom);
}

.drawer__handle {
  width: 40px;
  height: 4px;
  border-radius: 9999px;
  background: var(--color-gray-200);
  margin: 12px auto 0;
}
```

---

## 16. Component: Toast & Alert

```css
/* Toast */
.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 300px;
  max-width: 420px;
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);   /* 20px */
  background: var(--color-black);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  box-shadow: var(--shadow-floating);
  animation: toastIn 360ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes toastIn {
  from { transform: translateY(20px) scale(0.95); opacity: 0; }
  to   { transform: translateY(0) scale(1);       opacity: 1; }
}

/* Alert inline */
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  border: 1px solid;
  font-size: 14px;
}

.alert-success { background: var(--color-success-soft); border-color: var(--color-success-border); color: var(--color-success); }
.alert-danger  { background: var(--color-danger-soft);  border-color: var(--color-danger-border);  color: var(--color-danger); }
.alert-warning { background: var(--color-warning-soft); border-color: var(--color-warning-border); color: var(--color-warning); }
.alert-info    { background: var(--color-info-soft);    border-color: var(--color-info-border);    color: var(--color-info); }
.alert-orange  { background: var(--color-orange-soft);  border-color: var(--color-orange-border);  color: var(--color-orange); }
```

---

## 17. Component: Table

```css
.table-wrapper {
  border-radius: var(--radius-xl);   /* 28px */
  border: 1px solid var(--color-gray-150);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table thead {
  background: var(--color-gray-50);
}

.table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-gray-500);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--color-gray-150);
  white-space: nowrap;
}

.table td {
  padding: 16px 20px;
  color: var(--color-gray-700);
  border-bottom: 1px solid rgba(232, 232, 232, 0.60);
  vertical-align: middle;
}

.table tbody tr {
  transition: background-color 120ms ease;
}

.table tbody tr:hover {
  background: var(--color-gray-50);
}

.table tbody tr:last-child td {
  border-bottom: none;
}
```

---

## 18. Component: Loading & Skeleton

### Skeleton

```css
@keyframes skeleton-wave {
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
}

.skeleton {
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    var(--color-gray-100) 25%,
    var(--color-gray-50)  50%,
    var(--color-gray-100) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-wave 1.5s ease-in-out infinite;
}

.skeleton-text   { height: 16px; border-radius: var(--radius-xs); }
.skeleton-title  { height: 24px; border-radius: var(--radius-xs); }
.skeleton-image  { border-radius: var(--radius-lg); }
.skeleton-avatar { border-radius: var(--radius-pill); }
```

### Spinner

```css
@keyframes spin { to { transform: rotate(360deg); } }

.spinner {
  width: 24px;
  height: 24px;
  border: 2.5px solid var(--color-gray-200);
  border-top-color: var(--color-orange);
  border-radius: 9999px;
  animation: spin 700ms linear infinite;
}

.spinner-sm { width: 16px; height: 16px; border-width: 2px; }
.spinner-lg { width: 36px; height: 36px; border-width: 3px; }
```

---

## 19. Mobile Mockup

### 19.1 Phone Frame

```css
.phone-frame {
  width: 300px;
  border-radius: 48px;
  padding: 10px;
  background: linear-gradient(180deg, #1E1E1E 0%, #080808 100%);
  box-shadow:
    0 40px 100px rgba(0, 0, 0, 0.30),
    0 0 0 1px rgba(255, 255, 255, 0.06) inset,
    0 1px 0 rgba(255, 255, 255, 0.12) inset;
  position: relative;
}

.phone-frame::before {
  content: '';
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 30px;
  background: #080808;
  border-radius: 0 0 18px 18px;
  z-index: 5;
}

.phone-screen {
  border-radius: 40px;
  overflow: hidden;
  background: #FFFFFF;
  position: relative;
}
```

### 19.2 Mockup Layering

```css
.mockup-group {
  position: relative;
  width: 380px;
}

.phone-main {
  position: relative;
  z-index: 3;
  animation: floatSoft 7s ease-in-out infinite;
}

.phone-secondary-left {
  position: absolute;
  z-index: 2;
  left: -60px;
  bottom: -20px;
  transform: rotate(-6deg) scale(0.88);
  opacity: 0.85;
  animation: floatSoft 8s ease-in-out infinite 1s;
}

.phone-secondary-right {
  position: absolute;
  z-index: 1;
  right: -48px;
  top: 24px;
  transform: rotate(5deg) scale(0.85);
  opacity: 0.75;
  animation: floatSoft 9s ease-in-out infinite 0.5s;
}
```

### 19.3 Glow Background

```css
.mockup-glow {
  position: absolute;
  inset: -20%;
  background: radial-gradient(
    circle at 50% 60%,
    rgba(255, 106, 0, 0.15) 0%,
    rgba(255, 160, 60, 0.08) 35%,
    transparent 65%
  );
  filter: blur(6px);
  pointer-events: none;
  z-index: 0;
}
```

---

## 20. Image Style

### 20.1 Food Image Rules

- Foto makanan nyata, warm lighting, close-up textural
- Warna vivid tapi tidak over-saturated atau HDR berlebihan
- Background gelap untuk kontras (seperti halaman detail app)
- Jangan foto studio dengan latar putih steril
- Jangan gambar AI yang glossy atau terlalu sempurna
- Crop 4:3 atau 1:1 untuk card; 16:9 untuk banner

### 20.2 Image Treatment

```css
.img-food-card {
  border-radius: var(--radius-lg);   /* 20px */
  object-fit: cover;
  aspect-ratio: 4/3;
  box-shadow: var(--shadow-sm);
  transition: transform 360ms ease;
}

.img-food-card:hover {
  transform: scale(1.03);
}

.img-food-hero {
  border-radius: var(--radius-2xl);  /* 36px */
  object-fit: cover;
  box-shadow: var(--shadow-lg);
}

.img-food-circle {
  border-radius: var(--radius-pill);
  object-fit: cover;
  box-shadow: var(--shadow-md);
}

/* Overlay gradient untuk legibility */
.img-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    180deg,
    transparent 40%,
    rgba(9, 9, 9, 0.72) 100%
  );
}
```

### 20.3 Dark Food Panel

```css
.food-panel-dark {
  border-radius: var(--radius-2xl);
  overflow: hidden;
  position: relative;
  background: #0A0A0A;
  color: #FFFFFF;
}

.food-panel-dark .bg-layer {
  position: absolute;
  inset: 0;
  background-image: url('/food-texture.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.35;
}

.food-panel-dark .content-layer {
  position: relative;
  z-index: 1;
  padding: var(--space-8);
}
```

---

## 21. Icon System

### 21.1 Pilihan Icon Library

Gunakan salah satu, jangan campur:
- **Lucide** — rekomendasi utama (clean, modern, konsisten)
- **Phosphor** — alternatif dengan lebih banyak weight
- **Heroicons** — alternatif Tailwind-friendly

### 21.2 Spesifikasi

```
Stroke width : 1.75px (default Lucide)
Shape        : rounded cap, rounded join
Size default : 20px
Size small   : 16px
Size large   : 24px
Container    : circular atau pill
Style        : outline / line (bukan filled)
```

### 21.3 Icon Containers

```css
/* Orange bubble */
.icon-bubble-orange {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-pill);
  background: var(--color-orange-soft);
  color: var(--color-orange);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* White bubble */
.icon-bubble-white {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-pill);
  background: #FFFFFF;
  color: var(--color-gray-700);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-150);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Dark bubble */
.icon-bubble-dark {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-pill);
  background: var(--color-black);
  color: #FFFFFF;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Sizes */
.icon-bubble-sm { width: 36px; height: 36px; }
.icon-bubble-lg { width: 60px; height: 60px; }
.icon-bubble-xl { width: 72px; height: 72px; }
```

### 21.4 Category Bubble (App-style)

```css
.category-bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  transition: transform 180ms ease;
}

.category-bubble:hover {
  transform: scale(1.05);
}

.category-bubble__icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-pill);
  background: #FFFFFF;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-150);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.category-bubble__label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-gray-700);
  text-align: center;
}
```

---

## 22. Animation & Motion

### 22.1 Easing Tokens

```css
--ease-out:       cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-soft:  cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out:    cubic-bezier(0.45, 0, 0.55, 1);
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);  /* subtle spring */
```

### 22.2 Duration Tokens

```css
--duration-instant:  80ms;
--duration-fast:     160ms;
--duration-base:     240ms;
--duration-slow:     400ms;
--duration-slower:   600ms;
--duration-slowest:  800ms;
```

### 22.3 Reveal Animations

```css
/* Fade up — elemen konten */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.anim-fade-up {
  animation: fadeUp var(--duration-slower) var(--ease-out) both;
}

/* Fade in — overlay, modal */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.anim-fade-in {
  animation: fadeIn var(--duration-base) var(--ease-out) both;
}

/* Scale in — card, popup */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}

.anim-scale-in {
  animation: scaleIn var(--duration-slow) var(--ease-out-soft) both;
}

/* Slide up — modal, drawer */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

.anim-slide-up {
  animation: slideUp var(--duration-slow) var(--ease-out) both;
}
```

### 22.4 Stagger (Intersection Observer)

```js
// Stagger antar card: 80ms
const cards = document.querySelectorAll('.feature-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${i * 80}ms`;
      entry.target.classList.add('anim-fade-up');
    }
  });
}, { threshold: 0.1 });

cards.forEach(card => observer.observe(card));
```

### 22.5 Continuous Animations

```css
/* Float — mockup phone */
@keyframes floatSoft {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}

.float-soft {
  animation: floatSoft 7s ease-in-out infinite;
}

/* Pulse — CTA button, live indicator */
@keyframes pulseSoft {
  0%    { transform: scale(0.88); opacity: 0.7; }
  100%  { transform: scale(1.40); opacity: 0; }
}

.pulse-ring {
  position: absolute;
  inset: -6px;
  border-radius: inherit;
  background: rgba(255, 106, 0, 0.22);
  animation: pulseSoft 2.4s ease-out infinite;
  z-index: -1;
}

/* Spin — loading */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Marquee — logo scroller */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 24s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}
```

### 22.6 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 23. Micro Interaction

### 23.1 Interaktivitas per Elemen

| Elemen              | Hover                        | Active / Pressed             |
|---------------------|------------------------------|------------------------------|
| Primary button      | translateY(-2px), shadow+    | scale(0.97), shadow-          |
| Secondary button    | translateY(-1px), border+    | scale(0.98)                  |
| Feature card        | translateY(-5px), shadow++   | translateY(-2px)             |
| Food card           | translateY(-4px), orange border | scale(0.98)               |
| Category bubble     | scale(1.06)                  | scale(0.96)                  |
| Sidebar item        | bg gray-100                  | bg orange-soft               |
| Tab item            | color darker                 | bg white + shadow            |
| Icon button         | bg soft, scale(1.05)         | scale(0.92)                  |
| CTA arrow           | arrow translateX(3px)        | —                            |
| Link                | underline color orange       | —                            |
| Image card          | inner image scale(1.03)      | —                            |

### 23.2 Navbar on Scroll

```js
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
}, { passive: true });
```

---

## 24. Responsive System

### 24.1 Breakpoints

```css
/* Breakpoints */
--bp-xs:  375px;   /* Small mobile */
--bp-sm:  480px;   /* Large mobile */
--bp-md:  768px;   /* Tablet */
--bp-lg:  1024px;  /* Small desktop */
--bp-xl:  1280px;  /* Desktop */
--bp-2xl: 1536px;  /* Large desktop */
```

```css
/* Media query helpers */
@custom-media --mobile   (max-width: 767px);
@custom-media --tablet   (min-width: 768px) and (max-width: 1023px);
@custom-media --desktop  (min-width: 1024px);
@custom-media --touch    (hover: none) and (pointer: coarse);
```

### 24.2 Mobile Rules

- Padding horizontal minimum: 20px (preferably 24px)
- Button full-width di viewport sempit jika merupakan CTA utama
- Grid selalu turun jadi 1 kolom di bawah 640px
- Mockup: satu phone saja, tidak overlapping
- Navbar mobile: logo + hamburger (tanpa nav link)
- Font display: dikurangi tapi tetap bold
- Shadow: dikurangi satu level (md → sm)

### 24.3 Mobile Typography Override

```css
@media (max-width: 767px) {
  .type-display-2xl { font-size: 52px; line-height: 0.94; letter-spacing: -0.048em; }
  .type-display-xl  { font-size: 44px; line-height: 0.96; letter-spacing: -0.044em; }
  .type-display-lg  { font-size: 38px; line-height: 0.98; letter-spacing: -0.040em; }
  .type-h1          { font-size: 30px; line-height: 1.05; }
  .type-h2          { font-size: 26px; line-height: 1.08; }
  .type-h3          { font-size: 22px; line-height: 1.12; }
  .type-body-xl     { font-size: 17px; line-height: 1.65; }
  .type-body-lg     { font-size: 16px; line-height: 1.65; }
}
```

---

## 25. Page-Specific Style

### 25.1 Landing Page (Marketing)

- Hero: display-2xl atau display-xl, oranye aksen pada kata kunci
- Background: warm radial gradient
- Mockup: satu atau dua phone, floating, glow orange di belakang
- Section 1 (hero): putih/cream, vertical center
- Section 2 (features): alternating putih ↔ soft gray
- Section 3 (social proof): dark section atau orange strip
- CTA bottom: dark background dengan CTA oranye besar

### 25.2 Dashboard Merchant

- Background: gray-50 halaman, white card
- Sidebar: white, sticky, 260px
- Header: sticky, putih, tinggi 64px
- Data: tabel dengan radius 28px, shadow-xs
- Chart: clean, oranye sebagai warna utama data
- Padding konten: 32px
- Font size rata-rata lebih kecil: 14px base

### 25.3 Halaman Produk / Fitur

- Hero: medium (display-lg), dengan screenshot atau ilustrasi
- Features: grid 3 kolom, feature card elevated
- Before/after: split visual atau tab comparison
- FAQ: accordion, border-bottom, no card wrapper

### 25.4 Onboarding / Checkout

- Maksimal satu aksi per layar
- Progress indicator di atas (step bar)
- Form input besar (height: 56px)
- Background: cream atau white
- Tombol CTA selalu di bawah, full-width di mobile

### 25.5 Error & Empty State

```css
.empty-state {
  text-align: center;
  padding: var(--space-20) var(--space-6);
  max-width: 420px;
  margin-inline: auto;
}

.empty-state__icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-pill);
  background: var(--color-orange-soft);
  color: var(--color-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
}

.empty-state__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-black);
  letter-spacing: -0.03em;
  margin-bottom: var(--space-3);
}

.empty-state__body {
  font-size: 15px;
  color: var(--color-gray-500);
  line-height: 1.65;
  margin-bottom: var(--space-6);
}
```

---

## 26. Dark Mode

Dark mode adalah opsional — Santap tidak wajib punya dark mode, tetapi jika diimplementasikan, gunakan token berikut:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-page:          #0A0A0A;
    --bg-section-warm:  #111111;
    --bg-card:          #1A1A1A;
    --bg-card-soft:     #141414;
    
    --color-black:      #F5F5F5;
    --color-gray-700:   #A8A8A8;
    --color-gray-500:   #888888;
    --color-gray-400:   #666666;
    --color-gray-300:   #3A3A3A;
    --color-gray-200:   #2A2A2A;
    --color-gray-150:   #242424;
    --color-gray-100:   #1E1E1E;
    --color-gray-50:    #181818;

    /* Orange tetap sama */
    --color-orange:        #FF6A00;
    --color-orange-soft:   rgba(255, 106, 0, 0.15);
    --color-orange-faint:  rgba(255, 106, 0, 0.08);
    --color-orange-border: rgba(255, 106, 0, 0.25);

    /* Shadow lebih kuat di dark */
    --shadow-sm:  0 4px 16px rgba(0, 0, 0, 0.24);
    --shadow-md:  0 8px 28px rgba(0, 0, 0, 0.32);
    --shadow-lg:  0 16px 48px rgba(0, 0, 0, 0.40);
  }
}
```

---

## 27. Accessibility

### 27.1 Color Contrast

- Text body (#737373) di atas putih: ratio 4.7:1 ✓ (WCAG AA)
- Text heading (#090909) di atas putih: ratio 19.7:1 ✓
- Oranye (#FF6A00) sebagai teks di atas putih: tidak direkomendasikan (ratio 3.1:1 — hanya untuk dekoratif / badge dengan bg orange-soft)
- Putih di atas oranye (#FF6A00): ratio 3.4:1 — gunakan hanya untuk button, bukan teks panjang

### 27.2 Focus State

```css
:focus-visible {
  outline: 2.5px solid var(--color-orange);
  outline-offset: 3px;
  border-radius: inherit;
}

/* Override untuk pill-shaped */
.btn:focus-visible,
.navbar__link:focus-visible {
  outline-offset: 4px;
}
```

### 27.3 Minimum Touch Target

```
Minimum tap target : 44px × 44px
Button minimum     : height 40px, width 80px
Icon button minimum: 40px × 40px (dengan padding)
```

### 27.4 ARIA & Semantic HTML

- Gunakan `<button>` untuk aksi, `<a>` untuk navigasi
- Navbar: `role="navigation"`, `aria-label="Main navigation"`
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Loading: `aria-live="polite"` untuk status update
- Alert: `role="alert"` untuk pesan penting

---

## 28. CSS Custom Properties — Full Reference

```css
:root {
  /* === COLORS === */
  --color-orange:        #FF6A00;
  --color-orange-hover:  #E85F00;
  --color-orange-active: #D45600;
  --color-orange-soft:   #FFF1E8;
  --color-orange-faint:  #FFF7F1;
  --color-orange-border: rgba(255, 106, 0, 0.20);
  --color-orange-shadow: rgba(255, 106, 0, 0.24);
  
  --color-black:         #090909;
  --color-black-soft:    #171717;
  --color-black-medium:  #222222;
  --color-white:         #FFFFFF;
  --color-cream:         #FFFBF7;
  --color-warm:          #FFF8F0;

  --color-gray-950:  #0F0F0F;
  --color-gray-900:  #1F1F1F;
  --color-gray-800:  #2E2E2E;
  --color-gray-700:  #3F3F3F;
  --color-gray-600:  #525252;
  --color-gray-500:  #737373;
  --color-gray-400:  #A3A3A3;
  --color-gray-300:  #D4D4D4;
  --color-gray-200:  #E8E8E8;
  --color-gray-150:  #F0F0F0;
  --color-gray-100:  #F4F4F4;
  --color-gray-50:   #FAFAFA;

  --color-success:        #16A34A;
  --color-success-soft:   #F0FDF4;
  --color-success-border: rgba(22, 163, 74, 0.20);
  --color-warning:        #D97706;
  --color-warning-soft:   #FFFBEB;
  --color-warning-border: rgba(217, 119, 6, 0.20);
  --color-danger:         #DC2626;
  --color-danger-soft:    #FEF2F2;
  --color-danger-border:  rgba(220, 38, 38, 0.20);
  --color-info:           #2563EB;
  --color-info-soft:      #EFF6FF;
  --color-info-border:    rgba(37, 99, 235, 0.20);

  /* === BACKGROUNDS === */
  --bg-page:          #FFFBF7;
  --bg-page-white:    #FFFFFF;
  --bg-page-soft:     #FAFAFA;
  --bg-section-warm:  #FFF8F0;
  --bg-section-gray:  #F4F4F4;
  --bg-card:          #FFFFFF;
  --bg-card-soft:     #FAFAFA;
  --bg-card-warm:     #FFFBF7;
  --bg-card-orange:   #FFF1E8;

  /* === TYPOGRAPHY === */
  --font-display: 'Plus Jakarta Sans', 'Satoshi', system-ui, sans-serif;
  --font-body:    'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  --font-ui:      'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  /* === SPACING === */
  --space-1:  4px;   --space-2:  8px;   --space-3:  12px;
  --space-4:  16px;  --space-5:  20px;  --space-6:  24px;
  --space-8:  32px;  --space-10: 40px;  --space-12: 48px;
  --space-16: 64px;  --space-20: 80px;  --space-24: 96px;
  --space-32: 128px; --space-40: 160px;

  /* === RADIUS === */
  --radius-xs:   6px;    --radius-sm:   10px;
  --radius-md:   14px;   --radius-lg:   20px;
  --radius-xl:   28px;   --radius-2xl:  36px;
  --radius-3xl:  48px;   --radius-pill: 9999px;

  /* === SHADOWS === */
  --shadow-xs:       0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03);
  --shadow-sm:       0 4px 12px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.05);
  --shadow-md:       0 8px 20px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.07);
  --shadow-lg:       0 16px 40px rgba(0,0,0,0.09), 0 28px 64px rgba(0,0,0,0.08);
  --shadow-xl:       0 24px 64px rgba(0,0,0,0.12), 0 40px 90px rgba(0,0,0,0.10);
  --shadow-float:    0 18px 48px rgba(0,0,0,0.18);
  --shadow-floating: 0 24px 60px rgba(0,0,0,0.22);
  --shadow-orange:   0 8px 24px rgba(255,106,0,0.20), 0 16px 42px rgba(255,106,0,0.14);
  --shadow-orange-lg: 0 16px 48px rgba(255,106,0,0.28), 0 28px 64px rgba(255,106,0,0.16);
  --shadow-dark:     0 16px 48px rgba(0,0,0,0.28);
  --shadow-inset:    inset 0 1px 3px rgba(0,0,0,0.08);

  /* === MOTION === */
  --ease-out:       cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-soft:  cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out:    cubic-bezier(0.45, 0, 0.55, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);

  --duration-instant: 80ms;
  --duration-fast:    160ms;
  --duration-base:    240ms;
  --duration-slow:    400ms;
  --duration-slower:  600ms;
  --duration-slowest: 800ms;
}
```

---

## 29. Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{tsx,ts,jsx,js,html}'],
  theme: {
    extend: {
      colors: {
        santap: {
          orange:       '#FF6A00',
          'orange-hover':  '#E85F00',
          'orange-active': '#D45600',
          'orange-soft':   '#FFF1E8',
          'orange-faint':  '#FFF7F1',
          black:        '#090909',
          'black-soft':    '#171717',
          white:        '#FFFFFF',
          cream:        '#FFFBF7',
          warm:         '#FFF8F0',
          gray: {
            50:  '#FAFAFA', 100: '#F4F4F4', 150: '#F0F0F0',
            200: '#E8E8E8', 300: '#D4D4D4', 400: '#A3A3A3',
            500: '#737373', 600: '#525252', 700: '#3F3F3F',
            800: '#2E2E2E', 900: '#1F1F1F', 950: '#0F0F0F',
          },
        },
        food: {
          green:  '#22C55E',
          red:    '#EF4444',
          yellow: '#FBBF24',
          brown:  '#8B5E34',
          purple: '#A855F7',
          teal:   '#14B8A6',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Satoshi', 'system-ui', 'sans-serif'],
        body:    ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        ui:      ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xs:   '6px',  sm:   '10px', md:   '14px',
        lg:   '20px', xl:   '28px', '2xl': '36px',
        '3xl': '48px', pill: '9999px',
      },
      boxShadow: {
        xs:       '0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)',
        sm:       '0 4px 12px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.05)',
        md:       '0 8px 20px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.07)',
        lg:       '0 16px 40px rgba(0,0,0,0.09), 0 28px 64px rgba(0,0,0,0.08)',
        xl:       '0 24px 64px rgba(0,0,0,0.12), 0 40px 90px rgba(0,0,0,0.10)',
        float:    '0 18px 48px rgba(0,0,0,0.18)',
        floating: '0 24px 60px rgba(0,0,0,0.22)',
        orange:   '0 8px 24px rgba(255,106,0,0.20), 0 16px 42px rgba(255,106,0,0.14)',
        'orange-lg': '0 16px 48px rgba(255,106,0,0.28), 0 28px 64px rgba(255,106,0,0.16)',
        dark:     '0 16px 48px rgba(0,0,0,0.28)',
      },
      spacing: {
        1:  '4px',  2:  '8px',  3:  '12px',
        4:  '16px', 5:  '20px', 6:  '24px',
        8:  '32px', 10: '40px', 12: '48px',
        16: '64px', 20: '80px', 24: '96px',
        32: '128px', 40: '160px',
      },
      transitionTimingFunction: {
        'out':       'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-soft':  'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out':    'cubic-bezier(0.45, 0, 0.55, 1)',
        'spring':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        instant: '80ms',
        fast:    '160ms',
        base:    '240ms',
        slow:    '400ms',
        slower:  '600ms',
        slowest: '800ms',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 30. Do & Don't

### ✅ DO

- Gunakan whitespace besar — lebih baik terlalu lapang dari terlalu padat
- Pakai oranye hanya untuk CTA, harga, dan elemen yang butuh perhatian
- Tampilkan mockup mobile sebagai visual hero utama
- Gunakan foto makanan natural dengan pencahayaan warm
- Pertahankan radius pill pada semua button dan badge
- Gunakan shadow lembut — opacity rendah, spread lebar
- Pastikan typography hierarchy jelas: display → heading → body → label
- Buat animasi halus dan singkat (maks 600ms untuk reveal)
- Uji semua komponen di mobile (375px) sebelum desktop
- Gunakan glass effect hanya pada navbar, floating element, dan overlay ringan

### ❌ DON'T

- Jangan dominan ungu, biru, atau warna neon
- Jangan pakai gradient mesh agresif atau gradient berwarna-warni
- Jangan buat semua elemen glassmorphism
- Jangan jejalkan terlalu banyak elemen dalam satu card
- Jangan pakai animasi dramatis (bounce, shake, flip)
- Jangan gunakan lebih dari 3 warna aksen berbeda dalam satu section
- Jangan buat layout yang terlalu simetris dan uniform — terasa template
- Jangan pakai ilustrasi AI generik atau clipart
- Jangan terlalu banyak mikro-animasi (pilih mana yang penting saja)
- Jangan menempatkan teks penting di atas foto tanpa overlay
- Jangan pakai font selain yang ditentukan — konsistensi tipografi krusial
- Jangan membuat halaman yang terlalu mirip SaaS dashboard untuk halaman marketing

---

## Appendix A: Elemen App-Specific

### Floating Cart (dari app)

```css
.floating-cart {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  height: 60px;
  min-width: 220px;
  border-radius: var(--radius-pill);
  background: var(--color-black);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  padding-inline: var(--space-4) var(--space-5);
  gap: var(--space-3);
  box-shadow: var(--shadow-floating);
  z-index: 99;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.floating-cart:hover {
  transform: translateX(-50%) translateY(-3px);
  box-shadow: 0 28px 70px rgba(0,0,0,0.28);
}

.floating-cart__dot {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-pill);
  background: var(--color-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #FFFFFF;
}

.floating-cart__info {
  flex: 1;
  min-width: 0;
}

.floating-cart__count {
  font-size: 12px;
  color: rgba(255,255,255,0.60);
}

.floating-cart__total {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #FFFFFF;
}
```

### QR Code Visual (placeholder)

```css
.qr-visual {
  width: 140px;
  height: 140px;
  border-radius: var(--radius-lg);
  background: #FFFFFF;
  padding: 12px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-150);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

> **Versi:** 2.0 · **Berlaku untuk:** santap.id, merchant.santap.id, docs.santap.id  
> **Diperbarui:** setiap ada perubahan design system signifikan