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
        class="focus-orb-1 absolute"
        style="width: 60%; height: 60%; top: -20%; left: -10%; background: radial-gradient(circle, rgba(232,119,34,0.06) 0%, transparent 70%); border-radius: 50%;"
      ></div>
      <div
        class="focus-orb-2 absolute"
        style="width: 50%; height: 50%; bottom: -15%; right: -5%; background: radial-gradient(circle, rgba(232,119,34,0.04) 0%, transparent 70%); border-radius: 50%;"
      ></div>
    </div>

    <div class="relative z-10 px-5 md:px-10 lg:px-16 py-24 md:py-32 max-w-[1400px] mx-auto">

      <!-- ── Header row ─────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-16 md:mb-20">

        <!-- Badge -->
        <div class="lg:col-span-4 flex items-start">
          <div
            class="focus-badge inline-flex items-center gap-3 px-4 py-2 rounded-md border"
            style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); clip-path: inset(0 100% 0 0)"
          >
            <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Fokus Kami</span>
          </div>
        </div>

        <!-- Heading: split lines for opposite-direction horizontal scroll -->
        <div class="lg:col-span-8 focus-heading-area overflow-hidden">
          <!-- Line 1: tracks left → right as you scroll down -->
          <h2
            class="focus-h2-top font-medium leading-[1.08] tracking-tight"
            style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF;"
          >
            Fokus operasional eksklusif untuk
          </h2>
          <!-- Line 2: tracks right → left (opposite), dimmed -->
          <h2
            class="focus-h2-bottom font-medium leading-[1.08] tracking-tight"
            style="font-size: clamp(30px, 4.5vw, 56px); color: rgba(255,255,255,0.32);"
          >
            bisnis F&amp;B Indonesia.
          </h2>
        </div>
      </div>

      <!-- ── 3 Focus Items — list with dividers ─────────────── -->
      <div class="focus-list">
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

const containerRef = ref<HTMLElement | null>(null)
let ctx: any = null

const focuses = [
  {
    id: 'inventory',
    number: '01',
    title: 'Inventaris',
    desc: 'Kelola stok bahan baku dengan presisi tingkat tinggi. Sistem peringatan otomatis memastikan Anda tidak pernah kehabisan stok di waktu yang paling krusial.',
    tags: ['Stok Real-time', 'Multi-lokasi', 'Peringatan Otomatis'],
  },
  {
    id: 'processing',
    number: '02',
    title: 'Pemrosesan',
    desc: 'Alur pesanan terintegrasi dari meja ke dapur hingga ke kasir. Semua tersinkronisasi secara real-time tanpa hambatan, tanpa kertas, tanpa kesalahan.',
    tags: ['Kitchen Display', 'Antrian Otomatis', 'Multi-outlet'],
  },
  {
    id: 'analytics',
    number: '03',
    title: 'Analisis Data',
    desc: 'Dapatkan wawasan berharga dari tren penjualan harian Anda untuk merencanakan promosi, menyesuaikan menu, dan mengoptimalkan waktu operasional secara sistematis.',
    tags: ['Laporan Harian', 'Tren Penjualan', 'Ekspor Data'],
  },
]

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // ── Badge clip-wipe ───────────────────────────────────
      gsap.to('.focus-badge', {
        scrollTrigger: { trigger: '.focus-badge', start: 'top 88%' },
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.85,
        ease: 'power3.out',
      })

      // ── H2 opposite-direction horizontal tracking on scroll
      // Line 1: starts +6% right, moves to -4% left (slower)
      gsap.fromTo('.focus-h2-top', { x: '6%' }, {
        scrollTrigger: {
          trigger: '.focus-heading-area',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
        x: '-4%',
        ease: 'none',
      })
      // Line 2: starts -6% left, moves to +4% right (opposite)
      gsap.fromTo('.focus-h2-bottom', { x: '-6%' }, {
        scrollTrigger: {
          trigger: '.focus-heading-area',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
        x: '4%',
        ease: 'none',
      })

      // ── Top border scaleX wipe ────────────────────────────
      gsap.set('.focus-top-border', { scaleX: 0 })
      gsap.to('.focus-top-border', {
        scrollTrigger: { trigger: '.focus-list', start: 'top 85%' },
        scaleX: 1,
        duration: 1.0,
        ease: 'power3.inOut',
      })

      // ── Rows: stagger fade-slide up ───────────────────────
      gsap.set('.focus-row', { opacity: 0, y: 32 })
      gsap.to('.focus-row', {
        scrollTrigger: { trigger: '.focus-list', start: 'top 82%' },
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power3.out',
      })

      // ── Dividers scaleX ───────────────────────────────────
      gsap.set('.focus-divider', { scaleX: 0 })
      gsap.to('.focus-divider', {
        scrollTrigger: { trigger: '.focus-list', start: 'top 82%' },
        scaleX: 1,
        duration: 0.9,
        stagger: 0.15,
        delay: 0.2,
        ease: 'power3.inOut',
      })

      // ── Tag pills: scale bounce ───────────────────────────
      gsap.set('.focus-tag', { scale: 0.75, opacity: 0 })
      gsap.to('.focus-tag', {
        scrollTrigger: { trigger: '.focus-list', start: 'top 82%' },
        scale: 1,
        opacity: 1,
        duration: 0.55,
        stagger: 0.05,
        delay: 0.5,
        ease: 'back.out(2)',
      })

      // ── Background orbs subtle parallax ──────────────────
      gsap.to('.focus-orb-1', {
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
        y: '-15%',
        x: '5%',
        ease: 'none',
      })
      gsap.to('.focus-orb-2', {
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
        y: '12%',
        x: '-5%',
        ease: 'none',
      })
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([
        '.focus-badge', '.focus-h2-top', '.focus-h2-bottom',
        '.focus-top-border', '.focus-row', '.focus-divider', '.focus-tag',
        '.focus-orb-1', '.focus-orb-2',
      ], {
        clipPath: 'none', opacity: 1, x: 0, y: 0,
        scaleX: 1, scale: 1, clearProps: 'all',
      })
    })
  }, containerRef.value ?? undefined)
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

/* Ensure heading area clips the horizontal movement */
.focus-heading-area {
  overflow: hidden;
}
</style>
