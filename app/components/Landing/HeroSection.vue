<template>
  <!--
    my-3 = 12px top + 12px bottom margin
    h-[calc(100dvh-24px)] = full viewport height minus the my-3 margins
  -->
  <section
    class="relative mx-3 my-3 md:mx-5 rounded-2xl overflow-hidden
           h-[calc(100dvh-24px)]
           flex flex-col"
    aria-label="Santap Hero"
  >
    <!-- ── Background ──────────────────────────────────────── -->
    <div class="absolute inset-0 z-0" aria-hidden="true">
      <img
        class="w-full h-full object-cover object-[center_40%] block"
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85&fit=crop"
        alt=""
        loading="eager"
        fetchpriority="high"
      />
      <!-- Gradient: Stronger bottom and left overlay for better readability -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to top,
          rgba(12, 9, 6, 0.97) 0%,
          rgba(12, 9, 6, 0.78) 35%,
          rgba(12, 9, 6, 0.3) 65%,
          rgba(12, 9, 6, 0.05) 100%)"
      />
      <!-- Extra radial gradient on the left side to protect the text -->
      <div
        class="absolute inset-0"
        style="background: radial-gradient(circle at 10% 80%, rgba(12, 9, 6, 0.85) 0%, transparent 60%)"
      />
    </div>

    <!-- ── Content: bottom-anchored like reference ─────────── -->
    <div
      class="relative z-10 flex-1 flex flex-col justify-end
             px-5 pb-8 sm:px-7 sm:pb-10 md:px-10 md:pb-12
             max-w-[1400px] w-full mx-auto"
    >
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        <!-- Left Side: Headline & Subtitle -->
        <div class="max-w-[640px]">
          <!-- Headline — Fraunces serif, editorial, drop-shadow -->
          <div class="animate-[fadeInUp_0.65s_cubic-bezier(0,0,0.2,1)_0.08s_both]">
            <h1
              class="m-0 mb-5 font-bold !text-white drop-shadow-lg"
              style="
                font-family: 'Fraunces', Georgia, serif;
                font-size: clamp(42px, 8.5vw, 88px);
                line-height: 1.02;
                letter-spacing: -0.025em;
              "
            >
              Kasir modern,
              <span
                class="block"
                style="
                  background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                "
              >
                mudah &amp; efisien.
              </span>
            </h1>
          </div>

          <!-- Subtitle -->
          <div class="animate-[fadeInUp_0.65s_cubic-bezier(0,0,0.2,1)_0.2s_both]">
            <p
              class="m-0 mb-6 lg:mb-0 leading-[1.65] !text-white/75 drop-shadow-md"
              style="font-size: 15.5px; font-weight: 350; letter-spacing: 0.01em;"
            >
              Aplikasi mobile POS dirancang khusus untuk bisnis kuliner Indonesia.<br class="hidden sm:block">
              Kelola pesanan, proses pembayaran, dan pantau laporan dari mana saja.
            </p>
          </div>
        </div>

        <!-- Right Side: CTA buttons & platform note -->
        <div class="animate-[fadeInUp_0.65s_cubic-bezier(0,0,0.2,1)_0.3s_both] flex flex-col items-start lg:items-end">
          <!-- CTA buttons — dark solid pill + orange pill arrow -->
          <div class="flex items-center gap-3 mb-4">
            <NuxtLink
              class="inline-flex items-center px-7 py-3.5
                     bg-[#18140F]/95 backdrop-blur-md !text-white border border-white/[0.15]
                     no-underline rounded-full
                     text-[11px] font-bold uppercase tracking-[0.09em]
                     transition-all duration-150 hover:bg-[#221C15] hover:-translate-y-px shadow-lg"
              to="/register"
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
// Component is purely template-driven, no data needed
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
