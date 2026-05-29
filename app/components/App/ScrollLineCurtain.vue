<template>
  <div ref="rootRef" class="slc-root" v-bind="$attrs">
    <component
      :is="as"
      class="slc-heading m-0 font-medium"
      :class="headingClass"
      :style="headingStyle"
    >
      <span class="slc-line-wrap block overflow-hidden relative">
        <span ref="curtain1Ref" class="slc-curtain" :class="curtain1Class" aria-hidden="true" />
        <span ref="text1Ref" class="slc-text block">
          <slot name="line1" />
        </span>
      </span>
      <span class="slc-line-wrap block overflow-hidden relative">
        <span ref="curtain2Ref" class="slc-curtain" :class="curtain2Class" aria-hidden="true" />
        <span ref="text2Ref" class="slc-text block">
          <slot name="line2" />
        </span>
      </span>
    </component>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { santapEase, santapMotion } from '~/composables/useSantapMotion'

const props = withDefaults(defineProps<{
  as?: 'h1' | 'h2' | 'h3' | 'div'
  curtain1Class?: string
  curtain2Class?: string
  scrollStart?: string
  headingClass?: string
  headingStyle?: string | Record<string, string>
}>(), {
  as: 'h2',
  curtain1Class: 'slc-curtain--page',
  curtain2Class: 'slc-curtain--accent',
  scrollStart: santapMotion.scroll.enter,
  headingClass: '',
  headingStyle: undefined,
})

defineOptions({ inheritAttrs: false })

const rootRef = ref<HTMLElement | null>(null)
const curtain1Ref = ref<HTMLElement | null>(null)
const curtain2Ref = ref<HTMLElement | null>(null)
const text1Ref = ref<HTMLElement | null>(null)
const text2Ref = ref<HTMLElement | null>(null)

let ctx: { revert: () => void } | null = null

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const el = rootRef.value
  if (!el) return

  const curtains = [curtain1Ref.value, curtain2Ref.value]
  const texts = [text1Ref.value, text2Ref.value]
  if (!curtains[0] || !curtains[1] || !texts[0] || !texts[1]) return

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(curtains, { position: 'absolute', inset: 0, zIndex: 2, yPercent: 0 })
      gsap.set(texts, { opacity: 0, y: santapMotion.y.sm })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: props.scrollStart,
          once: true,
        },
      })

      curtains.forEach((curtain, i) => {
        const text = texts[i]
        const offset = i * santapMotion.stagger.tight
        tl.to(curtain, { yPercent: 110, duration: 0.62, ease: santapEase }, offset)
        tl.to(text, { opacity: 1, y: 0, duration: 0.55, ease: santapEase }, offset + 0.03)
      })
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(curtains, { display: 'none' })
      gsap.set(texts, { opacity: 1, y: 0, clearProps: 'all' })
    })
  }, el)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.slc-curtain {
  display: block;
  position: absolute;
  inset: 0;
  z-index: 2;
  transform-origin: top center;
  will-change: transform;
}

.slc-curtain--page {
  background-color: var(--color-bg-page, #faf8f4);
}

.slc-curtain--accent {
  background-color: var(--color-primary-light, #fdf5ed);
}

.slc-curtain--dark {
  background-color: #111009;
}

.slc-curtain--muted {
  background-color: rgba(255, 255, 255, 0.18);
}

.slc-text {
  position: relative;
  z-index: 1;
  will-change: transform, opacity;
}

.slc-line-wrap {
  position: relative;
  padding-bottom: 0.06em;
}
</style>
