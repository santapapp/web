<template>
  <section class="feature-section">
    <div class="container">

      <!-- Header -->
      <div ref="headerRef" class="section-header" :class="{ 'is-visible': headerVisible }">
        <span class="overline">Fitur Unggulan</span>
        <h2>
          Semua yang dibutuhkan<br>
          <em class="h2-serif">kasir modern.</em>
        </h2>
        <p>
          Dari pencatatan pesanan hingga laporan keuangan harian —
          Santap menyederhanakan operasional restoran Anda dalam satu aplikasi.
        </p>
      </div>

      <!-- Bento grid — asymmetric layout -->
      <div ref="gridRef" class="bento-grid">

        <!-- Card 1: Large — Kasir Mobile (primary feature) -->
        <div
          class="bento-card bento-card--large bento-card--primary anim-fade-up"
          :class="{ 'is-visible': gridVisible }"
          style="--delay: 0s"
        >
          <div class="bento-icon-wrap bento-icon-wrap--light">
            <UIcon name="i-lucide-smartphone" class="bento-icon" />
          </div>
          <h3 class="bento-title">Kasir Mobile</h3>
          <p class="bento-desc">
            Catat pesanan, proses transaksi, dan terima pembayaran langsung dari smartphone.
            Tidak perlu perangkat kasir khusus yang mahal.
          </p>
          <div class="bento-tag">Fitur Inti</div>
        </div>

        <!-- Card 2: Laporan -->
        <div
          class="bento-card anim-fade-up"
          :class="{ 'is-visible': gridVisible }"
          style="--delay: 0.08s"
        >
          <div class="bento-icon-wrap" style="background: #E8F5EF;">
            <UIcon name="i-lucide-bar-chart-3" class="bento-icon" style="color: #2D8A4E;" />
          </div>
          <h3 class="bento-title">Laporan Real-Time</h3>
          <p class="bento-desc">Pantau performa penjualan harian, mingguan, dan bulanan dari dasbor yang mudah dibaca.</p>
        </div>

        <!-- Card 3: Inventaris -->
        <div
          class="bento-card anim-fade-up"
          :class="{ 'is-visible': gridVisible }"
          style="--delay: 0.16s"
        >
          <div class="bento-icon-wrap" style="background: #EEF2FF;">
            <UIcon name="i-lucide-package" class="bento-icon" style="color: #4F46E5;" />
          </div>
          <h3 class="bento-title">Manajemen Stok</h3>
          <p class="bento-desc">Pantau bahan baku dan produk secara otomatis. Notifikasi sebelum stok habis.</p>
        </div>

        <!-- Card 4: Multi Pembayaran -->
        <div
          class="bento-card anim-fade-up"
          :class="{ 'is-visible': gridVisible }"
          style="--delay: 0.24s"
        >
          <div class="bento-icon-wrap" style="background: #FFF4E0;">
            <UIcon name="i-lucide-credit-card" class="bento-icon" style="color: #B97B0A;" />
          </div>
          <h3 class="bento-title">Multi Pembayaran</h3>
          <p class="bento-desc">Tunai, QRIS, kartu debit/kredit, dan dompet digital — semua diterima dalam satu sistem.</p>
        </div>

        <!-- Card 5: Menu Digital -->
        <div
          class="bento-card anim-fade-up"
          :class="{ 'is-visible': gridVisible }"
          style="--delay: 0.32s"
        >
          <div class="bento-icon-wrap" style="background: var(--color-primary-light);">
            <UIcon name="i-lucide-book-open" class="bento-icon" style="color: var(--color-primary);" />
          </div>
          <h3 class="bento-title">Menu Digital</h3>
          <p class="bento-desc">Kelola menu, harga, dan kategori produk kapan saja. Perubahan langsung tersinkron ke semua perangkat.</p>
        </div>

        <!-- Card 6: Multi Outlet — wide card -->
        <div
          class="bento-card bento-card--wide anim-fade-up"
          :class="{ 'is-visible': gridVisible }"
          style="--delay: 0.4s"
        >
          <div class="bento-icon-wrap" style="background: var(--color-sage);">
            <UIcon name="i-lucide-store" class="bento-icon" style="color: #2C7A5C;" />
          </div>
          <div class="bento-wide-content">
            <h3 class="bento-title">Multi Outlet</h3>
            <p class="bento-desc">Kelola beberapa cabang restoran dari satu akun dengan laporan konsolidasi yang lengkap.</p>
          </div>
          <div class="bento-coming-soon">Segera hadir</div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const headerRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const headerVisible = ref(false)
const gridVisible = ref(false)

const { stop: s1 } = useIntersectionObserver(headerRef, ([e]) => {
  if (e && e.isIntersecting) { headerVisible.value = true; s1() }
}, { threshold: 0.2 })

const { stop: s2 } = useIntersectionObserver(gridRef, ([e]) => {
  if (e && e.isIntersecting) { gridVisible.value = true; s2() }
}, { threshold: 0.05 })
</script>

<style scoped>
.feature-section {
  padding: 96px 0;
  background: var(--color-bg-page);
}

/* ── Section header ──────────────────────────────────────── */
.section-header {
  max-width: 600px;
  margin: 0 auto 56px;
  text-align: center;
  display: grid;
  gap: 14px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.65s var(--ease-out), transform 0.65s var(--ease-out);
}

.section-header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.h2-serif {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 700;
}

/* ── Bento grid — asymmetric ─────────────────────────────── */
.bento-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
}

/* Card 1 spans 2 rows */
.bento-card--large {
  grid-row: 1 / 3;
}

/* Card 6 spans 2 cols */
.bento-card--wide {
  grid-column: 2 / 4;
}

/* ── Bento card base ─────────────────────────────────────── */
.bento-card {
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  overflow: hidden;
  transition:
    box-shadow var(--duration-normal) var(--ease-default),
    transform var(--duration-normal) var(--ease-spring),
    border-color var(--duration-normal) var(--ease-default);
}

.bento-card:hover {
  box-shadow: var(--shadow-2);
  transform: translateY(-3px);
  border-color: var(--color-border-strong);
}

/* Primary large card */
.bento-card--primary {
  background: linear-gradient(145deg, var(--color-peach-soft) 0%, #FFFFFF 60%);
}

.bento-card--primary::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(232, 119, 34, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* Wide card */
.bento-card--wide {
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.bento-wide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Icon ─────────────────────────────────────────────────── */
.bento-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform var(--duration-normal) var(--ease-spring);
}

.bento-icon-wrap--light {
  background: var(--color-primary-light);
}

.bento-card:hover .bento-icon-wrap {
  transform: rotate(-6deg) scale(1.08);
}

.bento-icon {
  width: 26px;
  height: 26px;
  color: var(--color-primary);
}

/* ── Content ─────────────────────────────────────────────── */
.bento-title {
  font-size: var(--text-h3);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.bento-desc {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0;
  flex: 1;
}

/* ── Tags ─────────────────────────────────────────────────── */
.bento-tag {
  display: inline-flex;
  width: max-content;
  background: var(--color-primary);
  color: #FFFFFF;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  margin-top: auto;
}

.bento-coming-soon {
  display: inline-flex;
  align-items: center;
  background: var(--color-bg-subtle);
  border: 0.5px solid var(--color-border);
  color: var(--color-text-tertiary);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }

  .bento-card--large { grid-row: auto; }
  .bento-card--wide { grid-column: 1 / 3; }
}

@media (max-width: 600px) {
  .feature-section { padding: 72px 0; }

  .bento-grid {
    grid-template-columns: 1fr;
  }

  .bento-card--wide { grid-column: auto; flex-direction: column; }
}
</style>
