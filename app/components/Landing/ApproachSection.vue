<template>
  <section
    ref="containerRef"
    class="relative bg-[var(--color-bg-page)]"
    aria-label="Pendekatan Kami"
  >
    <!-- ── Header ──────────────────────────────────────────── -->
    <div class="px-5 md:px-10 lg:px-16 pt-24 md:pt-32 pb-20 md:pb-24 max-w-[1400px] mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

        <!-- Badge -->
        <div class="lg:col-span-4 flex items-start">
          <div
            class="appr-badge inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]"
            style="clip-path: inset(0 100% 0 0)"
          >
            <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Pendekatan Kami</span>
          </div>
        </div>

        <!-- Text -->
        <div class="lg:col-span-8">
          <div class="overflow-hidden mb-5">
            <h2
              class="appr-h2 font-medium leading-[1.1] tracking-tight max-w-[660px]"
              style="font-size: clamp(26px, 3.5vw, 44px); color: var(--color-text-primary);"
            >
              Efisiensi bisnis yang dibangun pada tiga strategi inti.
            </h2>
          </div>
          <p
            class="appr-body text-[14.5px] leading-[1.7] max-w-[500px]"
            style="color: var(--color-text-secondary);"
          >
            Masing-masing dirancang untuk menyederhanakan operasional restoran — dan bersama-sama, ketiganya membentuk fondasi teknologi yang solid.
          </p>
        </div>
      </div>
    </div>

    <!-- ── Three Steps ────────────────────────────────────── -->
    <div class="appr-steps-wrap px-5 md:px-10 lg:px-16 pb-24 md:pb-32 max-w-[1400px] mx-auto">

      <!-- Top border with wipe animation -->
      <div class="appr-top-border h-px mb-0" style="background-color: var(--color-border); transform-origin: left;"></div>

      <div
        v-for="(step, i) in steps"
        :key="step.id"
        class="appr-step-row"
      >
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-12 md:py-16 items-start">

          <!-- Col 1: Number -->
          <div class="md:col-span-1">
            <span
              class="font-medium tabular-nums"
              style="font-size: 13px; color: var(--color-text-tertiary); letter-spacing: 0.04em;"
            >{{ step.number }}</span>
          </div>

          <!-- Col 2: Title -->
          <div class="md:col-span-4">
            <h3
              class="font-medium tracking-tight leading-[1.1]"
              style="font-size: clamp(22px, 2.5vw, 32px); color: var(--color-text-primary);"
            >{{ step.title }}</h3>
          </div>

          <!-- Col 3: Description -->
          <div class="md:col-span-4">
            <p class="text-[14.5px] leading-[1.7]" style="color: var(--color-text-secondary);">
              {{ step.desc }}
            </p>
          </div>

          <!-- Col 4: Tag pill -->
          <div class="md:col-span-3 flex md:justify-end items-start">
            <span
              class="appr-tag-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em]"
              style="background-color: var(--color-primary-light); color: var(--color-primary);"
            >
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background-color: var(--color-primary);"></span>
              {{ step.tag }}
            </span>
          </div>

        </div>
        <!-- Divider -->
        <div
          class="appr-divider h-px"
          style="background-color: var(--color-border); transform-origin: left;"
        ></div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
let ctx: any = null

const steps = [
  {
    id: 'speed',
    number: '01',
    title: 'Pemrosesan Kilat',
    desc: 'Selesaikan pesanan dan pembayaran dalam hitungan detik. Antarmuka yang intuitif memungkinkan kasir bekerja tanpa hambatan, bahkan di jam sibuk puncak.',
    tag: 'Kecepatan',
  },
  {
    id: 'accuracy',
    number: '02',
    title: 'Pantau Terpusat',
    desc: 'Lacak inventaris, pesanan, dan laporan dari seluruh cabang dalam satu dashboard. Tidak ada data yang tertinggal, tidak ada kesalahan pencatatan.',
    tag: 'Akurasi',
  },
  {
    id: 'intelligence',
    number: '03',
    title: 'Analisis Pintar',
    desc: 'Temukan pola penjualan, jam tersibuk, dan menu terlaris secara otomatis. Data yang bekerja untuk Anda — bukan sebaliknya.',
    tag: 'Kecerdasan',
  },
]

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // ── Badge clip-path wipe ──────────────────────────────
      gsap.to('.appr-badge', {
        scrollTrigger: { trigger: '.appr-badge', start: 'top 88%' },
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.8,
        ease: 'power3.out',
      })

      // ── H2 push-up from clip ──────────────────────────────
      gsap.set('.appr-h2', { yPercent: 110 })
      gsap.to('.appr-h2', {
        scrollTrigger: { trigger: '.appr-h2', start: 'top 88%' },
        yPercent: 0,
        duration: 1.0,
        ease: 'power4.out',
      })

      // ── Body paragraph fade ───────────────────────────────
      gsap.set('.appr-body', { opacity: 0, y: 20 })
      gsap.to('.appr-body', {
        scrollTrigger: { trigger: '.appr-body', start: 'top 90%' },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      // ── Top border scaleX wipe ────────────────────────────
      gsap.set('.appr-top-border', { scaleX: 0 })
      gsap.to('.appr-top-border', {
        scrollTrigger: { trigger: '.appr-steps-wrap', start: 'top 85%' },
        scaleX: 1,
        duration: 1.0,
        ease: 'power3.inOut',
      })

      // ── Step rows: stagger slide from left ────────────────
      gsap.set('.appr-step-row', { opacity: 0, x: -50 })
      gsap.to('.appr-step-row', {
        scrollTrigger: { trigger: '.appr-steps-wrap', start: 'top 80%' },
        opacity: 1,
        x: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
      })

      // ── Dividers: scaleX wipe, delayed after rows ─────────
      gsap.set('.appr-divider', { scaleX: 0 })
      gsap.to('.appr-divider', {
        scrollTrigger: { trigger: '.appr-steps-wrap', start: 'top 80%' },
        scaleX: 1,
        duration: 0.9,
        stagger: 0.14,
        delay: 0.2,
        ease: 'power3.inOut',
      })

      // ── Tag pills: scale spring bounce ────────────────────
      gsap.set('.appr-tag-pill', { scale: 0.7, opacity: 0 })
      gsap.to('.appr-tag-pill', {
        scrollTrigger: { trigger: '.appr-steps-wrap', start: 'top 80%' },
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.14,
        delay: 0.35,
        ease: 'back.out(1.8)',
      })
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([
        '.appr-badge', '.appr-h2', '.appr-body',
        '.appr-top-border', '.appr-step-row', '.appr-divider', '.appr-tag-pill',
      ], {
        clipPath: 'none', opacity: 1, yPercent: 0, y: 0,
        x: 0, scaleX: 1, scale: 1, clearProps: 'all',
      })
    })
  }, containerRef.value ?? undefined)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.appr-divider {
  transform-origin: left center;
}
.appr-top-border {
  transform-origin: left center;
}
</style>
