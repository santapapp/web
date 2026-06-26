<template>
  <p ref="elRef" v-bind="$attrs" class="twr-root">
    <!--
      Per kata: wrapper overflow:hidden + curtain overlay + text di belakangnya.
      Sama persis seperti PageHeroCurtain tapi per word dan di-trigger scroll.
    -->
    <span
      v-for="(word, i) in words"
      :key="i"
      class="twr-word"
    >
      <!-- Curtain block — slides yPercent 0 → 110 saat terlihat -->
      <span class="twr-curtain" aria-hidden="true" />
      <!-- Teks sebenarnya, opacity: 0 → 1 -->
      <span class="twr-text">{{ word }}</span>
      <!-- spasi antar kata -->
      <span v-if="i < words.length - 1" class="twr-space">&nbsp;</span>
    </span>
  </p>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  delay?: number
}>(), {
  delay: 0
})

defineOptions({ inheritAttrs: false })

const elRef = ref<HTMLElement | null>(null)
let ctx: any = null

const words = computed(() => props.text.split(' '))

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  setTimeout(() => {
    const el = elRef.value
    if (!el) return

    const curtains = el.querySelectorAll<HTMLElement>('.twr-curtain')
    const texts    = el.querySelectorAll<HTMLElement>('.twr-text')

    if (!curtains.length) return

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Set awal: curtain menutupi teks, teks tidak terlihat
        gsap.set(curtains, { yPercent: 0 })
        gsap.set(texts,    { opacity: 0, y: 8 })

        gsap.to(curtains, {
          yPercent: 110,
          duration: 2,
          ease: 'power3.out',
          stagger: 0.07,
          delay: props.delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
        })

        gsap.to(texts, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.07,
          delay: props.delay + 0.5,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(curtains, { display: 'none' })
        gsap.set(texts,    { opacity: 1, y: 0, clearProps: 'all' })
      })
    }, el)
  }, 80)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.twr-root {
  /* semua style typography diwarisi dari parent */
}

/* wrapper per kata — overflow hidden untuk clip curtain */
.twr-word {
  display: inline-block;
  position: relative;
  overflow: hidden;
  /* kompensasi agar descender (g, y, p) tidak terpotong */
  padding-bottom: 0.06em;
  margin-bottom: -0.06em;
  vertical-align: top;
}

/* Curtain — overlay berwarna bg-page, slide turun saat reveal */
.twr-curtain {
  display: block;
  position: absolute;
  inset: 0;
  z-index: 2;
  background-color: transparent;
  transform-origin: top center;
  will-change: transform;
}

/* Teks di bawah curtain */
.twr-text {
  position: relative;
  z-index: 1;
  display: inline-block;
  will-change: opacity, transform;
  opacity: 0;
}

/* Spasi antar kata, tidak perlu di-clip */
.twr-space {
  display: inline-block;
  white-space: pre;
}
</style>
