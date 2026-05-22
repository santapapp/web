<template>
  <main>

    <!-- ══════════════════════════════════════════════════════
         HERO — IntegratedBio style:
         Large 2-line title (bold + muted), scroll arrow, subtitle bottom-right
         ══════════════════════════════════════════════════════ -->
    <section
      class="relative bg-[var(--color-bg-page)]"
      style="min-height: 85svh; display: flex; flex-direction: column;"
      aria-label="Mitra & Perusahaan"
    >
      <div
        class="flex-1 px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto w-full
               flex flex-col justify-between pt-32 pb-16 md:pt-40 md:pb-20"
      >
        <!-- ── Overline badge ──────────────────────────────── -->
        <div class="mb-8 md:mb-12">
          <div class="inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]">
            <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Mitra & Perusahaan</span>
          </div>
        </div>

        <!-- ── Main title — 2 lines ──────────────────────────── -->
        <div class="flex-1 flex items-center">
          <h1 class="font-medium tracking-[-0.03em] leading-[0.95]" style="font-size: clamp(52px, 11vw, 150px);">
            <span class="block" style="color: var(--color-text-primary);">Kemitraan Kokoh.</span>
            <span class="block" style="color: var(--color-text-tertiary);">Tumbuh Bersama.</span>
          </h1>
        </div>

        <!-- ── Bottom row: scroll arrow (left) + subtitle (right) ── -->
        <div class="flex items-end justify-between border-t pt-10 border-[var(--color-border)] mt-12">
          <!-- Scroll-down arrow -->
          <button
            @click="scrollToContent"
            class="flex items-center justify-center rounded-xl border border-[var(--color-border)] transition-all duration-200 hover:border-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] group"
            style="width: 44px; height: 44px; color: var(--color-text-primary); cursor: pointer;"
            aria-label="Gulir ke bawah"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="transition-colors duration-200 group-hover:text-white" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Subtitle text — bottom right -->
          <p
            class="text-right text-[14.5px] leading-[1.7] max-w-[300px] md:max-w-[380px]"
            style="color: var(--color-text-secondary);"
          >
            Membangun ekosistem F&B Indonesia yang lebih tangguh.
            <span style="color: var(--color-text-primary); font-weight: 500;">Santap hadir</span> sebagai partner teknologi terpercaya bagi jutaan merchant di tanah air.
          </p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         IMMERSIVE DARK SECTION — coffee shop / restaurant scene + large white text overlay
         ══════════════════════════════════════════════════════ -->
    <section
      id="company-overview"
      class="relative mx-3 my-6 md:mx-5 rounded-2xl overflow-hidden"
      style="min-height: 55vh; display: flex; flex-direction: column; justify-content: center;"
      aria-label="Visi Misi"
    >
      <!-- Background image -->
      <img
        src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1800&q=80&fit=crop"
        alt="Barista sedang menyiapkan kopi di cafe modern"
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
            <span class="text-[10px] font-bold uppercase tracking-[0.18em]" style="color: rgba(255,255,255,0.75);">Misi Kami</span>
          </div>
        </div>

        <!-- Large descriptive text -->
        <p
          class="font-medium leading-[1.12] tracking-tight max-w-[950px]"
          style="font-size: clamp(26px, 4vw, 52px); color: #FFFFFF;"
        >
          Kami bertekad memajukan bisnis kuliner lokal melalui teknologi point-of-sale yang modern, andal, dan mudah diakses oleh siapa saja.
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CORE VALUES SECTION — premium split layout
         ══════════════════════════════════════════════════════ -->
    <section
      id="company-content"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Nilai Kami"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        <!-- Left Column: Heading -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Nilai & Komitmen</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-8"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Pilar Kerja Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-12 max-w-sm">
            Lebih dari sekadar aplikasi kasir. Kami beroperasi berdasarkan komitmen jangka panjang untuk mendukung pertumbuhan restoran Anda.
          </p>
        </div>

        <!-- Right Column: Values List -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-8">
            <div class="h-px bg-[var(--color-border)]"></div>

            <div 
              v-for="(val, i) in values" 
              :key="i"
              class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-6"
            >
              <div class="flex items-start gap-4">
                <span class="text-[12px] font-medium tabular-nums text-[var(--color-text-tertiary)] mt-1">0{{ i + 1 }}.</span>
                <div>
                  <h3 class="text-[18px] font-medium text-[var(--color-text-primary)] mb-1">{{ val.title }}</h3>
                  <p class="text-[14.5px] text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                    {{ val.desc }}
                  </p>
                </div>
              </div>
            </div>

            <div class="h-px bg-[var(--color-border)]"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         STATS SECTION — clean grid layout
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Pencapaian"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <!-- Left: description -->
        <div class="lg:col-span-4">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Data Bicara</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-6"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Dipercaya di Seluruh Indonesia
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Statistik nyata dari dedikasi kami dalam menghadirkan sistem kasir (POS) handal dan bernilai ekonomi tinggi.
          </p>
        </div>

        <!-- Right: Stats Grid -->
        <div class="lg:col-span-8">
          <div class="grid grid-cols-2 gap-x-8 gap-y-12 md:gap-y-16">
            <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-2">
              <span
                class="font-medium tracking-tight leading-none text-[var(--color-text-primary)]"
                style="font-size: clamp(32px, 5vw, 64px);"
              >
                {{ stat.value }}
              </span>
              <span class="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-tertiary)]">
                {{ stat.label }}
              </span>
              <p class="text-[13.5px] text-[var(--color-text-secondary)] leading-relaxed mt-1 max-w-xs">
                {{ stat.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═════════════════════════════════════════════════════════════════════════════════════
         PARTNER MERCHANT SECTION — Cafe & Restaurant Partners
         ═════════════════════════════════════════════════════════════════════════════════════ -->
    <section
      id="company-partners"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Mitra Restoran"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        <!-- Left Column: Heading -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Ekosistem Kuliner</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-8"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Tumbuh Bersama Mitra Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-12 max-w-sm">
            Dari kedai kopi lokal hingga jaringan resto multi-cabang, kami bangga menjadi bagian dari perjalanan sukses mereka.
          </p>
        </div>

        <!-- Right Column: Cards & Grid -->
        <div class="lg:col-span-8">
          <!-- Featured Cafe Card -->
          <div class="featured-cafe-card p-8 md:p-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div class="flex-1 z-10">
              <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] mb-3 block">Sorotan Mitra</span>
              <h3 class="text-[22px] font-semibold text-[var(--color-text-primary)] mb-3">Kopi Kenangan</h3>
              <p class="text-[14px] leading-relaxed text-[var(--color-text-secondary)] mb-6 max-w-lg">
                "Mengelola ratusan gerai di seluruh Indonesia menjadi jauh lebih mudah sejak kami mengintegrasikan sistem POS cloud dari Santap. Sinkronisasi menu real-time dan manajemen stok bahan baku berjalan tanpa hambatan."
              </p>
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">
                  Kemitraan Sejak 2024
                </span>
              </div>
            </div>
            <!-- Featured Logo Emblem (Kopi Kenangan Logo) -->
            <div class="w-28 h-28 flex items-center justify-center rounded-xl bg-[var(--color-bg-page)] border border-[var(--color-border)] p-4 self-center md:self-auto shrink-0 z-10 transition-transform duration-300 hover:scale-105">
              <NuxtImg src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Kopi_Kenangan.svg" alt="Kopi Kenangan Logo" class="w-full h-full object-contain" />
            </div>
            <div class="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-[var(--color-primary-light)] to-transparent opacity-40 rounded-full blur-2xl -mr-16 -mb-16 pointer-events-none"></div>
          </div>

          <!-- Logo Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              v-for="cafe in cafes"
              :key="cafe.name"
              class="partner-logo-card"
            >
              <!-- Glowing effect on hover -->
              <div class="card-glow"></div>
              
              <!-- Border corners -->
              <div class="corner-line top-left"></div>
              <div class="corner-line top-right"></div>
              <div class="corner-line bottom-left"></div>
              <div class="corner-line bottom-right"></div>
 
              <div class="card-content">
                <div class="logo-wrapper">
                  <NuxtImg :src="cafe.logoUrl" :alt="cafe.name" class="partner-img-logo" />
                </div>
                <span class="cafe-name">{{ cafe.name }}</span>
                <span class="cafe-type">{{ cafe.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CTA SECTION — Dark theme above footer
         ══════════════════════════════════════════════════════ -->
    <section
      id="company-cta"
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Kemitraan Baru"
    >
      <!-- Subtle background texture (glow) -->
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
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          <!-- Left Column: Heading -->
          <div class="lg:col-span-4 flex flex-col justify-between">
            <div>
              <!-- Badge -->
              <div class="mb-8">
                <div
                  class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
                  style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
                >
                  <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
                  <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Mulai Kolaborasi</span>
                </div>
              </div>

              <h2
                class="font-medium leading-[1.08] tracking-tight mb-6"
                style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF;"
              >
                Kolaborasi untuk masa depan
                <span style="color: rgba(255,255,255,0.35);"> kuliner Indonesia.</span>
              </h2>
              <p class="text-[14.5px] leading-[1.75] max-w-sm mb-12" style="color: rgba(255,255,255,0.55);">
                Apapun model bisnis F&B Anda, Santap siap hadir membantu menyederhanakan operasional digital setiap hari.
              </p>
            </div>

            <!-- Contacts info -->
            <div class="hidden lg:flex flex-col gap-6">
              <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style="color: rgba(255,255,255,0.35);">Hubungi Kemitraan</p>
                <a href="mailto:halo@santap.id" class="text-[15px] font-medium text-white hover:text-[var(--color-primary)] transition-colors no-underline">
                  halo@santap.id
                </a>
              </div>
            </div>
          </div>

          <!-- Right Column: Partnerships CTA Cards -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              <!-- Card 1: Mitra Merchant -->
              <div
                class="border rounded-2xl p-8 flex flex-col justify-between"
                style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
              >
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] mb-4 block">Mitra Merchant</span>
                  <h3 class="text-xl font-medium text-white mb-3">Daftarkan Restoran Anda</h3>
                  <p class="text-[13.5px] leading-relaxed text-white/55 mb-8">
                    Nikmati kemudahan mencatat pesanan, kelola stok bahan baku, dan pantau laporan penjualan cabang secara real-time.
                  </p>
                </div>
                <NuxtLink
                  to="/register"
                  class="inline-flex items-center justify-center py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] no-underline transition-all hover:-translate-y-px bg-white text-[#111009] hover:bg-white/95"
                >
                  Daftar Sekarang
                </NuxtLink>
              </div>

              <!-- Card 2: Mitra Integrasi / API -->
              <div
                class="border rounded-2xl p-8 flex flex-col justify-between"
                style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
              >
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-4 block">Mitra Integrasi</span>
                  <h3 class="text-xl font-medium text-white mb-3">Integrasikan Layanan Anda</h3>
                  <p class="text-[13.5px] leading-relaxed text-white/55 mb-8">
                    Sambungkan sistem pembayaran e-wallet, layanan pengiriman makanan, atau sistem akuntansi Anda dengan API terbuka Santap.
                  </p>
                </div>
                <NuxtLink
                  to="/contact"
                  class="inline-flex items-center justify-center py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] no-underline transition-all hover:-translate-y-px text-white border border-white/20 hover:bg-white/5"
                >
                  Hubungi API Support
                </NuxtLink>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Mitra & Perusahaan — Santap',
  meta: [
    { name: 'description', content: 'Kenali visi, komitmen, dan pilar kerja Santap dalam memberdayakan jutaan merchant F&B di seluruh Indonesia lewat teknologi POS POS modern.' }
  ]
})

