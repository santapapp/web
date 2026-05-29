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
        <div class="appr-left lg:col-span-4 flex items-start">
          <div
            class="appr-badge inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]"
          >
            <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Pendekatan Kami</span>
          </div>
        </div>

        <!-- Text -->
        <div ref="headerRightRef" class="lg:col-span-8">
          <AppScrollLineCurtain
            class="mb-5 max-w-[660px]"
            heading-class="leading-[1.1] tracking-tight"
            :heading-style="{ fontSize: 'clamp(26px, 3.5vw, 44px)' }"
            scroll-start="top 78%"
          >
            <template #line1>
              <span style="color: var(--color-text-primary);">Dibangun dengan</span>
            </template>
            <template #line2>
              <span
                style="
                  background: linear-gradient(100deg, var(--color-text-primary) 0%, var(--color-primary) 55%, #FFA550 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                "
              >tiga strategi inti.</span>
            </template>
          </AppScrollLineCurtain>
          <p
            class="appr-body text-[14.5px] leading-[1.7] max-w-[500px]"
            style="color: var(--color-text-secondary);"
          >
            Dirancang untuk menyederhanakan operasional restoran Anda dengan fondasi teknologi yang solid.
          </p>
        </div>
      </div>
    </div>

    <!-- ── Three Steps ────────────────────────────────────── -->
    <div ref="stepsRef" class="appr-steps-wrap px-5 md:px-10 lg:px-16 pb-24 md:pb-32 max-w-[1400px] mx-auto">

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
import { runLandingGsap } from '~/composables/useLandingGsap'

const containerRef = ref<HTMLElement | null>(null)
const headerRightRef = ref<HTMLElement | null>(null)
const stepsRef = ref<HTMLElement | null>(null)
let ctx: { revert: () => void } | null = null

const steps = [
  {
    id: 'speed',
    number: '01',
    title: 'Pemrosesan Kilat',
    desc: 'Pesanan dan pembayaran selesai dalam hitungan detik. Kerja tanpa hambatan, bahkan saat ramai.',
    tag: 'Kecepatan',
  },
  {
    id: 'accuracy',
    number: '02',
    title: 'Pantau Terpusat',
    desc: 'Kelola inventaris, pesanan, dan laporan dari seluruh cabang dalam satu dashboard.',
    tag: 'Akurasi',
  },
  {
    id: 'intelligence',
    number: '03',
    title: 'Analisis Pintar',
    desc: 'Temukan pola penjualan, jam sibuk, dan menu terlaris secara otomatis. Data yang actionable.',
    tag: 'Kecerdasan',
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
      '.appr-left', '.appr-badge', '.appr-body',
      '.appr-top-border', '.appr-step-row', '.appr-divider', '.appr-tag-pill',
    ]

    mm.add('(prefers-reduced-motion: reduce)', () => {
      revealInstant(allTargets)
    })

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
      revealFade('.appr-badge', '.appr-badge')
      revealOnScroll('.appr-left', '.appr-left', { y: motion.y.md })
      if (headerRightRef.value) {
        revealOnScroll('.appr-body', headerRightRef.value, { y: motion.y.md, delay: 0.1 })
      }
      revealFade('.appr-top-border', stepsRef.value, { start: motion.scroll.section })
      if (stepsRef.value) {
        revealOnScroll('.appr-step-row', stepsRef.value, {
          y: motion.y.md,
          stagger: motion.stagger.loose,
          start: motion.scroll.section,
        })
        revealFade('.appr-divider', stepsRef.value, { start: motion.scroll.section, delay: 0.1 })
        revealOnScroll('.appr-tag-pill', stepsRef.value, {
          y: motion.y.sm,
          stagger: motion.stagger.tight,
          start: motion.scroll.section,
          delay: 0.15,
        })
      }
    })

    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 767px)', () => {
      revealFade('.appr-badge', '.appr-badge')
      revealOnScroll('.appr-left', '.appr-left', { y: motion.y.sm })
      if (headerRightRef.value) {
        revealOnScroll('.appr-body', headerRightRef.value, { y: motion.y.sm })
      }
      if (stepsRef.value) {
        revealFade('.appr-top-border', stepsRef.value)
        revealOnScroll('.appr-step-row', stepsRef.value, { y: motion.y.sm, stagger: motion.stagger.normal })
        revealFade('.appr-divider', stepsRef.value, { delay: 0.08 })
        revealOnScroll('.appr-tag-pill', stepsRef.value, { y: motion.y.sm, stagger: motion.stagger.tight })
      }
    })
  })
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
