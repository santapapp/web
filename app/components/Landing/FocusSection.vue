<template>
  <!-- Seamless dark section — no outer wrapper background contrast needed -->
  <section
    class="relative overflow-hidden"
    style="background-color: #111009;"
    aria-label="Fokus Kami"
  >
    <!-- ── Subtle background texture ──────────────────────── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Faint radial glow top-left -->
      <div
        class="absolute"
        style="width: 60%; height: 60%; top: -20%; left: -10%; background: radial-gradient(circle, rgba(232,119,34,0.06) 0%, transparent 70%); border-radius: 50%;"
      ></div>
      <!-- Faint radial glow bottom-right -->
      <div
        class="absolute"
        style="width: 50%; height: 50%; bottom: -15%; right: -5%; background: radial-gradient(circle, rgba(232,119,34,0.04) 0%, transparent 70%); border-radius: 50%;"
      ></div>
    </div>

    <div class="relative z-10 px-5 md:px-10 lg:px-16 py-24 md:py-32 max-w-[1400px] mx-auto">

      <!-- ── Header row ─────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-20 md:mb-28">

        <!-- Badge -->
        <div class="lg:col-span-4 flex items-start">
          <div
            class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
            style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
          >
            <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Fokus Kami</span>
          </div>
        </div>

        <!-- Heading -->
        <div class="lg:col-span-8">
          <h2
            class="font-medium leading-[1.08] tracking-tight"
            style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF; max-width: 680px;"
          >
            Fokus operasional eksklusif untuk
            <span style="color: rgba(255,255,255,0.35);"> bisnis F&amp;B Indonesia.</span>
          </h2>
        </div>
      </div>

      <!-- ── 3 Focus Items — list with dividers ─────────────── -->
      <div>
        <!-- Top border -->
        <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>

        <div
          v-for="(focus, i) in focuses"
          :key="focus.id"
        >
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 py-12 md:py-16 items-start group">

            <!-- Number + Title (left) -->
            <div class="md:col-span-5 flex items-baseline gap-5">
              <span
                class="flex-shrink-0 tabular-nums font-light"
                style="font-size: 13px; color: rgba(255,255,255,0.25); letter-spacing: 0.04em;"
              >{{ focus.number }}</span>
              <h3
                class="font-medium tracking-tight leading-[1.1]"
                style="font-size: clamp(24px, 3vw, 38px); color: #FFFFFF;"
              >{{ focus.title }}</h3>
            </div>

            <!-- Description (right) -->
            <div class="md:col-span-7 md:pt-1.5">
              <p class="text-[14.5px] leading-[1.75] max-w-[560px]" style="color: rgba(255,255,255,0.55);">
                {{ focus.desc }}
              </p>
              <!-- Feature tags -->
              <div class="flex flex-wrap gap-2 mt-6">
                <span
                  v-for="tag in focus.tags"
                  :key="tag"
                  class="px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.1em]"
                  style="background-color: rgba(255,255,255,0.06); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.08);"
                >{{ tag }}</span>
              </div>
            </div>

          </div>
          <!-- Divider -->
          <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const focuses = [
  {
    id: 'inventory',
    number: '01',
    title: 'Inventaris',
    desc: 'Kelola stok bahan baku dengan presisi tingkat tinggi. Sistem peringatan otomatis memastikan Anda tidak pernah kehabisan stok di waktu yang paling krusial.',
    tags: ['Stok Real-time', 'Multi-lokasi', 'Peringatan Otomatis'],
  },
  {
    id: 'processing',
    number: '02',
    title: 'Pemrosesan',
    desc: 'Alur pesanan terintegrasi dari meja ke dapur hingga ke kasir. Semua tersinkronisasi secara real-time tanpa hambatan, tanpa kertas, tanpa kesalahan.',
    tags: ['Kitchen Display', 'Antrian Otomatis', 'Multi-outlet'],
  },
  {
    id: 'analytics',
    number: '03',
    title: 'Analisis Data',
    desc: 'Dapatkan wawasan berharga dari tren penjualan harian Anda untuk merencanakan promosi, menyesuaikan menu, dan mengoptimalkan waktu operasional secara sistematis.',
    tags: ['Laporan Harian', 'Tren Penjualan', 'Ekspor Data'],
  },
]
</script>

<style scoped>
/* Reset stale HMR cache */
</style>
