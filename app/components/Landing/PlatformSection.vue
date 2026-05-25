<template>
  <section ref="containerRef" class="bg-[var(--color-bg-page)]" aria-label="Platform Terpadu">

    <!-- ── Top Part ─────────────────────────────────────────── -->
    <div class="px-5 md:px-10 lg:px-16 pt-24 md:pt-32 pb-20 md:pb-28 max-w-[1400px] mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

        <!-- Left: Badge -->
        <div class="lg:col-span-4 flex items-start">
          <div
            class="plat-badge inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]"
            style="clip-path: inset(0 100% 0 0)"
          >
            <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Platform Terpadu</span>
          </div>
        </div>

        <!-- Right: Content -->
        <div class="lg:col-span-8 flex flex-col items-start">

          <!-- H2: line-by-line clip reveal -->
          <div class="mb-10" style="font-size: clamp(30px, 4.5vw, 58px);">
            <div class="overflow-hidden">
              <h2
                class="plat-h2-line1 font-medium leading-[1.07] tracking-[-0.02em] max-w-[820px]"
                style="font-size: clamp(30px, 4.5vw, 58px); color: var(--color-text-primary);"
              >
                Menyatukan operasional, pembayaran,
              </h2>
            </div>
            <div class="overflow-hidden">
              <h2
                class="plat-h2-line2 font-medium leading-[1.07] tracking-[-0.02em] max-w-[820px]"
                style="font-size: clamp(30px, 4.5vw, 58px); color: var(--color-text-primary);"
              >
                dan laporan menjadi
                <span style="color: var(--color-text-secondary); font-style: italic;"> satu ekosistem kasir.</span>
              </h2>
            </div>
          </div>

          <p
            class="plat-body text-[14.5px] leading-[1.75] max-w-[580px]"
            style="color: var(--color-text-secondary); margin-bottom: 56px;"
          >
            Platform kami memungkinkan kendali presisi atas pesanan dan pembayaran — menghasilkan data akurat yang membuka peluang penjualan tak terbatas.
          </p>

          <!-- Buttons -->
          <div class="plat-btns flex items-center gap-3">
            <NuxtLink
              to="/features"
              class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                     text-[11px] font-bold uppercase tracking-[0.1em]
                     no-underline transition-all duration-150 hover:-translate-y-px shadow-sm"
              style="background-color: var(--color-text-primary); color: #FFFFFF;"
            >
              Pelajari Fitur
            </NuxtLink>
            <NuxtLink
              to="/features"
              class="inline-flex items-center justify-center w-11 h-11 rounded-full
                     no-underline flex-shrink-0 transition-all duration-150
                     hover:-translate-y-px shadow-sm"
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
    <div class="plat-marquee-wrap" aria-hidden="true">
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

      <div class="plat-acc-list">
        <div v-for="(item, i) in accordionItems" :key="item.id" class="plat-acc-row">

          <!-- ── Trigger Row ──────────────────────────────────── -->
          <button
            class="accordion-trigger w-full flex items-center justify-between gap-6
                   bg-transparent border-none cursor-pointer text-left
                   transition-all duration-250"
            :class="[
              openIndex !== null && openIndex !== i
                ? 'opacity-35 hover:opacity-60'
                : 'opacity-100',
              openIndex === i ? 'pt-12 md:pt-16 pb-8 md:pb-10' : 'py-10 md:py-14'
            ]"
            :aria-expanded="openIndex === i"
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
              <template v-if="openIndex === i">
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
            class="accordion-panel"
            :class="openIndex === i ? 'panel-open' : ''"
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

const containerRef = ref<HTMLElement | null>(null)
let ctx: any = null

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}

