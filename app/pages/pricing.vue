<template>
  <main>

    <!-- ══════════════════════════════════════════════════════
         HERO — IntegratedBio style:
         Large 2-line title (bold + muted), scroll arrow, subtitle bottom-right
         ══════════════════════════════════════════════════════ -->
    <section
      class="relative bg-[var(--color-bg-page)]"
      style="min-height: 85svh; display: flex; flex-direction: column;"
      aria-label="Harga Santap"
    >
      <div
        class="flex-1 px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto w-full
               flex flex-col justify-between pt-32 pb-16 md:pt-40 md:pb-20"
      >
        <!-- ── Overline badge ──────────────────────────────── -->
        <div class="mb-8 md:mb-12">
          <div class="inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]">
            <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Harga Paket</span>
          </div>
        </div>

        <!-- ── Main title — 2 lines ──────────────────────────── -->
        <div class="flex-1 flex items-center">
          <h1 class="font-medium tracking-[-0.03em] leading-[0.95]" style="font-size: clamp(56px, 12vw, 160px);">
            <span class="block" style="color: var(--color-text-primary);">Harga Jujur.</span>
            <span class="block" style="color: var(--color-text-tertiary);">Tanpa Kejutan.</span>
          </h1>
        </div>

        <!-- ── Bottom row: scroll arrow (left) + subtitle (right) ── -->
        <div class="flex items-end justify-between border-t pt-10 border-[var(--color-border)] mt-12">
          <!-- Scroll-down arrow -->
          <button
            @click="scrollToContent"
            class="flex items-center justify-center rounded-xl border border-[var(--color-border)] transition-all duration-200 hover:border-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] group"
            style="width: 44px; height: 44px; color: var(--color-text-primary);"
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
            Investasi terbaik untuk operasional kuliner Anda.
            <span style="color: var(--color-text-primary); font-weight: 500;">Pilih paket yang paling pas</span> untuk skala kapasitas bisnis saat ini.
          </p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         IMMERSIVE DARK SECTION — food image + large white text overlay
         (Matching features page design layout exactly)
         ══════════════════════════════════════════════════════ -->
    <section
      id="pricing-overview"
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
        <p
          class="font-medium leading-[1.12] tracking-tight max-w-[950px]"
          style="font-size: clamp(26px, 4vw, 52px); color: #FFFFFF;"
        >
          Platform kami memungkinkan pencatatan pesanan, pembayaran multi-metode, dan pelaporan real-time yang, digabungkan dengan antarmuka intuitif, membuka kendali penuh atas operasional restoran dari satu aplikasi.
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         PRICING GRID SECTION — clean and spacious
         ══════════════════════════════════════════════════════ -->
    <section
      id="pricing-content"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Pilihan Paket"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <!-- Billing Toggle Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
        <div>
          <h2 class="text-2xl md:text-3xl font-medium tracking-tight text-[var(--color-text-primary)]">
            Tingkatkan Skala Kapan Saja
          </h2>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">
            Uji coba gratis 14 hari untuk semua paket berbayar.
          </p>
        </div>

        <!-- Toggle Pill Switch -->
        <div class="inline-flex items-center gap-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-1 rounded-full self-start sm:self-auto">
          <button
            @click="isAnnual = false"
            class="px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.06em] transition-all cursor-pointer"
            :class="!isAnnual ? 'bg-[var(--color-text-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
          >
            Bulanan
          </button>
          <button
            @click="isAnnual = true"
            class="px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.06em] transition-all cursor-pointer flex items-center gap-1.5"
            :class="isAnnual ? 'bg-[var(--color-text-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
          >
            Tahunan
            <span
              class="px-1.5 py-0.5 rounded text-[9px] font-extrabold normal-case tracking-normal"
              :class="isAnnual ? 'bg-white/20 text-white' : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'"
            >
              Hemat 20%
            </span>
          </button>
        </div>
      </div>

      <!-- Pricing Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300"
          :class="plan.featured
            ? 'bg-[var(--color-bg-surface)] border-[var(--color-primary)] shadow-[0_8px_32px_rgba(0,0,0,0.04)] lg:scale-105 z-10'
            : 'bg-transparent border-[var(--color-border)] hover:border-[var(--color-border-strong)]'"
        >
          <!-- Top section -->
          <div>
            <!-- Badge for featured -->
            <div class="flex justify-between items-center mb-6">
              <span
                class="text-[10px] font-bold uppercase tracking-[0.15em]"
                :style="`color: ${plan.featured ? 'var(--color-primary)' : 'var(--color-text-tertiary)'};`"
              >
                {{ plan.badge }}
              </span>
              <span
                v-if="plan.featured"
                class="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.06em] bg-[var(--color-primary)] text-white"
              >
                Paling Populer
              </span>
            </div>

            <!-- Title & Desc -->
            <h3 class="text-2xl font-medium tracking-tight text-[var(--color-text-primary)] mb-2">
              {{ plan.name }}
            </h3>
            <p class="text-[13.5px] leading-relaxed text-[var(--color-text-secondary)] mb-6">
              {{ plan.desc }}
            </p>

            <!-- Price -->
            <div class="flex items-baseline gap-1 mb-8 border-b pb-8 border-[var(--color-border)]">
              <span class="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {{ isAnnual ? plan.priceAnnual : plan.priceMonthly }}
              </span>
              <span v-if="plan.showPeriod" class="text-xs text-[var(--color-text-tertiary)]">
                / outlet / bln
              </span>
            </div>

            <!-- Features list -->
            <p class="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-primary)] mb-4">
              Fitur yang Termasuk:
            </p>
            <ul class="flex flex-col gap-3.5 mb-8">
              <li
                v-for="feat in plan.features"
                :key="feat"
                class="flex items-start gap-3"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-[var(--color-primary)] mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-[13.5px] text-[var(--color-text-secondary)] leading-none">{{ feat }}</span>
              </li>
            </ul>
          </div>

          <!-- Bottom Button -->
          <NuxtLink
            :to="plan.ctaLink"
            class="inline-flex items-center justify-center py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] no-underline transition-all hover:-translate-y-px"
            :style="plan.featured
              ? 'background-color: var(--color-text-primary); color: #FFFFFF;'
              : 'background-color: transparent; color: var(--color-text-primary); border: 1px solid var(--color-border);'"
          >
            {{ plan.ctaLabel }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         FAQ SECTION — clean accordion row list
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Tanya Jawab"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <!-- Left: header -->
        <div class="lg:col-span-4 lg:sticky lg:top-28">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">FAQ</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-5"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Pertanyaan Umum
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Menjawab segala pertanyaan Anda terkait sistem berlangganan, pembatalan, dan metode pembayaran Santap.
          </p>
        </div>

        <!-- Right: Accordion rows -->
        <div class="lg:col-span-8">
          <div class="h-px bg-[var(--color-border)]"></div>

          <div v-for="(item, i) in faqItems" :key="i">
            <button
              class="accordion-trigger w-full flex items-center justify-between gap-6 bg-transparent border-none cursor-pointer text-left transition-all duration-250"
              :class="[
                openFaq !== null && openFaq !== i
                  ? 'opacity-35 hover:opacity-60'
                  : 'opacity-100',
                openFaq === i ? 'pt-12 md:pt-16 pb-8 md:pb-10' : 'py-10 md:py-14'
              ]"
              @click="toggleFaq(i)"
              :aria-expanded="openFaq === i"
              :aria-controls="`faq-panel-${i}`"
            >
              <!-- Number + Title — allow full wrap, no truncate -->
              <div class="flex items-start gap-5 md:gap-10 min-w-0 flex-1">
                <span
                  class="flex-shrink-0 font-medium tabular-nums leading-tight mt-1"
                  style="font-size: clamp(18px, 2.2vw, 28px); color: var(--color-text-tertiary);"
                >0{{ i + 1 }}.</span>
                <span
                  class="font-medium tracking-[-0.025em] leading-[1.08]"
                  style="font-size: clamp(28px, 4.5vw, 58px); color: var(--color-text-primary); white-space: normal; word-break: normal;"
                >
                  {{ item.question }}
                </span>
              </div>

              <!-- Icon -->
              <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 transition-all duration-200"
                   style="color: var(--color-text-tertiary);">
                <template v-if="openFaq === i">
                  <!-- minus — -->
                  <svg width="22" height="2" viewBox="0 0 22 2" fill="none" aria-hidden="true">
                    <path d="M1 1h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </template>
                <template v-else>
                  <!-- plus + -->
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 1v18M1 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </template>
              </div>
            </button>

            <!-- Slide down content wrapper -->
            <div
              :id="`faq-panel-${i}`"
              class="accordion-panel"
              :class="openFaq === i ? 'panel-open' : ''"
              role="region"
            >
              <div class="accordion-inner">
                <div class="pb-12 md:pb-16 pl-[calc(clamp(18px,2.2vw,28px)+1.25rem)] md:pl-[calc(clamp(18px,2.2vw,28px)+2.5rem)]">
                  <p class="text-[15px] leading-[1.75] text-[var(--color-text-secondary)] max-w-[680px]">
                    {{ item.answer }}
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
         CUSTOM PRICING TRUST SECTION — same design style as index, customized content
         ══════════════════════════════════════════════════════ -->
    <section
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Transparansi & Jaminan"
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
              <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Jaminan Kami</span>
            </div>
          </div>

          <!-- Heading -->
          <div class="lg:col-span-8">
            <h2
              class="font-medium leading-[1.08] tracking-tight"
              style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF; max-width: 680px;"
            >
              Kami mengutamakan hubungan
              <span style="color: rgba(255,255,255,0.35);"> jangka panjang yang jujur dan adil.</span>
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
useHead({
  title: 'Harga Langganan — Santap',
  meta: [
    { name: 'description', content: 'Pilihan paket berlangganan aplikasi kasir mobile Santap. Dapatkan paket Starter, Pro, atau Enterprise sesuai kebutuhan restoran Anda.' }
  ]
})

