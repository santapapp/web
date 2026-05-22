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