const accordionItems = [
  {
    id: 'order',
    number: '01.',
    title: 'Manajemen Pesanan',
    tag: 'Core Feature',
    highlight: 'Dari meja ke dapur dalam hitungan detik — tanpa kertas, tanpa kesalahan.',
    descLeft: 'Catat pesanan dari meja, takeaway, atau delivery dalam satu antarmuka yang intuitif. Pesanan langsung tersinkronisasi ke dapur secara real-time — tidak ada yang terlewat, tidak ada kesalahan pencatatan.',
    features: [
      { label: 'Multi-tipe pesanan', desc: 'Dine-in, takeaway, dan delivery dikelola dari satu layar.' },
      { label: 'Sinkronisasi dapur real-time', desc: 'Kitchen display terupdate otomatis saat pesanan masuk.' },
      { label: 'Modifikasi & catatan khusus', desc: 'Tambah catatan per item atau ubah pesanan kapan saja sebelum diproses.' },
    ],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&fit=crop',
    imageAlt: 'Suasana restoran modern',
    quote: 'Tidak ada pesanan yang terlewat. Semua tersinkronisasi otomatis dari meja ke dapur.',
    statValue: '< 30 dtk',
    statDesc: 'rata-rata dari input menu ke dapur',
  },
  {
    id: 'report',
    number: '02.',
    title: 'Laporan Real-time',
    tag: 'Analitik',
    highlight: 'Keputusan bisnis yang lebih cerdas, didukung data aktual.',
    descLeft: 'Pantau performa penjualan harian, mingguan, dan bulanan langsung dari smartphone. Dashboard intuitif menyajikan data penting — omzet, produk terlaris, dan jam sibuk — dalam satu tampilan.',
    features: [
      { label: 'Dashboard omzet harian', desc: 'Lihat total penjualan, jumlah transaksi, dan rata-rata per meja hari ini.' },
      { label: 'Produk & kategori terlaris', desc: 'Temukan menu apa yang paling diminati dan kapan puncak penjualannya.' },
      { label: 'Ekspor laporan otomatis', desc: 'Unduh laporan dalam format PDF atau Excel untuk keperluan akunting.' },
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fit=crop',
    imageAlt: 'Dashboard analitik bisnis',
    quote: 'Data penjualan yang selalu aktual membantu saya mengambil keputusan tanpa tebak-tebakan.',
    statValue: '99.9%',
    statDesc: 'akurasi pencatatan transaksi harian',
  },
  {
    id: 'payment',
    number: '03.',
    title: 'Integrasi & Pembayaran',
    tag: 'Pembayaran',
    highlight: 'Semua metode pembayaran, satu sistem terpadu.',
    descLeft: 'Terima pembayaran via tunai, QRIS, transfer bank, dan dompet digital dalam satu sistem. Integrasi dengan printer struk termal dan scanner barcode tanpa konfigurasi rumit.',
    features: [
      { label: 'QRIS & dompet digital', desc: 'GoPay, OVO, Dana, dan semua QRIS terintegrasi langsung tanpa perangkat tambahan.' },
      { label: 'Split bill & diskon fleksibel', desc: 'Bagi tagihan ke beberapa pelanggan atau terapkan diskon per item maupun total.' },
      { label: 'Rekonsiliasi otomatis', desc: 'Selisih kas terdeteksi otomatis di akhir shift — audit jadi mudah dan cepat.' },
    ],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&fit=crop',
    imageAlt: 'Sistem pembayaran kasir modern',
    quote: 'Semua metode pembayaran pelanggan terlayani — tanpa kasir bingung, tanpa antrian menumpuk.',
    statValue: '10+',
    statDesc: 'metode pembayaran terintegrasi',
  },
]

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // ── Badge: clip-path wipe from left ────────────────────
      gsap.to('.plat-badge', {
        scrollTrigger: { trigger: '.plat-badge', start: 'top 88%' },
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.8,
        ease: 'power3.out',
      })

      // ── H2: line by line push-up from clip ─────────────────
      gsap.set(['.plat-h2-line1', '.plat-h2-line2'], { yPercent: 110 })
      gsap.to(['.plat-h2-line1', '.plat-h2-line2'], {
        scrollTrigger: { trigger: '.plat-h2-line1', start: 'top 88%' },
        yPercent: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
      })

      // ── Body paragraph ──────────────────────────────────────
      gsap.set('.plat-body', { opacity: 0, y: 24 })
      gsap.to('.plat-body', {
        scrollTrigger: { trigger: '.plat-body', start: 'top 88%' },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      // ── Buttons ─────────────────────────────────────────────
      gsap.set('.plat-btns', { opacity: 0, y: 20 })
      gsap.to('.plat-btns', {
        scrollTrigger: { trigger: '.plat-btns', start: 'top 90%' },
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      })

      // ── Accordion rows: stagger slide from left ─────────────
      gsap.set('.plat-acc-row', { opacity: 0, x: -40 })
      gsap.to('.plat-acc-row', {
        scrollTrigger: { trigger: '.plat-acc-list', start: 'top 85%' },
        opacity: 1,
        x: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
      })
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(['.plat-badge', '.plat-h2-line1', '.plat-h2-line2', '.plat-body', '.plat-btns', '.plat-acc-row'], {
        clipPath: 'none',
        opacity: 1,
        yPercent: 0,
        y: 0,
        x: 0,
        clearProps: 'all',
      })
    })
  }, containerRef.value ?? undefined)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
/* ── Accordion panel ──────────────────────────────────────── */
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
