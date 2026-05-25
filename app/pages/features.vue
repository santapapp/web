<template>
  <main>

    <!-- ── HERO — Curtain Reveal ──────────────────────────── -->
    <AppPageHeroCurtain
      badge="Fitur Santap"
      line1="Semua Fitur"
      line2="Kasir Modern."
      aria-label="Fitur Santap"
      scroll-target="features-content"
    >
      Dari pencatatan pesanan hingga laporan keuangan harian —
      <span style="color: var(--color-text-primary); font-weight: 500;">Santap menyederhanakan operasional restoran</span> dalam satu aplikasi.
    </AppPageHeroCurtain>

    <!-- ══════════════════════════════════════════════════════
         IMMERSIVE DARK SECTION — food image + large white text overlay
         ══════════════════════════════════════════════════════ -->
    <section
      id="features-content"
      class="relative mx-3 my-6 md:mx-5 rounded-2xl overflow-hidden"
      style="min-height: 55vh; display: flex; flex-direction: column; justify-content: center;"
      aria-label="Gambaran Platform"
    >
      <!-- Background image -->
      <img
        src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1800&q=80&fit=crop"
        alt="Dapur restoran sibuk"
        class="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />
      <!-- Dark overlay -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to bottom right, rgba(8,6,4,0.72) 0%, rgba(8,6,4,0.55) 50%, rgba(8,6,4,0.80) 100%);"
      ></div>

      <!-- Content -->
      <div class="relative z-10 px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto py-20 md:py-28 w-full">
        <!-- Badge -->
        <div class="mb-10">
          <div
            class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
            style="background-color: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15);"
          >
            <div class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background-color: var(--color-primary);"></div>
            <span class="text-[10px] font-bold uppercase tracking-[0.18em]" style="color: rgba(255,255,255,0.75);">Platform Overview</span>
          </div>
        </div>

        <!-- Large descriptive text -->
        <AppTextWordReveal
          class="font-medium leading-[1.12] tracking-tight max-w-[950px]"
          style="font-size: clamp(26px, 4vw, 52px); color: #FFFFFF;"
          text="Platform kami memungkinkan pencatatan pesanan, pembayaran multi-metode, dan pelaporan real-time yang, digabungkan dengan antarmuka intuitif, membuka kendali penuh atas operasional restoran dari satu aplikasi."
        />
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         FEATURE CATEGORIES — clean horizontal row layout
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] py-12 md:py-20"
      aria-label="Kategori Fitur"
    >
      <div
        v-for="(category, ci) in categories"
        :key="category.id"
        class="px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto"
      >
        <!-- Section Divider -->
        <div class="h-px bg-[var(--color-border)]"></div>

        <!-- Category Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 py-20 md:py-28">
          
          <!-- Left: Category info (cols 1-4) -->
          <div class="lg:col-span-4 lg:sticky lg:top-28">
            <div class="flex items-baseline gap-4 mb-4">
              <span
                class="font-medium tabular-nums text-[13px]"
                style="color: var(--color-text-tertiary); letter-spacing: 0.04em;"
              >0{{ ci + 1 }}</span>
              <h2
                class="font-medium tracking-tight leading-[1.1]"
                style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
              >
                {{ category.name }}
              </h2>
            </div>
            
            <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-6 max-w-sm">
              {{ category.desc }}
            </p>
            
            <span
              class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]"
              style="background-color: var(--color-bg-surface); color: var(--color-text-tertiary); border: 1px solid var(--color-border);"
            >
              {{ category.features.length }} Fitur Utama
            </span>
          </div>

          <!-- Right: Features list (cols 5-12) -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              <div
                v-for="feat in category.features"
                :key="feat.label"
                class="flex flex-col items-start transition-opacity duration-200 hover:opacity-90"
              >
                <!-- Feature icon & badge header -->
                <div class="flex items-center gap-3 mb-4">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path :d="feat.icon" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>

                  <!-- Badges -->
                  <span
                    v-if="feat.core"
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.08em] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  >Inti</span>
                  <span
                    v-if="feat.soon"
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.08em] bg-[var(--color-bg-subtle)] text-[var(--color-text-tertiary)] border border-[var(--color-border)]"
                  >Segera</span>
                </div>

                <!-- Feature Title -->
                <h3
                  class="font-medium tracking-tight text-lg text-[var(--color-text-primary)] mb-2"
                >
                  {{ feat.label }}
                </h3>

                <!-- Feature Description -->
                <p
                  class="text-[13.5px] leading-[1.65] text-[var(--color-text-secondary)]"
                >
                  {{ feat.desc }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CTA — minimal bottom strip
         ══════════════════════════════════════════════════════ -->
    <section
      class="px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Mulai Sekarang"
    >
      <div class="h-px mb-16 md:mb-20" style="background-color: var(--color-border);"></div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div class="md:col-span-8">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-5" style="color: var(--color-text-tertiary);">Mulai Sekarang</p>
          <h2
            class="font-medium tracking-tight leading-[1.05]"
            style="font-size: clamp(28px, 5vw, 60px); color: var(--color-text-primary); max-width: 680px;"
          >
            Siap transformasi operasional restoran Anda?
          </h2>
        </div>
        <div class="md:col-span-4 flex md:justify-end items-end gap-3">
          <NuxtLink
            to="/#"
            class="inline-flex items-center gap-2 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:-translate-y-px shadow-sm"
            style="background-color: var(--color-text-primary); color: #FFFFFF; padding: 14px 28px;"
          >
            Coba Gratis
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="inline-flex items-center gap-2 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:-translate-y-px"
            style="background-color: transparent; color: var(--color-text-primary); padding: 13px 24px; border: 1px solid var(--color-border);"
          >
            Hubungi Kami
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CUSTOM FEATURE FOCUS SECTION — same design style as index, customized content
         ══════════════════════════════════════════════════════ -->
    <section
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Keandalan Platform"
    >
      <!-- Subtle background texture -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          class="absolute"
          style="width: 60%; height: 60%; top: -20%; left: -10%; background: radial-gradient(circle, rgba(232,119,34,0.06) 0%, transparent 70%); border-radius: 50%;"
        ></div>
        <div
          class="absolute"
          style="width: 50%; height: 50%; bottom: -15%; right: -5%; background: radial-gradient(circle, rgba(232,119,34,0.04) 0%, transparent 70%); border-radius: 50%;"
        ></div>
      </div>

      <div class="relative z-10 px-5 md:px-10 lg:px-16 py-24 md:py-32 max-w-[1400px] mx-auto">

        <!-- Header row -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-20 md:mb-28">
          <!-- Badge -->
          <div class="lg:col-span-4 flex items-start">
            <div
              class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
              style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
            >
              <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
              <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Keandalan Sistem</span>
            </div>
          </div>

          <!-- Heading -->
          <div class="lg:col-span-8">
            <h2
              class="font-medium leading-[1.08] tracking-tight"
              style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF; max-width: 680px;"
            >
              Teknologi andalan untuk menyokong
              <span style="color: rgba(255,255,255,0.35);"> keberlangsungan bisnis F&amp;B Anda.</span>
            </h2>
          </div>
        </div>

        <!-- 3 Focus Items -->
        <div>
          <!-- Top border -->
          <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>

          <div
            v-for="(focus, i) in focuses"
            :key="focus.id"
          >
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 py-12 md:py-16 items-start group">
              <!-- Number + Title (left) -->
              <div class="md:col-span-5 flex items-baseline gap-5">
                <span
                  class="flex-shrink-0 tabular-nums font-light"
                  style="font-size: 13px; color: rgba(255,255,255,0.25); letter-spacing: 0.04em;"
                >{{ focus.number }}</span>
                <h3
                  class="font-medium tracking-tight leading-[1.1]"
                  style="font-size: clamp(24px, 3vw, 38px); color: #FFFFFF;"
                >{{ focus.title }}</h3>
              </div>

              <!-- Description (right) -->
              <div class="md:col-span-7 md:pt-1.5">
                <p class="text-[14.5px] leading-[1.75] max-w-[560px]" style="color: rgba(255,255,255,0.55);">
                  {{ focus.desc }}
                </p>
                <!-- Feature tags -->
                <div class="flex flex-wrap gap-2 mt-6">
                  <span
                    v-for="tag in focus.tags"
                    :key="tag"
                    class="px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.1em]"
                    style="background-color: rgba(255,255,255,0.06); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.08);"
                  >{{ tag }}</span>
                </div>
              </div>
            </div>
            <!-- Divider -->
            <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>
          </div>
        </div>

      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
interface Feature {
  label: string
  desc: string
  icon: string
  iconBg: string
  iconColor: string
  core?: boolean
  soon?: boolean
  featured?: boolean
}

interface Category {
  id: string
  name: string
  desc: string
  features: Feature[]
}

useHead({
  title: 'Fitur — Santap',
  meta: [
    { name: 'description', content: 'Semua fitur yang dibutuhkan kasir modern: manajemen pesanan, laporan real-time, multi pembayaran, dan lebih banyak lagi.' }
  ]
})
const focuses = [
  {
    id: 'reliability',
    number: '01',
    title: 'Keandalan POS',
    desc: 'Sistem kasir modern yang dirancang untuk terus bekerja dengan mulus bahkan saat koneksi internet terputus. Data transaksi otomatis disinkronisasi ketika online kembali.',
    tags: ['Mode Offline', 'Keamanan Data', 'Auto-Sync'],
  },
  {
    id: 'workflow',
    number: '02',
    title: 'Efisiensi Dapur',
    desc: 'Hilangkan resiko salah catat atau pesanan terlambat. Integrasi dengan Kitchen Display System (KDS) mengalirkan order langsung ke dapur secara real-time.',
    tags: ['KDS Integrasi', 'Tanpa Kertas', 'Respons Kilat'],
  },
  {
    id: 'insights',
    number: '03',
    title: 'Analitik Real-Time',
    desc: 'Pantau profit margin, menu terlaris, dan kinerja staf cabang dari satu portal pemilik restoran. Data akurat membantu pengambilan keputusan strategis Anda.',
    tags: ['Owner Portal', 'Margin Kontrol', 'Ekspor Excel'],
  },
]

const categories: Category[] = [
  {
    id: 'ordering',
    name: 'Manajemen Pesanan',
    desc: 'Alur pesanan terintegrasi dari meja ke dapur hingga ke kasir — real-time, tanpa kertas, tanpa kesalahan.',
    features: [
      {
        label: 'Kasir Mobile',
        desc: 'Catat pesanan, proses transaksi, dan terima pembayaran langsung dari smartphone tanpa perangkat kasir mahal.',
        icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
        iconBg: 'var(--color-primary-light)',
        iconColor: 'var(--color-primary)',
        core: true,
        featured: true,
      },
      {
        label: 'Multi-tipe Pesanan',
        desc: 'Dine-in, takeaway, dan delivery dikelola dari satu layar tanpa berpindah aplikasi.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        iconBg: '#E8F5EF',
        iconColor: '#2D8A4E',
        featured: false,
      },
      {
        label: 'Kitchen Display',
        desc: 'Pesanan tersinkronisasi ke layar dapur secara real-time — tidak ada yang terlewat.',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        iconBg: '#EEF2FF',
        iconColor: '#4F46E5',
        featured: false,
      },
    ],
  },
  {
    id: 'payment',
    name: 'Pembayaran',
    desc: 'Terima semua metode pembayaran modern dalam satu sistem terpadu — tanpa perangkat tambahan.',
    features: [
      {
        label: 'Multi Pembayaran',
        desc: 'Tunai, QRIS, transfer bank, kartu debit/kredit, dan dompet digital semuanya diterima.',
        icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        iconBg: '#FFF4E0',
        iconColor: '#B97B0A',
        core: true,
        featured: false,
      },
      {
        label: 'Split Bill',
        desc: 'Bagi tagihan ke beberapa pelanggan atau terapkan diskon per item maupun total transaksi.',
        icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
        iconBg: 'var(--color-primary-light)',
        iconColor: 'var(--color-primary)',
        featured: false,
      },
      {
        label: 'Rekonsiliasi Otomatis',
        desc: 'Selisih kas terdeteksi otomatis di akhir shift — audit harian menjadi cepat dan akurat.',
        icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
        iconBg: '#E8F5EF',
        iconColor: '#2D8A4E',
        featured: false,
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Laporan & Analitik',
    desc: 'Data penjualan aktual yang membantu Anda mengambil keputusan bisnis tanpa tebak-tebakan.',
    features: [
      {
        label: 'Dashboard Real-time',
        desc: 'Pantau omzet, jumlah transaksi, dan rata-rata per meja hari ini langsung dari smartphone.',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        iconBg: 'var(--color-primary-light)',
        iconColor: 'var(--color-primary)',
        core: true,
        featured: true,
      },
      {
        label: 'Produk Terlaris',
        desc: 'Temukan menu yang paling diminati dan kapan puncak penjualannya terjadi.',
        icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
        iconBg: '#FFF4E0',
        iconColor: '#B97B0A',
        featured: false,
      },
      {
        label: 'Ekspor Laporan',
        desc: 'Unduh laporan dalam format PDF atau Excel — siap untuk keperluan akunting dan audit.',
        icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        iconBg: '#EEF2FF',
        iconColor: '#4F46E5',
        featured: false,
      },
    ],
  },
  {
    id: 'operations',
    name: 'Operasional',
    desc: 'Kelola inventaris, menu, dan multi-outlet dari satu platform terpadu yang mudah dioperasikan.',
    features: [
      {
        label: 'Manajemen Stok',
        desc: 'Pantau bahan baku dan produk secara otomatis. Notifikasi dikirim sebelum stok habis.',
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        iconBg: '#E8F5EF',
        iconColor: '#2D8A4E',
        featured: false,
      },
      {
        label: 'Menu Digital',
        desc: 'Kelola menu, harga, dan kategori kapan saja. Perubahan langsung tersinkron ke semua perangkat.',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        iconBg: 'var(--color-primary-light)',
        iconColor: 'var(--color-primary)',
        featured: false,
      },
      {
        label: 'Multi Outlet',
        desc: 'Kelola beberapa cabang restoran dari satu akun dengan laporan konsolidasi yang lengkap.',
        icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
        iconBg: '#EEF2FF',
        iconColor: '#4F46E5',
        soon: true,
        featured: false,
      },
    ],
  },
]
</script>
