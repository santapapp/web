<template>
  <div class="bg-[var(--color-bg-page)]">
    <!-- Hero -->
    <LandingHeroSection />

    <!-- Features -->
    <LandingFeatureSection />

    <!-- How It Works -->
    <LandingHowItWorksSection />

    <!-- Testimonials -->
    <LandingTestimonialSection />

    <!-- Final CTA -->
    <LandingCtaSection />

    <!-- Footer -->
    <footer class="bg-[var(--color-bg-surface)] border-t border-[var(--color-border)] pt-14 pb-8">
      <div class="container">
        <!-- Top: brand + nav -->
        <div class="flex justify-between gap-12 flex-wrap pb-10 border-b border-[var(--color-border)]">
          <!-- Brand -->
          <div class="flex flex-col gap-3 max-w-[220px]">
            <NuxtLink class="inline-flex items-center gap-2.5 no-underline" to="/" aria-label="Santap — Beranda">
              <img src="~/assets/icons/brand.svg" alt="" aria-hidden="true" class="w-7 h-7">
              <span class="font-display text-[17px] font-bold text-[var(--color-text-primary)] tracking-tight">Santap</span>
            </NuxtLink>
            <p class="text-[13px] text-[var(--color-text-tertiary)] leading-[1.6] m-0">
              Aplikasi kasir mobile untuk restoran &amp; cafe Indonesia.
            </p>
          </div>

          <!-- Nav cols -->
          <nav class="flex gap-14 flex-wrap" aria-label="Navigasi footer">
            <div class="flex flex-col gap-2.5">
              <span class="text-[11px] font-semibold text-[var(--color-text-primary)] uppercase tracking-[0.06em] mb-1">Produk</span>
              <NuxtLink class="text-[13px] text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)] transition-colors duration-150" to="/features">Fitur</NuxtLink>
              <NuxtLink class="text-[13px] text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)] transition-colors duration-150" to="/pricing">Harga</NuxtLink>
              <NuxtLink class="text-[13px] text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)] transition-colors duration-150" to="/changelog">Pembaruan</NuxtLink>
            </div>
            <div class="flex flex-col gap-2.5">
              <span class="text-[11px] font-semibold text-[var(--color-text-primary)] uppercase tracking-[0.06em] mb-1">Perusahaan</span>
              <NuxtLink class="text-[13px] text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)] transition-colors duration-150" to="/about">Tentang Kami</NuxtLink>
              <NuxtLink class="text-[13px] text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)] transition-colors duration-150" to="/contact">Kontak</NuxtLink>
            </div>
            <div class="flex flex-col gap-2.5">
              <span class="text-[11px] font-semibold text-[var(--color-text-primary)] uppercase tracking-[0.06em] mb-1">Hukum</span>
              <NuxtLink class="text-[13px] text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)] transition-colors duration-150" to="/privacy">Privasi</NuxtLink>
              <NuxtLink class="text-[13px] text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)] transition-colors duration-150" to="/terms">Syarat &amp; Ketentuan</NuxtLink>
            </div>
          </nav>
        </div>

        <!-- Bottom -->
        <div class="flex justify-between items-center flex-wrap gap-2 pt-6">
          <p class="text-[12px] text-[var(--color-text-tertiary)] m-0">© {{ new Date().getFullYear() }} Santap. Hak cipta dilindungi.</p>
          <p class="text-[12px] text-[var(--color-text-tertiary)] m-0">Dibuat dengan ❤️ di Indonesia</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Santap — Aplikasi Kasir Mobile untuk Restoran & Cafe',
  description:
    'Santap adalah aplikasi mobile POS cloud untuk restoran dan cafe Indonesia. Catat pesanan, proses pembayaran, dan pantau laporan penjualan dari mana saja.',
  ogTitle: 'Santap — Aplikasi Kasir Mobile untuk Restoran & Cafe',
  ogDescription:
    'Aplikasi kasir (POS) berbasis cloud yang dirancang khusus untuk bisnis kuliner Indonesia. Download sekarang dan sederhanakan operasional restoran Anda.',
  ogImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop&q=80',
  twitterCard: 'summary_large_image',
})

definePageMeta({
  layout: 'default'
})
</script>
