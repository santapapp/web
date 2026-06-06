<template>
  <section
    ref="sectionRef"
    class="relative bg-[var(--color-bg-page)]"
    style="min-height: 85svh; display: flex; flex-direction: column;"
    :aria-label="ariaLabel"
  >
    <div
      class="flex-1 px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto w-full
             flex flex-col justify-between pt-32 pb-16 md:pt-40 md:pb-20"
    >
      <!-- ── Overline badge ──────────────────────────────── -->
      <div ref="badgeRef" class="hero-badge mb-8 md:mb-12">
        <div class="inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]">
          <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
          <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">{{ badge }}</span>
        </div>
      </div>

      <!-- ── Main title — 2 lines with curtain reveal ──────── -->
      <div class="flex-1 flex items-center">
        <h1 class="font-medium tracking-[-0.03em] leading-[0.95]" :style="`font-size: ${titleSize};`">
          <!-- Line 1 -->
          <span class="phc-line-wrap block overflow-hidden relative">
            <span ref="curtain1Ref" class="phc-curtain" :class="curtain1Class" aria-hidden="true" />
            <span ref="text1Ref" class="phc-text block" style="color: var(--color-text-primary);">{{ line1 }}</span>
          </span>

          <!-- Line 2 -->
          <span class="phc-line-wrap block overflow-hidden relative">
            <span ref="curtain2Ref" class="phc-curtain" :class="curtain2Class" aria-hidden="true" />
            <span ref="text2Ref" class="phc-text block" style="color: var(--color-text-tertiary);">{{ line2 }}</span>
          </span>
        </h1>
      </div>

      <!-- ── Bottom row: scroll arrow (left) + subtitle (right) ── -->
      <div ref="bottomRef" class="hero-bottom flex items-end justify-between border-t pt-10 border-[var(--color-border)] mt-12">
        <!-- Scroll-down arrow -->
        <button
          v-if="scrollTarget"
          @click="scrollToContent"
          class="flex items-center justify-center rounded-xl border border-[var(--color-border)] transition-all duration-200 hover:border-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] group"
          style="width: 44px; height: 44px; color: var(--color-text-primary); cursor: pointer;"
          aria-label="Gulir ke bawah"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="transition-colors duration-200 group-hover:text-white" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div v-else />

        <!-- Subtitle text — bottom right -->
        <p
          class="text-right text-[14.5px] leading-[1.7] max-w-[300px] md:max-w-[380px]"
          style="color: var(--color-text-secondary);"
        >
          <slot />
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  /** Overline badge text */
  badge: string
  /** First headline line (primary color) */
  line1: string
  /** Second headline line (tertiary/muted color) */
  line2: string
  /** Optional aria-label for the section */
  ariaLabel?: string
  /** Element ID to scroll to when arrow is clicked */
  scrollTarget?: string
  /** CSS class for curtain 1 — defaults to dark */
  curtain1Class?: string
  /** CSS class for curtain 2 — defaults to orange */
  curtain2Class?: string
  /** Custom title font-size via clamp() */
  titleSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Hero',
  scrollTarget: '',
  curtain1Class: 'phc-curtain--dark',
  curtain2Class: 'phc-curtain--orange',
  titleSize: 'clamp(56px, 12vw, 160px)',
})

const sectionRef  = ref<HTMLElement | null>(null)
const badgeRef    = ref<HTMLElement | null>(null)
const curtain1Ref = ref<HTMLElement | null>(null)
const curtain2Ref = ref<HTMLElement | null>(null)
const text1Ref    = ref<HTMLElement | null>(null)
const text2Ref    = ref<HTMLElement | null>(null)
const bottomRef   = ref<HTMLElement | null>(null)

let ctx: any = null

const scrollToContent = () => {
  if (props.scrollTarget) {
    document.getElementById(props.scrollTarget)?.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(async () => {
  const { gsap } = await import('gsap')

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const curtains = [curtain1Ref.value, curtain2Ref.value].filter((c): c is HTMLElement => !!c)
      const texts    = [text1Ref.value,    text2Ref.value].filter((t): t is HTMLElement => !!t)

      // Initial states
      gsap.set(curtains, {
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        yPercent: 0,
      })
      gsap.set(texts, { opacity: 0, y: 18 })
      if (badgeRef.value) {
        gsap.set(badgeRef.value,  { opacity: 0, y: 14 })
      }
      if (bottomRef.value) {
        gsap.set(bottomRef.value, { opacity: 0, y: 18 })
      }

      // Master timeline
      const tl = gsap.timeline({ delay: 0.2 })

      // Badge fades in first
      if (badgeRef.value) {
        tl.to(badgeRef.value, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
      }

      // Staggered curtain reveals
      curtains.forEach((curtain, i) => {
        const text   = texts[i]
        const offset = 0.25 + i * 0.18

        if (curtain) {
          tl.to(curtain, {
            yPercent: 110,
            duration: 1.35,
            ease: 'power4.out',
          }, offset)
        }

        if (text) {
          tl.to(text, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power4.out',
          }, offset + 0.05)
        }
      })

      // Bottom row fades in
      if (bottomRef.value) {
        tl.to(bottomRef.value, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
        }, '-=0.5')
      }
    })

    // Reduced motion fallback
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(
        [curtain1Ref.value, curtain2Ref.value],
        { display: 'none' }
      )
      gsap.set(
        [text1Ref.value, text2Ref.value, badgeRef.value, bottomRef.value],
        { opacity: 1, y: 0, clearProps: 'all' }
      )
    })
  }, sectionRef.value ?? undefined)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
/* Curtain overlay block */
.phc-curtain {
  display: block;
  position: absolute;
  inset: 0;
  z-index: 2;
  transform-origin: top center;
  will-change: transform;
}

/* Near-black curtain */
.phc-curtain--dark {
  background-color: var(--color-bg-page, rgba(12, 9, 6, 1));
}

/* Orange accent curtain */
.phc-curtain--orange {
  background-color: #E8712A;
}

/* Text layer */
.phc-text {
  position: relative;
  z-index: 1;
  will-change: transform, opacity;
}

/* Line wrapper — clips the curtain */
.phc-line-wrap {
  position: relative;
  padding-bottom: 0.06em;
}
</style>
