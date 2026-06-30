<template>
  <div class="bg-[var(--color-bg-page)]">
    <!-- Hero -->
    <LandingHeroSection />

    <!-- Platform -->
    <LandingPlatformSection />

    <!-- Approach -->
    <LandingApproachSection />

    <!-- Focus -->
    <LandingFocusSection />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Santap — Aplikasi Kasir Mobile untuk Restoran & Cafe',
  description:
    'Santap adalah aplikasi mobile POS cloud untuk restoran dan cafe Indonesia oleh Sekeco (PT Sarwa Kalyana Cara) Sleman, Yogyakarta. Catat pesanan, kelola pembayaran QRIS, dan pantau laporan penjualan dari mana saja.',
  ogTitle: 'Santap — Aplikasi Kasir Mobile untuk Restoran & Cafe',
  ogDescription:
    'Aplikasi kasir (POS) berbasis cloud oleh Sekeco (PT Sarwa Kalyana Cara) Sleman, Yogyakarta. Dirancang khusus untuk bisnis kuliner Indonesia. Coba gratis sekarang!',
  ogImage: '/images/og-image.jpg',
  twitterCard: 'summary_large_image',
})

definePageMeta({
  layout: 'default'
})
</script>
