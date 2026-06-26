<template>
  <!--
    Footer — IntegratedBio inspired:
    Dark full-height section with moody background image,
    CTA heading + nav columns top, massive brand name bottom.
  -->
  <footer
    ref="containerRef"
    class="relative overflow-hidden flex flex-col"
    style="background-color: #0F0C09; min-height: 100svh;"
    aria-label="Footer"
  >

    <!-- ── Background: moody restaurant image + heavy overlay ── -->
    <div class="absolute inset-0 z-0" aria-hidden="true">
      <img
        src="/images/footer-cta-bg.jpg"
        alt=""
        class="w-full h-full object-cover object-center"
        loading="lazy"
      />
      <!-- Dark overlay — very heavy so text is always readable -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(
          to bottom,
          rgba(10, 8, 5, 0.88) 0%,
          rgba(10, 8, 5, 0.78) 40%,
          rgba(10, 8, 5, 0.92) 75%,
          rgba(10, 8, 5, 1) 100%
        );"
      ></div>
    </div>

    <!-- ── Content ──────────────────────────────────────────── -->
    <div class="relative z-10 flex flex-col flex-1 px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto w-full">

      <!-- Top spacer -->
      <div style="padding-top: clamp(60px, 10vh, 120px);"></div>

      <!-- ── Main row: CTA left + Nav right ─────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

        <!-- Left: CTA Block -->
        <div class="lg:col-span-7 flex flex-col items-start">
          <div class="overflow-hidden mb-10">
            <h2
              class="footer-h2 font-medium leading-[1.08] tracking-tight"
              style="font-size: clamp(28px, 4vw, 52px); color: #FFFFFF; max-width: 580px;"
            >
              <span style="color: #FFFFFF;">Kami membantu bisnis kuliner</span><br>
              <span
                style="
                  background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                "
              >tumbuh di era digital.</span>
            </h2>
          </div>

          <!-- CTA Buttons -->
          <div class="footer-cta-btns flex items-center gap-3">
            <NuxtLink
              to="https://play.google.com/store/apps/details?id=com.santap.pos"
              target="_blank"
              rel="noopener noreferrer"
              class="motion-btn inline-flex items-center gap-2 rounded-full
                     text-[11px] font-bold uppercase tracking-[0.1em]
                     no-underline"
              style="background-color: #FFFFFF; color: #0F0C09; padding: 14px 28px;"
            >
              Coba Gratis Sekarang
            </NuxtLink>
            <NuxtLink
              to="https://play.google.com/store/apps/details?id=com.santap.pos"
              target="_blank"
              rel="noopener noreferrer"
              class="motion-btn inline-flex items-center justify-center rounded-full
                     no-underline flex-shrink-0"
              style="width: 48px; height: 48px; background-color: var(--color-primary); color: #FFFFFF;"
              aria-label="Mulai sekarang"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Right: Nav columns + scroll-to-top -->
        <div class="footer-nav-cols lg:col-span-5 flex justify-between lg:justify-end gap-16 lg:gap-20 pt-2">

          <!-- Navigate -->
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] mb-6" style="color: rgba(255,255,255,0.35);">Navigasi</p>
            <ul class="flex flex-col gap-3.5">
              <li>
                <NuxtLink
                  to="/about-us"
                  class="text-[15px] no-underline transition-colors duration-150 hover:!text-white"
                  style="color: rgba(255,255,255,0.65);"
                >Tentang Kami</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/features"
                  class="text-[15px] no-underline transition-colors duration-150 hover:!text-white"
                  style="color: rgba(255,255,255,0.65);"
                >Fitur</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/pricing"
                  class="text-[15px] no-underline transition-colors duration-150 hover:!text-white"
                  style="color: rgba(255,255,255,0.65);"
                >Harga</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/company"
                  class="text-[15px] no-underline transition-colors duration-150 hover:!text-white"
                  style="color: rgba(255,255,255,0.65);"
                >Mitra</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/contact"
                  class="text-[15px] no-underline transition-colors duration-150 hover:!text-white"
                  style="color: rgba(255,255,255,0.65);"
                >Kontak</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Connect + scroll-up -->
          <div class="flex flex-col justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] mb-6" style="color: rgba(255,255,255,0.35);">Hubungkan</p>
              <ul class="flex flex-col gap-3.5">
                <li>
                  <a
                    href="#"
                    class="text-[15px] no-underline transition-colors duration-150 hover:!text-white"
                    style="color: rgba(255,255,255,0.65);"
                  >Instagram</a>
                </li>
                <li>
                  <a
                    href="https://wa.me/628986606000?text=Halo%20Santap!%20Saya%20ingin%20konsultasi%20%26%20demo%20produk%20untuk%20restoran%2Fcafe%20saya.%20Terima%20kasih."
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[15px] no-underline transition-colors duration-150 hover:!text-white"
                    style="color: rgba(255,255,255,0.65);"
                  >WhatsApp</a>
                </li>
              </ul>
            </div>

            <!-- Arrow-up -->
            <button
              @click="scrollToTop"
              class="flex items-center justify-center rounded-full border transition-all duration-200 hover:border-white/50 hover:bg-white/10 mt-8"
              style="width: 40px; height: 40px; border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6);"
              aria-label="Kembali ke atas"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

        </div>
      </div>


      <!-- Flex spacer to push brand name to bottom -->
      <div class="flex-1" style="min-height: clamp(60px, 8vh, 100px);"></div>

      <!-- ── Massive Brand Name — bottom ─────────────────────── -->
      <div class="footer-brand w-full overflow-hidden" aria-hidden="true">
        <p
          class="font-bold tracking-tighter text-center select-none pointer-events-none leading-none"
          style="
            font-size: clamp(80px, 22vw, 320px);
            color: rgba(255, 255, 255, 0.04);
            margin-bottom: -0.08em;
            letter-spacing: -0.03em;
          "
        >SANTAP</p>
      </div>

    </div>

    <!-- ── Copyright bar ──────────────────────────────────────── -->
    <div class="relative z-10 w-full" style="border-top: 1px solid rgba(255,255,255,0.07);">
      <div class="px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto pt-5 pb-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-[11px] uppercase tracking-[0.1em]" style="color: rgba(255,255,255,0.25);">
          © {{ currentYear }} Santap. All Rights Reserved.
        </p>
        <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-right">
          <div class="flex gap-4">
            <NuxtLink
              to="/terms"
              class="text-[11px] uppercase tracking-[0.1em] no-underline transition-colors duration-150 hover:text-white"
              style="color: rgba(255,255,255,0.25);"
            >Syarat & Ketentuan</NuxtLink>
            <NuxtLink
              to="/privacy-policy"
              class="text-[11px] uppercase tracking-[0.1em] no-underline transition-colors duration-150 hover:text-white"
              style="color: rgba(255,255,255,0.25);"
            >Kebijakan Privasi</NuxtLink>
          </div>
          <span style="color: rgba(255,255,255,0.15);" class="hidden sm:inline">|</span>
          <p class="text-[11px] uppercase tracking-[0.1em]" style="color: rgba(255,255,255,0.20);">
            Dibuat untuk bisnis kuliner Indonesia
          </p>
        </div>
      </div>
    </div>

  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { runLandingGsap } from '~/composables/useLandingGsap'

const containerRef = ref<HTMLElement | null>(null)
let ctx: { revert: () => void } | null = null

const currentYear = new Date().getFullYear()

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  ctx = await runLandingGsap(containerRef.value, ({
    mm,
    motion,
    revealInstant,
    revealOnScroll,
    revealFade,
  }) => {
    const targets = ['.footer-h2', '.footer-cta-btns', '.footer-nav-cols', '.footer-brand']

    mm.add('(prefers-reduced-motion: reduce)', () => {
      revealInstant(targets)
    })

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      revealOnScroll('.footer-h2', '.footer-h2', { y: motion.y.md, start: 'top 88%' })
      revealOnScroll('.footer-cta-btns', '.footer-cta-btns', { y: motion.y.sm, start: 'top 88%', delay: 0.06 })
      revealOnScroll('.footer-nav-cols', '.footer-nav-cols', { y: motion.y.md, start: 'top 88%', delay: 0.1 })
      revealFade('.footer-brand', '.footer-brand', { start: 'top 92%', duration: motion.duration.section })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>
