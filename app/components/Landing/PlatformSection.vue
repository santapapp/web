<template>
  <section ref="containerRef" class="bg-[var(--color-bg-page)]" aria-label="Platform Terpadu">

    <!-- ── Top Part ─────────────────────────────────────────── -->
    <div ref="headerRef" class="px-5 md:px-10 lg:px-16 pt-24 md:pt-32 pb-20 md:pb-28 max-w-[1400px] mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

        <!-- Left: Badge -->
        <div class="plat-left lg:col-span-4 flex items-start">
          <div
            class="plat-badge inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]"
          >
            <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Platform Terpadu</span>
          </div>
        </div>

        <!-- Right: Content -->
        <div class="lg:col-span-8 flex flex-col items-start">

          <AppScrollLineCurtain
            class="mb-10 max-w-[820px]"
            heading-class="leading-[1.07] tracking-[-0.02em]"
            :heading-style="{ fontSize: 'clamp(30px, 4.5vw, 58px)' }"
            scroll-start="top 78%"
          >
            <template #line1>
              <span style="color: var(--color-text-primary);">Satu platform untuk</span>
            </template>
            <template #line2>
              <span
                style="
                  background: linear-gradient(100deg, var(--color-text-primary) 0%, var(--color-primary) 55%, #FFA550 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                "
              >pesanan, pembayaran, laporan.</span>
            </template>
          </AppScrollLineCurtain>

          <p
            class="plat-reveal-item plat-body text-[14.5px] leading-[1.75] max-w-[580px]"
            style="color: var(--color-text-secondary); margin-bottom: 56px;"
          >
            Kelola pesanan dan pembayaran dengan presisi. Data real-time untuk keputusan bisnis yang lebih cerdas.
          </p>

          <!-- Buttons -->
          <div class="plat-reveal-item plat-btns flex items-center gap-3">
            <NuxtLink
              to="/features"
              class="motion-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                     text-[11px] font-bold uppercase tracking-[0.1em]
                     no-underline shadow-sm"
              style="background-color: var(--color-text-primary); color: #FFFFFF;"
            >
              Pelajari Fitur
            </NuxtLink>
            <NuxtLink
              to="/features"
              class="motion-btn inline-flex items-center justify-center w-11 h-11 rounded-full
                     no-underline flex-shrink-0 shadow-sm"
              style="background-color: var(--color-primary); color: #FFFFFF;"
              aria-label="Pelajari lebih lanjut"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Marquee Strip ───────────────────────────────────── -->
    <div class="plat-marquee-wrap plat-marquee-reveal" aria-hidden="true">
      <div class="plat-marquee-inner">
        <span>Manajemen Pesanan</span><span class="plat-dot">·</span>
        <span>Laporan Real-time</span><span class="plat-dot">·</span>
        <span>Integrasi Pembayaran</span><span class="plat-dot">·</span>
        <span>Manajemen Menu</span><span class="plat-dot">·</span>
        <span>Analitik Bisnis</span><span class="plat-dot">·</span>
        <span>Multi Outlet</span><span class="plat-dot">·</span>
        <!-- Duplicate for seamless loop -->
        <span>Manajemen Pesanan</span><span class="plat-dot">·</span>
        <span>Laporan Real-time</span><span class="plat-dot">·</span>
        <span>Integrasi Pembayaran</span><span class="plat-dot">·</span>
        <span>Manajemen Menu</span><span class="plat-dot">·</span>
        <span>Analitik Bisnis</span><span class="plat-dot">·</span>
        <span>Multi Outlet</span><span class="plat-dot">·</span>
      </div>
    </div>

    <!-- ── Accordion List ─────────────────────────────────────── -->
    <div class="px-5 md:px-10 lg:px-16 pb-24 md:pb-32 max-w-[1400px] mx-auto">

      <!-- Top border -->
      <div class="h-px bg-[var(--color-border)]"></div>

      <div ref="accListRef" class="plat-acc-list">
        <div v-for="(item, i) in accordionItems" :key="item.id" class="plat-acc-row" :data-acc-index="i">

          <!-- ── Trigger Row ──────────────────────────────────── -->
          <button
            class="motion-accordion-trigger accordion-trigger w-full flex items-center justify-between gap-6
                   bg-transparent border-none cursor-pointer text-left"
            :class="[
              !isOpen(i) ? 'opacity-35 hover:opacity-60' : 'opacity-100',
              isOpen(i) ? 'pt-12 md:pt-16 pb-8 md:pb-10' : 'py-10 md:py-14'
            ]"
            :aria-expanded="isOpen(i)"
            :aria-controls="`acc-panel-${i}`"
            @click="toggle(i)"
          >
            <!-- Number + Title -->
            <div class="flex items-start gap-5 md:gap-10 min-w-0 flex-1">
              <span
                class="flex-shrink-0 font-medium tabular-nums leading-tight mt-1"
                style="font-size: clamp(18px, 2.2vw, 28px); color: var(--color-text-tertiary);"
              >{{ item.number }}</span>
              <span
                class="font-medium tracking-[-0.025em] leading-[1.08]"
                style="font-size: clamp(28px, 4.5vw, 58px); color: var(--color-text-primary); white-space: normal; word-break: normal;"
              >{{ item.title }}</span>
            </div>

            <!-- Icon -->
            <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 transition-all duration-200"
                 style="color: var(--color-text-tertiary);">
              <template v-if="isOpen(i)">
                <svg width="22" height="2" viewBox="0 0 22 2" fill="none" aria-hidden="true">
                  <path d="M1 1h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </template>
              <template v-else>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 1v18M1 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </template>
            </div>
          </button>

          <!-- ── Expand Panel ─────────────────────────────────── -->
          <div
            :id="`acc-panel-${i}`"
            class="motion-accordion-panel accordion-panel"
            :class="isOpen(i) ? 'panel-open' : ''"
            role="region"
          >
            <div class="accordion-inner">
              <div class="pb-16 md:pb-24 md:pl-[calc(clamp(18px,2.2vw,28px)+3.5rem)]">

                <!-- Grid: Left detail | Right image/visual -->
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

                  <!-- Left: structured content -->
                  <div class="lg:col-span-3 flex flex-col gap-8">
                    <div>
                      <p class="text-[11px] font-bold uppercase tracking-[0.16em] mb-4"
                         style="color: var(--color-primary);">
                        {{ item.tag }}
                      </p>
                      <h3 class="font-medium leading-[1.25] tracking-tight mb-5"
                          style="font-size: clamp(20px, 2vw, 27px); color: var(--color-text-primary);">
                        {{ item.highlight }}
                      </h3>
                      <p class="text-[15px] leading-[1.75]" style="color: var(--color-text-secondary);">
                        {{ item.descLeft }}
                      </p>
                    </div>

                    <!-- Feature list -->
                    <ul class="flex flex-col gap-4 border-t pt-8" style="border-color: var(--color-border);">
                      <li
                        v-for="feat in item.features"
                        :key="feat.label"
                        class="flex items-start gap-4"
                      >
                        <div
                          class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style="background-color: var(--color-primary-light);"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M2.5 7L5.5 10L11.5 4" stroke="var(--color-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <p class="text-[13.5px] font-semibold mb-0.5" style="color: var(--color-text-primary);">{{ feat.label }}</p>
                          <p class="text-[13px] leading-[1.6]" style="color: var(--color-text-tertiary);">{{ feat.desc }}</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- Right: visual card -->
                  <div class="lg:col-span-2 flex flex-col gap-5">
                    <div class="rounded-xl overflow-hidden aspect-[4/3] relative">
                      <img
                        :src="item.image"
                        :alt="item.imageAlt"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div class="absolute inset-0"
                           style="background: linear-gradient(to top, rgba(12,9,6,0.35) 0%, transparent 50%);"></div>
                    </div>

                    <!-- Quote card -->
                    <div
                      class="rounded-xl p-6 flex flex-col justify-between relative overflow-hidden"
                      style="background-color: var(--color-text-primary); min-height: 160px;"
                    >
                      <span
                        class="absolute top-3 right-4 select-none pointer-events-none"
                        style="font-size: 96px; line-height: 1; color: rgba(255,255,255,0.06); font-family: Georgia, serif; font-weight: 700;"
                        aria-hidden="true"
                      >&ldquo;</span>
                      <p
                        class="text-[14px] leading-[1.65] relative z-10"
                        style="color: rgba(255,255,255,0.85);"
                      >
                        &ldquo;{{ item.quote }}&rdquo;
                      </p>
                      <div class="mt-5 flex items-center gap-3 relative z-10">
                        <span
                          class="text-[22px] font-bold tracking-tight leading-none"
                          style="color: var(--color-primary);"
                        >{{ item.statValue }}</span>
                        <span
                          class="text-[12px] leading-[1.4]"
                          style="color: rgba(255,255,255,0.45);"
                        >{{ item.statDesc }}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="plat-divider h-px" style="background-color: var(--color-border);"></div>

        </div>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { runLandingGsap } from '~/composables/useLandingGsap'

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const accListRef = ref<HTMLElement | null>(null)
let ctx: { revert: () => void } | null = null
let teardownScrollAccordion: (() => void) | null = null

const openIndices = ref<Set<number>>(new Set())
/** Item yang user tutup manual — scroll tidak membukanya lagi sampai user tap buka */
const scrollClosedByUser = ref<Set<number>>(new Set())
/** Desktop: scroll juga membuka item; tap tetap bisa buka/tutup */
const scrollAccordion = ref(false)

function isOpen(i: number) {
  return openIndices.value.has(i)
}

function openItemFromScroll(i: number) {
  if (scrollClosedByUser.value.has(i)) return
  if (openIndices.value.has(i)) return
  openIndices.value = new Set([...openIndices.value, i])
}

function toggle(index: number) {
  const next = new Set(openIndices.value)

  if (next.has(index)) {
    next.delete(index)
    if (scrollAccordion.value) {
      scrollClosedByUser.value = new Set([...scrollClosedByUser.value, index])
    }
  } else {
    next.add(index)
    const allowed = new Set(scrollClosedByUser.value)
    allowed.delete(index)
    scrollClosedByUser.value = allowed
  }

  openIndices.value = next
}

const accordionItems = [
  {
    id: 'order',
    number: '01.',
    title: 'Manajemen Pesanan',
    tag: 'Core Feature',
    highlight: 'Dari meja ke dapur — cepat, akurat, tanpa kertas.',
    descLeft: 'Catat pesanan dari meja, takeaway, atau delivery dalam satu layar. Langsung tersinkronisasi ke dapur secara real-time — tidak ada yang terlewat, tidak ada kesalahan.',
    features: [
      { label: 'Multi-tipe pesanan', desc: 'Dine-in, takeaway, delivery dikelola dari satu layar.' },
      { label: 'Sinkronisasi dapur real-time', desc: 'Kitchen display terupdate otomatis saat pesanan masuk.' },
      { label: 'Modifikasi & catatan khusus', desc: 'Tambah catatan atau ubah pesanan kapan saja sebelum diproses.' },
    ],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&fit=crop',
    imageAlt: 'Suasana restoran modern',
    quote: 'Tidak ada pesanan yang terlewat. Semua tersinkronisasi otomatis dari meja ke dapur.',
    statValue: '< 30 dtk',
    statDesc: 'input menu hingga dapur terupdate',
  },
  {
    id: 'report',
    number: '02.',
    title: 'Laporan Real-time',
    tag: 'Analitik',
    highlight: 'Data aktual untuk keputusan bisnis yang lebih cerdas.',
    descLeft: 'Pantau penjualan harian, mingguan, dan bulanan dari smartphone. Dashboard menampilkan omzet, produk terlaris, dan jam sibuk dalam satu tampilan.',
    features: [
      { label: 'Dashboard omzet harian', desc: 'Lihat total penjualan, jumlah transaksi, rata-rata per meja hari ini.' },
      { label: 'Produk terlaris & tren', desc: 'Temukan menu favorit pelanggan dan puncak penjualannya.' },
      { label: 'Ekspor laporan otomatis', desc: 'Unduh dalam PDF atau Excel untuk akunting.' },
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fit=crop',
    imageAlt: 'Dashboard analitik bisnis',
    quote: 'Data penjualan yang aktual membantu saya ambil keputusan bisnis lebih cerdas.',
    statValue: '99.9%',
    statDesc: 'akurasi pencatatan transaksi',
  },
  {
    id: 'payment',
    number: '03.',
    title: 'Integrasi & Pembayaran',
    tag: 'Pembayaran',
    highlight: 'Semua metode pembayaran dalam satu sistem.',
    descLeft: 'Terima tunai, QRIS, transfer bank, dan dompet digital dalam satu sistem. Terintegrasi dengan printer struk dan scanner barcode — tanpa konfigurasi rumit.',
    features: [
      { label: 'QRIS & dompet digital', desc: 'GoPay, OVO, Dana, dan semua QRIS terintegrasi langsung.' },
      { label: 'Split bill & diskon fleksibel', desc: 'Bagi tagihan ke beberapa pelanggan atau terapkan diskon per item.' },
      { label: 'Rekonsiliasi otomatis', desc: 'Selisih kas terdeteksi otomatis di akhir shift — audit jadi mudah.' },
    ],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&fit=crop',
    imageAlt: 'Sistem pembayaran kasir modern',
    quote: 'Semua metode pembayaran pelanggan terlayani — tanpa bingung, tanpa antrian menumpuk.',
    statValue: '10+',
    statDesc: 'metode pembayaran terintegrasi',
  },
]

onMounted(async () => {
  ctx = await runLandingGsap(containerRef.value, ({
    mm,
    motion,
    revealInstant,
    revealOnScroll,
    revealFade,
    bindScrollAccordionStack,
  }) => {
    const allTargets = [
      '.plat-left', '.plat-badge', '.plat-reveal-item',
      '.plat-marquee-reveal', '.plat-acc-row', '.plat-divider',
    ]

    mm.add('(prefers-reduced-motion: reduce)', () => {
      scrollAccordion.value = false
      revealInstant(allTargets)
    })

    const animateSection = (y: number) => {
      revealFade('.plat-badge', '.plat-badge')
      revealOnScroll('.plat-left', '.plat-left', { y })

      if (headerRef.value) {
        revealOnScroll('.plat-reveal-item', headerRef.value, {
          y,
          stagger: motion.stagger.normal,
          delay: 0.08,
        })
      }

      revealOnScroll('.plat-marquee-reveal', '.plat-marquee-reveal', { y: motion.y.sm })

      if (accListRef.value) {
        revealOnScroll('.plat-acc-row', accListRef.value, {
          y,
          stagger: motion.stagger.loose,
          start: motion.scroll.section,
        })
        revealFade('.plat-divider', accListRef.value, {
          start: motion.scroll.section,
          delay: 0.12,
        })
      }
    }

    const setupScrollDrivenAccordion = () => {
      scrollAccordion.value = true
      const rows = gsap.utils.toArray<HTMLElement>('.plat-acc-row', accListRef.value)
      if (!rows.length) return
      teardownScrollAccordion = bindScrollAccordionStack(rows, openItemFromScroll, { start: 'top 62%' })
    }

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
      animateSection(motion.y.md)
      setupScrollDrivenAccordion()
    })

    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 767px)', () => {
      scrollAccordion.value = false
      animateSection(motion.y.sm)
    })
  })
})

onUnmounted(() => {
  teardownScrollAccordion?.()
  ctx?.revert()
})
</script>

<style scoped>
/* ── Accordion panel ──────────────────────────────────────── */
.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
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

/* ── Marquee strip ────────────────────────────────────────── */
.plat-marquee-wrap {
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 13px 0;
  margin-bottom: 0;
}

.plat-marquee-inner {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  white-space: nowrap;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  animation: plat-marquee 28s linear infinite;
  will-change: transform;
}

.plat-dot {
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 400;
}

@keyframes plat-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .plat-marquee-inner {
    animation-play-state: paused;
  }
}
</style>
