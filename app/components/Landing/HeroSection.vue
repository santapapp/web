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
      <!-- Gradient: transparent top, heavy bottom for readability -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to bottom,
          rgba(8,6,4,0.08) 0%,
          rgba(8,6,4,0.06) 30%,
          rgba(8,6,4,0.50) 65%,
          rgba(8,6,4,0.88) 100%)"
      />
    </div>

    <!-- ── Content: bottom-anchored like reference ─────────── -->
    <div
      class="relative z-10 flex-1 flex flex-col justify-end
             px-5 pb-8 sm:px-7 sm:pb-10 md:px-10 md:pb-12
             max-w-[1400px] w-full mx-auto"
    >
      <!-- Headline — pure white, extrabold, left-aligned, flush bottom -->
      <div class="animate-[fadeInUp_0.65s_cubic-bezier(0,0,0.2,1)_0.08s_both]">
        <h1
          class="m-0 mb-5 leading-[0.95] font-extrabold text-white tracking-[-0.04em]
                 text-[clamp(40px,8.5vw,90px)]"
        >
          Kasir modern,<br>
          <em
            class="not-italic"
            style="background: linear-gradient(90deg, var(--color-primary) 0%, #FFA550 100%);
                   -webkit-background-clip: text;
                   -webkit-text-fill-color: transparent;
                   background-clip: text;"
          >
            mudah &amp; efisien.
          </em>
        </h1>
      </div>

      <!-- Subtitle + CTA — stacked below headline -->
      <div class="animate-[fadeInUp_0.65s_cubic-bezier(0,0,0.2,1)_0.2s_both] max-w-[460px]">
        <p class="m-0 mb-6 text-[15px] leading-[1.7] text-white/58 font-normal">
          Aplikasi mobile POS dirancang khusus untuk bisnis kuliner Indonesia.
          Kelola pesanan, proses pembayaran, dan pantau laporan dari mana saja.
        </p>

        <!-- CTA buttons — dark solid pill + orange square arrow -->
        <div class="flex items-center gap-3 mb-5">
          <NuxtLink
            class="inline-flex items-center px-6 py-3
                   bg-[#18140F] text-white border border-white/[0.10]
                   no-underline rounded-lg
                   text-[11px] font-bold uppercase tracking-[0.09em]
                   transition-all duration-150 hover:bg-[#221C15] hover:-translate-y-px"
            to="/register"
          >
            Mulai Gratis
          </NuxtLink>

          <NuxtLink
            class="inline-flex items-center justify-center w-10 h-10 rounded-lg
                   bg-[var(--color-primary)] text-white no-underline flex-shrink-0
                   transition-all duration-150
                   hover:bg-[var(--color-primary-dark)] hover:-translate-y-px"
            to="/features"
            aria-label="Pelajari Fitur"
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
        </div>

        <!-- Platform note -->
        <p class="inline-flex items-center gap-1.5 m-0 text-[11px] text-white/32 tracking-[0.02em]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="12" cy="18" r="1" fill="currentColor"/>
          </svg>
          Android &amp; iOS — segera hadir
        </p>
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
