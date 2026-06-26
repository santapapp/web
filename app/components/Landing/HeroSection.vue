<template>
  <section
    ref="containerRef"
    class="relative mx-3 my-3 md:mx-5 rounded-2xl overflow-hidden
           h-[calc(100dvh-24px)]
           flex flex-col"
    aria-label="Santap Hero"
  >
    <!-- ── Background ──────────────────────────────────────── -->
    <div class="absolute inset-0 z-0" aria-hidden="true">
      <img
        ref="bgImgRef"
        class="w-full h-full object-cover object-[center_40%] block hero-bg-img"
        src="/images/landing-hero.jpg"
        alt=""
        loading="eager"
        fetchpriority="high"
      />
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to top,
          rgba(12, 9, 6, 0.97) 0%,
          rgba(12, 9, 6, 0.78) 35%,
          rgba(12, 9, 6, 0.3) 65%,
          rgba(12, 9, 6, 0.05) 100%)"
      />
      <div
        class="absolute inset-0"
        style="background: radial-gradient(circle at 10% 80%, rgba(12, 9, 6, 0.85) 0%, transparent 60%)"
      />
    </div>

    <!-- Ambient layer — subtle, almost static -->
    <div class="hero-ambient" aria-hidden="true">
      <div class="hero-ambient__grid" />
      <div class="hero-ambient__glow" />
      <div class="hero-ambient__grain" />
    </div>

    <div
      class="relative z-10 flex-1 flex flex-col justify-end
             px-5 pb-8 sm:px-7 sm:pb-10 md:px-10 md:pb-12
             max-w-[1400px] w-full mx-auto"
    >
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

        <div class="max-w-[640px]">
          <div class="mb-5">
            <h1
              class="m-0 font-bold !text-white drop-shadow-lg"
              style="
                font-family: 'Fraunces', Georgia, serif;
                font-size: clamp(42px, 8.5vw, 88px);
                line-height: 1.02;
                letter-spacing: -0.025em;
              "
            >
              <span class="hero-line-wrap block overflow-hidden relative">
                <span ref="curtain1Ref" class="hero-curtain hero-curtain--dark" aria-hidden="true" />
                <span ref="text1Ref" class="hero-text-inner block">Kasir modern,</span>
              </span>
              <span class="hero-line-wrap block overflow-hidden relative">
                <span ref="curtain2Ref" class="hero-curtain hero-curtain--accent" aria-hidden="true" />
                <span
                  ref="text2Ref"
                  class="hero-text-inner block"
                  style="
                    background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  "
                >mudah &amp; efisien.</span>
              </span>
            </h1>
          </div>

          <div ref="subtitleRef" class="hero-sub">
            <p
              class="m-0 mb-6 lg:mb-0 leading-[1.65] !text-white/75 drop-shadow-md"
              style="font-size: 15.5px; font-weight: 350; letter-spacing: 0.01em;"
            >
              Aplikasi mobile POS dirancang khusus untuk bisnis kuliner Indonesia.<br class="hidden sm:block">
              Kelola pesanan, proses pembayaran, dan pantau laporan dari mana saja.
            </p>
          </div>
        </div>

        <div ref="ctaRef" class="hero-cta flex flex-col items-start lg:items-end">
          <div class="flex items-center gap-3 mb-4">
            <NuxtLink
              class="motion-btn inline-flex items-center px-7 py-3.5
                     bg-[#18140F]/95 !text-white border border-white/[0.15]
                     no-underline rounded-full
                     text-[11px] font-bold uppercase tracking-[0.09em]
                     hover:bg-[#221C15] shadow-lg"
              to="https://play.google.com/store/apps/details?id=com.santap.pos"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unduh di Play Store
            </NuxtLink>

            <NuxtLink
              class="motion-btn inline-flex items-center justify-center w-[46px] h-[46px] rounded-full
                     bg-[var(--color-primary)] text-white no-underline flex-shrink-0 shadow-lg
                     hover:bg-[var(--color-primary-dark)]"
              to="/features"
              aria-label="Pelajari Fitur"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
          </div>

          <p class="inline-flex items-center gap-1.5 m-0 text-[11px] text-white/50 tracking-[0.02em] font-medium drop-shadow-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" stroke-width="1.8"/>
              <circle cx="12" cy="18" r="1" fill="currentColor"/>
            </svg>
            Hanya tersedia di Android 
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { runLandingGsap } from '~/composables/useLandingGsap'
import { santapEase, santapMotion } from '~/composables/useSantapMotion'

const containerRef = ref<HTMLElement | null>(null)
const bgImgRef = ref<HTMLImageElement | null>(null)
const curtain1Ref = ref<HTMLElement | null>(null)
const curtain2Ref = ref<HTMLElement | null>(null)
const text1Ref = ref<HTMLElement | null>(null)
const text2Ref = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

let ctx: { revert: () => void } | null = null

function playHeroEntrance(gsap: typeof import('gsap').gsap) {
  const curtains = [curtain1Ref.value, curtain2Ref.value].filter((c): c is HTMLElement => !!c)
  const texts = [text1Ref.value, text2Ref.value].filter((t): t is HTMLElement => !!t)
  const y = santapMotion.y.md

  gsap.set(curtains, { position: 'absolute', inset: 0, zIndex: 2, yPercent: 0 })
  gsap.set(texts, { opacity: 0, y })
  if (subtitleRef.value) gsap.set(subtitleRef.value, { opacity: 0, y })
  if (ctaRef.value) gsap.set(ctaRef.value, { opacity: 0, y })

  const tl = gsap.timeline({ delay: 0.12 })

  curtains.forEach((curtain, i) => {
    const text = texts[i]
    const offset = i * santapMotion.stagger.tight
    if (curtain) {
      tl.to(curtain, { yPercent: 110, duration: 0.72, ease: santapEase }, offset)
    }
    if (text) {
      tl.to(text, { opacity: 1, y: 0, duration: 0.62, ease: santapEase }, offset + 0.04)
    }
  })

  if (subtitleRef.value) {
    tl.to(subtitleRef.value, { opacity: 1, y: 0, duration: 0.55, ease: santapEase }, '-=0.4')
  }
  if (ctaRef.value) {
    tl.to(ctaRef.value, { opacity: 1, y: 0, duration: 0.5, ease: santapEase }, '-=0.38')
  }

  if (bgImgRef.value) {
    gsap.fromTo(
      bgImgRef.value,
      { opacity: 0.88 },
      { opacity: 1, duration: santapMotion.duration.hero, ease: santapEase },
    )
  }
}

onMounted(async () => {
  ctx = await runLandingGsap(containerRef.value, ({ gsap, mm, revealInstant }) => {
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([curtain1Ref.value, curtain2Ref.value], { display: 'none' })
      revealInstant([text1Ref.value, text2Ref.value, subtitleRef.value, ctaRef.value, bgImgRef.value])
    })

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      playHeroEntrance(gsap)
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.hero-curtain {
  display: block;
  position: absolute;
  inset: 0;
  z-index: 2;
  transform-origin: top center;
  will-change: transform;
}

.hero-curtain--dark {
  background-color: rgba(12, 9, 6, 1);
}

.hero-curtain--accent {
  background-color: #c45e0f;
}

.hero-text-inner {
  position: relative;
  z-index: 1;
  will-change: transform, opacity;
}

.hero-line-wrap {
  position: relative;
  padding-bottom: 0.06em;
}

.hero-bg-img {
  transform: scale(1.02);
  transform-origin: center center;
}
</style>
