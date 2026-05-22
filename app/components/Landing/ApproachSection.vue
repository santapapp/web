<template>
  <section
    class="relative bg-[var(--color-bg-page)]"
    aria-label="Pendekatan Kami"
  >
    <!-- ── Header ──────────────────────────────────────────── -->
    <div class="px-5 md:px-10 lg:px-16 pt-24 md:pt-32 pb-20 md:pb-24 max-w-[1400px] mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

        <!-- Badge -->
        <div class="lg:col-span-4 flex items-start">
          <div class="inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]">
            <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Pendekatan Kami</span>
          </div>
        </div>

        <!-- Text -->
        <div class="lg:col-span-8">
          <h2
            class="font-medium leading-[1.1] tracking-tight max-w-[660px]"
            style="font-size: clamp(26px, 3.5vw, 44px); color: var(--color-text-primary); margin-bottom: 20px;"
          >
            Efisiensi bisnis yang dibangun pada tiga strategi inti.
          </h2>
          <p class="text-[14.5px] leading-[1.7] max-w-[500px]" style="color: var(--color-text-secondary);">
            Masing-masing dirancang untuk menyederhanakan operasional restoran — dan bersama-sama, ketiganya membentuk fondasi teknologi yang solid.
          </p>
        </div>
      </div>
    </div>

    <!-- ── Three Steps — horizontal numbered rows ───────────── -->
    <div class="px-5 md:px-10 lg:px-16 pb-24 md:pb-32 max-w-[1400px] mx-auto">

      <!-- Top border -->
      <div class="h-px mb-0" style="background-color: var(--color-border);"></div>

      <div
        v-for="(step, i) in steps"
        :key="step.id"
      >
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-12 md:py-16 items-start">

          <!-- Col 1: Number -->
          <div class="md:col-span-1">
            <span
              class="font-medium tabular-nums"
              style="font-size: 13px; color: var(--color-text-tertiary); letter-spacing: 0.04em;"
            >{{ step.number }}</span>
          </div>

          <!-- Col 2: Title -->
          <div class="md:col-span-4">
            <h3
              class="font-medium tracking-tight leading-[1.1]"
              style="font-size: clamp(22px, 2.5vw, 32px); color: var(--color-text-primary);"
            >{{ step.title }}</h3>
          </div>

          <!-- Col 3: Description + tag -->
          <div class="md:col-span-4">
            <p class="text-[14.5px] leading-[1.7]" style="color: var(--color-text-secondary);">
              {{ step.desc }}
            </p>
          </div>

          <!-- Col 4: Tag pill -->
          <div class="md:col-span-3 flex md:justify-end items-start">
            <span
              class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em]"
              style="background-color: var(--color-primary-light); color: var(--color-primary);"
            >
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background-color: var(--color-primary);"></span>
              {{ step.tag }}
            </span>
          </div>

        </div>
        <!-- Divider -->
        <div class="h-px" style="background-color: var(--color-border);"></div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    id: 'speed',
    number: '01',
    title: 'Pemrosesan Kilat',
    desc: 'Selesaikan pesanan dan pembayaran dalam hitungan detik. Antarmuka yang intuitif memungkinkan kasir bekerja tanpa hambatan, bahkan di jam sibuk puncak.',
    tag: 'Kecepatan',
  },
  {
    id: 'accuracy',
    number: '02',
    title: 'Pantau Terpusat',
    desc: 'Lacak inventaris, pesanan, dan laporan dari seluruh cabang dalam satu dashboard. Tidak ada data yang tertinggal, tidak ada kesalahan pencatatan.',
    tag: 'Akurasi',
  },
  {
    id: 'intelligence',
    number: '03',
    title: 'Analisis Pintar',
    desc: 'Temukan pola penjualan, jam tersibuk, dan menu terlaris secara otomatis. Data yang bekerja untuk Anda — bukan sebaliknya.',
    tag: 'Kecerdasan',
  },
]
</script>

<style scoped>
/* Reset stale HMR cache */
</style>
