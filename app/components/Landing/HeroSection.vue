<template>
  <!--
    my-3 = 12px top + 12px bottom margin
    h-[calc(100dvh-24px)] = full viewport height minus the my-3 margins
  -->
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
        class="w-full h-full object-cover object-[center_40%] block"
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85&fit=crop"
        alt=""
        loading="eager"
        fetchpriority="high"
      />
      <!-- Gradient overlay: dark bottom + left for readability -->
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

    <!-- ── Content: bottom-anchored ──────────────────────── -->
    <div
      class="relative z-10 flex-1 flex flex-col justify-end
             px-5 pb-8 sm:px-7 sm:pb-10 md:px-10 md:pb-12
             max-w-[1400px] w-full mx-auto"
    >
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

        <!-- Left: Headline & Subtitle -->
        <div class="max-w-[640px]">

          <!-- Headline — each line has its own curtain mask -->
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
              <!-- Line 1 -->
              <span class="hero-line-wrap block overflow-hidden relative">
                <span ref="curtain1Ref" class="hero-curtain hero-curtain--dark" aria-hidden="true" />
                <span ref="text1Ref" class="hero-text-inner block">Kasir modern,</span>
              </span>

              <!-- Line 2 -->
              <span class="hero-line-wrap block overflow-hidden relative">
                <span ref="curtain2Ref" class="hero-curtain hero-curtain--orange" aria-hidden="true" />
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

          <!-- Subtitle -->
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

        <!-- Right: CTA buttons & platform note -->
        <div ref="ctaRef" class="hero-cta flex flex-col items-start lg:items-end">
          <!-- CTA buttons -->
          <div class="flex items-center gap-3 mb-4">
            <NuxtLink
              class="inline-flex items-center px-7 py-3.5
                     bg-[#18140F]/95 backdrop-blur-md !text-white border border-white/[0.15]
                     no-underline rounded-full
                     text-[11px] font-bold uppercase tracking-[0.09em]
                     transition-all duration-150 hover:bg-[#221C15] hover:-translate-y-px shadow-lg"
              to="/#"
            >
              Segera Hadir
            </NuxtLink>

            <NuxtLink
              class="inline-flex items-center justify-center w-[46px] h-[46px] rounded-full
                     bg-[var(--color-primary)] text-white no-underline flex-shrink-0
                     transition-all duration-150 shadow-lg
                     hover:bg-[var(--color-primary-dark)] hover:-translate-y-px"
              to="/features"
              aria-label="Pelajari Fitur"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
          </div>

          <!-- Platform note -->
          <p class="inline-flex items-center gap-1.5 m-0 text-[11px] text-white/50 tracking-[0.02em] font-medium drop-shadow-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" stroke-width="1.8"/>
              <circle cx="12" cy="18" r="1" fill="currentColor"/>
            </svg>
            Android &amp; iOS — segera hadir
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const bgImgRef     = ref<HTMLImageElement | null>(null)

// Per-line curtain overlay refs
const curtain1Ref  = ref<HTMLElement | null>(null)
const curtain2Ref  = ref<HTMLElement | null>(null)

// Per-line text inner refs
const text1Ref     = ref<HTMLElement | null>(null)
const text2Ref     = ref<HTMLElement | null>(null)

// Other element refs
const subtitleRef  = ref<HTMLElement | null>(null)
const ctaRef       = ref<HTMLElement | null>(null)

let ctx: any = null

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    // ── Full motion ──────────────────────────────────────────────────────────
    mm.add('(prefers-reduced-motion: no-preference)', () => {

      const curtains = [curtain1Ref.value, curtain2Ref.value]
      const texts    = [text1Ref.value,    text2Ref.value]

      // ── Set initial states ─────────────────────────────────────────────────
      // Curtain blocks: positioned to fully cover each line (starts at top)
      gsap.set(curtains, {
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        // color is set per curtain via CSS classes below
        yPercent: 0,
      })

      // Text: starts slightly below and invisible
      gsap.set(texts, { opacity: 0, y: 18 })

      // Support elements
      gsap.set(subtitleRef.value, { opacity: 0, y: 24 })
      gsap.set(ctaRef.value,      { opacity: 0, y: 20 })

      // ── Master timeline ────────────────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.25 })

      // Stagger each line: curtain slides DOWN and out, text rises into view
      curtains.forEach((curtain, i) => {
        const text   = texts[i]
        const offset = i * 0.18           // stagger offset per line

        // Curtain slides downward and exits — 110% pushes it fully below the clip
        tl.to(curtain, {
          yPercent: 110,
          duration: 1.35,
          ease: 'power4.out',
        }, offset)

        // Text rises + fades in simultaneously with curtain slide
        tl.to(text, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power4.out',
        }, offset + 0.05)   // tiny delay so text begins just after curtain starts moving
      })

      // Subtitle fades up after last curtain finishes
      tl.to(subtitleRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: 'power3.out',
      }, '-=0.6')

      // CTA follows subtitle
      tl.to(ctaRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
      }, '-=0.55')

      // ── Background: subtle fade in ─────────────────────────────────────────
      if (bgImgRef.value) {
        gsap.fromTo(
          bgImgRef.value,
          { opacity: 0.55, filter: 'brightness(0.75)' },
          { opacity: 1, filter: 'brightness(1)', duration: 2.4, ease: 'power2.out' }
        )
      }

      // ── Parallax scroll ────────────────────────────────────────────────────
      if (bgImgRef.value) {
        gsap.to(bgImgRef.value, {
          scrollTrigger: {
            trigger: containerRef.value,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
          yPercent: 22,
          ease: 'none',
        })
      }
    })

    // ── Reduced motion: skip all animation, reveal immediately ──────────────
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(
        [curtain1Ref.value, curtain2Ref.value],
        { display: 'none' }
      )
      gsap.set(
        [text1Ref.value, text2Ref.value, subtitleRef.value, ctaRef.value],
        { opacity: 1, y: 0, clearProps: 'all' }
      )
    })

  }, containerRef.value ?? undefined)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
/* Curtain overlay — absolutely positioned inside the overflow-hidden line wrapper */
.hero-curtain {
  display: block;
  position: absolute;
  inset: 0;
  z-index: 2;
  transform-origin: top center;
  will-change: transform;
}

/* Line 1: near-black curtain */
.hero-curtain--dark {
  background-color: rgba(12, 9, 6, 1);
}

/* Line 2: orange accent curtain — mirrors the gradient text on that line */
.hero-curtain--orange {
  background-color: #E8712A;
}

/* Text sits above the curtain baseline but below the curtain overlay */
.hero-text-inner {
  position: relative;
  z-index: 1;
  will-change: transform, opacity;
}

/* Line wrapper must be positioned so the absolute curtain is scoped to it */
.hero-line-wrap {
  position: relative;
  /* Small extra padding so text descenders aren't clipped */
  padding-bottom: 0.06em;
}
</style>