const scrollToContent = () => {
  document.getElementById('pricing-overview')?.scrollIntoView({ behavior: 'smooth' })
}

const isAnnual = ref(false)

const openFaq = ref<number | null>(0)
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const plans = [
  {
    name: 'Starter',
    badge: 'Kios & Kedai Kecil',
    desc: 'Semua fitur operasional esensial untuk bisnis kuliner pemula yang ingin digitalisasi pencatatan kasir.',
    priceMonthly: 'Rp 89.000',
    priceAnnual: 'Rp 71.200',
    showPeriod: true,
    featured: false,
    ctaLabel: 'Mulai Uji Coba',
    ctaLink: '/register',
    features: [
      '1 Akun Kasir (Mobile POS)',
      'Sinkronisasi Dapur (KDS)',
      'Pembayaran Tunai & QRIS',
      'Laporan Penjualan Dasar',
      'Dukungan via WhatsApp'
    ]
  },
  {
    name: 'Pro',
    badge: 'Cafe & Restoran',
    desc: 'Untuk bisnis kuliner berkembang yang memerlukan laporan stok mendalam dan manajemen staf terpadu.',
    priceMonthly: 'Rp 149.000',
    priceAnnual: 'Rp 119.200',
    showPeriod: true,
    featured: true,
    ctaLabel: 'Coba Pro 14 Hari',
    ctaLink: '/register',
    features: [
      'Multi Akun Kasir & Pelayan',
      'Manajemen Stok & Bahan Baku',
      'Split Bill & Diskon Fleksibel',
      'Dashboard Owner Real-Time',
      'Semua Metode Pembayaran',
      'Dukungan Prioritas 24 Jam'
    ]
  },
  {
    name: 'Enterprise',
    badge: 'Multi-Outlet & Franchise',
    desc: 'Untuk jaringan franchise besar dengan puluhan cabang yang membutuhkan laporan konsolidasi tersentralisasi.',
    priceMonthly: 'Hubungi Kami',
    priceAnnual: 'Hubungi Kami',
    showPeriod: false,
    featured: false,
    ctaLabel: 'Hubungi Sales',
    ctaLink: '/contact',
    features: [
      'Tanpa Batasan Cabang/Outlet',
      'Stok Terpusat Multi-Gudang',
      'Menu Konsolider & Integrasi API',
      'Akun Sukses Pelanggan Khusus',
      'SLA Keandalan Layanan 99.9%',
      'Kustomisasi Fitur Spesifik'
    ]
  }
]