const scrollToContent = () => {
  document.getElementById('company-overview')?.scrollIntoView({ behavior: 'smooth' })
}

const values = [
  {
    title: 'Inovasi Tanpa Batas',
    desc: 'Kami terus memperbarui dan mengembangkan POS cloud kami agar selalu selaras dengan perkembangan tren F&B terkini.'
  },
  {
    title: 'Ketulusan Melayani',
    desc: 'Kami menyadari operasional F&B tidak pernah berhenti. Dukungan WhatsApp kami siap membantu menangani kendala teknis Anda kapan saja.'
  },
  {
    title: 'Kemitraan Adil & Transparan',
    desc: 'Tidak ada biaya tersembunyi. Kami menawarkan struktur harga yang transparan demi menjamin keberlanjutan bisnis kita bersama.'
  }
]

const stats = [
  {
    value: '10,000+',
    label: 'Merchant Terdaftar',
    desc: 'Melayani kedai kopi, kafe mandiri, hingga jaringan resto multi-cabang.'
  },
  {
    value: '99.99%',
    label: 'Uptime POS Cloud',
    desc: 'Menjamin kelancaran kasir Anda tanpa khawatir kehilangan data.'
  },
  {
    value: '50+',
    label: 'Kota di Indonesia',
    desc: 'Mendukung pertumbuhan bisnis kuliner dari Sabang sampai Merauke.'
  },
  {
    value: 'Rp 1.2T+',
    label: 'Volume Transaksi',
    desc: 'Memproses jutaan transaksi F&B secara aman dan real-time pertahun.'
  }
]

