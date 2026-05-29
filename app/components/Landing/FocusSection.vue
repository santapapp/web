<template>
  <!-- Dark section with dramatic animations -->
  <section
    ref="containerRef"
    class="relative overflow-hidden"
    style="background-color: #111009;"
    aria-label="Fokus Kami"
  >
    <!-- ── Subtle background texture ─────────────────────── -->
    <div class="focus-orb-wrap absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="focus-orb-1 focus-ambient-orb absolute"
        style="width: 60%; height: 60%; top: -20%; left: -10%; background: radial-gradient(circle, rgba(232,119,34,0.06) 0%, transparent 70%); border-radius: 50%;"
      ></div>
      <div
        class="focus-orb-2 focus-ambient-orb absolute"
        style="width: 50%; height: 50%; bottom: -15%; right: -5%; background: radial-gradient(circle, rgba(232,119,34,0.04) 0%, transparent 70%); border-radius: 50%;"
      ></div>
    </div>

    <div class="relative z-10 px-5 md:px-10 lg:px-16 py-24 md:py-32 max-w-[1400px] mx-auto">

      <!-- ── Header row ─────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-16 md:mb-20">

        <!-- Badge -->
        <div class="focus-left lg:col-span-4 flex items-start">
          <div
            class="focus-badge inline-flex items-center gap-3 px-4 py-2 rounded-md border"
            style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
          >
            <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Fokus Kami</span>
          </div>
        </div>

        <div class="lg:col-span-8">
          <AppScrollLineCurtain
            heading-class="leading-[1.08] tracking-tight"
            :heading-style="{ fontSize: 'clamp(30px, 4.5vw, 56px)' }"
            curtain1-class="slc-curtain--dark"
            curtain2-class="slc-curtain--muted"
            scroll-start="top 78%"
          >
            <template #line1>
              <span style="color: #ffffff;">Eksklusif untuk</span>
            </template>
            <template #line2>
              <span
                style="
                  background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                "
              >bisnis F&B Indonesia.</span>
            </template>
          </AppScrollLineCurtain>
        </div>
      </div>

      <!-- ── 3 Focus Items — list with dividers ─────────────── -->
      <div ref="listRef" class="focus-list">
        <!-- Top border -->
        <div class="focus-top-border h-px" style="background-color: rgba(255,255,255,0.08); transform-origin: left;"></div>

        <div
          v-for="(focus, i) in focuses"
          :key="focus.id"
          class="focus-row"
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
                  class="focus-tag px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.1em]"
                  style="background-color: rgba(255,255,255,0.06); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.08);"
                >{{ tag }}</span>
              </div>
            </div>

          </div>
          <!-- Divider -->
          <div
            class="focus-divider h-px"
            style="background-color: rgba(255,255,255,0.08); transform-origin: left;"
          ></div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { runLandingGsap } from '~/composables/useLandingGsap'

const containerRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
let ctx: { revert: () => void } | null = null

const focuses = [
  {
    id: 'inventory',
    number: '01',
    title: 'Inventaris',
    desc: 'Kelola stok bahan baku dengan teliti. Sistem peringatan otomatis mencegah kehabisan stok di saat yang krusial.',
    tags: ['Stok Real-time', 'Multi-lokasi', 'Peringatan Otomatis'],
  },
  {
    id: 'processing',
    number: '02',
    title: 'Pemrosesan',
    desc: 'Alur pesanan dari meja ke dapur hingga kasir — semuanya tersinkronisasi real-time tanpa hambatan.',
    tags: ['Kitchen Display', 'Antrian Otomatis', 'Multi-outlet'],
  },
  {
    id: 'analytics',
    number: '03',
    title: 'Analisis Data',
    desc: 'Dapatkan wawasan dari tren penjualan untuk merencanakan promosi, menyesuaikan menu, dan optimalisasi waktu operasional.',
    tags: ['Laporan Harian', 'Tren Penjualan', 'Ekspor Data'],
  },
]

onMounted(async () => {
  ctx = await runLandingGsap(containerRef.value, ({
    mm,
    motion,
    revealInstant,
    revealOnScroll,
    revealFade,
  }) => {
    const allTargets = [
      '.focus-left', '.focus-badge',
      '.focus-top-border', '.focus-row', '.focus-divider', '.focus-tag',
    ]

    mm.add('(prefers-reduced-motion: reduce)', () => {
      revealInstant(allTargets)
    })

    const animateSection = (y: number) => {
      revealFade('.focus-badge', '.focus-badge')
      revealOnScroll('.focus-left', '.focus-left', { y })

      if (listRef.value) {
        revealFade('.focus-top-border', listRef.value, { start: motion.scroll.section })
        revealOnScroll('.focus-row', listRef.value, {
          y,
          stagger: motion.stagger.loose,
          start: motion.scroll.section,
        })
        revealFade('.focus-divider', listRef.value, { start: motion.scroll.section, delay: 0.1 })
        revealOnScroll('.focus-tag', listRef.value, {
          y: motion.y.sm,
          stagger: motion.stagger.tight,
          start: motion.scroll.item,
          delay: 0.12,
        })
      }
    }

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
      animateSection(motion.y.md)
    })

    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 767px)', () => {
      animateSection(motion.y.sm)
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.focus-divider,
.focus-top-border {
  transform-origin: left center;
}

</style>