const faqItems = [
  {
    question: 'Apakah ada kontrak komitmen minimum?',
    answer: 'Tidak sama sekali. Anda dapat memilih langganan bulanan tanpa kontrak mengikat dan dapat membatalkan layanan kapan saja tanpa biaya penalti.'
  },
  {
    question: 'Bagaimana sistem penghitungan biaya per outlet?',
    answer: 'Biaya dihitung flat per outlet (cabang) per bulan. Jika Anda memiliki 3 outlet dan berlangganan paket Pro tahunan, maka biaya bulanan Anda adalah 3 x Rp 119.200.'
  },
  {
    question: 'Apakah ada komisi transaksi dari penjualan QRIS?',
    answer: 'Santap tidak mengambil biaya komisi tambahan dari transaksi POS Anda. Biaya transaksi QRIS murni dipotong langsung oleh gerbang pembayaran penyedia (sesuai regulasi MDR Bank Indonesia).'
  },
  {
    question: 'Bisakah saya melakukan upgrade atau downgrade paket?',
    answer: 'Ya, Anda bebas untuk melakukan upgrade paket dari Starter ke Pro kapan saja. Skema tagihan pro-rata akan disesuaikan otomatis pada sisa masa aktif langganan Anda.'
  }
]

const focuses = [
  {
    id: 'hidden-fees',
    number: '01',
    title: 'Tanpa Biaya Siluman',
    desc: 'Semua harga paket yang tertera transparan. Kami tidak memotong komisi penjualan Anda, tidak ada biaya administrasi bulanan tersembunyi, atau biaya aktivasi awal.',
    tags: ['0% Komisi Tambahan', 'Flat Rate', 'Transparan'],
  },
  {
    id: 'guarantee',
    number: '02',
    title: 'Garansi Uang Kembali',
    desc: 'Kami sangat yakin dengan kualitas produk kami. Jika dalam 14 hari pertama penggunaan Anda merasa layanan tidak sesuai, kami akan mengembalikan biaya langganan penuh tanpa pertanyaan.',
    tags: ['14 Hari Garansi', 'Tanpa Resiko', 'Refund Instan'],
  },
  {
    id: 'onboarding',
    number: '03',
    title: 'Panduan Setup Gratis',
    desc: 'Tim Customer Success kami akan memandu proses input menu, pengaturan stok, hingga pelatihan kasir Anda secara virtual secara gratis tanpa ada biaya tambahan.',
    tags: ['Virtual Setup', 'Training Gratis', 'WhatsApp Support'],
  },
]
</script>

<style scoped>
.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.42s cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-inner {
  overflow: hidden;
  min-height: 0;
}

.panel-open {
  grid-template-rows: 1fr;
}

.accordion-trigger {
  font-family: inherit;
}
</style>