const cafes = [
  {
    name: 'Kopi Janji Jiwa',
    type: 'Espresso & Toast',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Janji_Jiwa_Logo.svg'
  },
  {
    name: 'Starbucks',
    type: 'Coffeehouse Chain',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg'
  },
  {
    name: 'Chatime',
    type: 'Fresh Tea & Boba',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Chatime_logo.svg'
  },
  {
    name: 'Costa Coffee',
    type: 'Specialty Coffee',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Costa_Coffee.svg'
  },
  {
    name: 'McCafé',
    type: 'Coffee & Dessert',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/McCaf%C3%A9_logo.svg'
  },
  {
    name: 'Subway',
    type: 'Sandwich & Salad',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg'
  }
]
</script>

<style scoped>
/* Scoped styles for glow background and premium transitions */
.partner-logo-card {
  position: relative;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all var(--duration-normal) var(--ease-default);
  cursor: pointer;
  overflow: hidden;
}

.partner-logo-card:hover {
  border-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-1);
}

/* Card Glow */
.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(232, 119, 34, 0.04) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-default);
  pointer-events: none;
}

.partner-logo-card:hover .card-glow {
  opacity: 1;
}

/* Corner Lines style */
.corner-line {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: var(--color-primary);
  border-style: solid;
  opacity: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}

.top-left {
  top: 12px;
  left: 12px;
  border-width: 1.5px 0 0 1.5px;
  transform: translate(4px, 4px);
}
.top-right {
  top: 12px;
  right: 12px;
  border-width: 1.5px 1.5px 0 0;
  transform: translate(-4px, 4px);
}
.bottom-left {
  bottom: 12px;
  left: 12px;
  border-width: 0 0 1.5px 1.5px;
  transform: translate(4px, -4px);
}
.bottom-right {
  bottom: 12px;
  right: 12px;
  border-width: 0 1.5px 1.5px 0;
  transform: translate(-4px, -4px);
}

.partner-logo-card:hover .corner-line {
  opacity: 1;
  transform: translate(0, 0);
}

/* Card Content */
.card-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-wrapper {
  height: 44px;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.partner-img-logo {
  height: 100%;
  max-width: 130px;
  object-fit: contain;
  opacity: 0.55;
  filter: grayscale(1) contrast(1.1);
  transition: all var(--duration-normal) var(--ease-default);
}

.partner-logo-card:hover .partner-img-logo {
  opacity: 1;
  filter: grayscale(0) contrast(1);
}

.cafe-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.cafe-type {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
}
</style>
