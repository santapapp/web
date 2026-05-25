<template>
  <section class="how-section">
    <div class="container">

      <!-- Header -->
      <div ref="headerRef" class="section-header" :class="{ 'is-visible': headerVisible }">
        <span class="overline">Cara Mulai</span>
        <h2>
          Siap dalam
          <em class="h2-serif text-wavy-underline">hitungan menit.</em>
        </h2>
        <p>
          Tidak perlu pelatihan teknis atau instalasi perangkat khusus.
          Download, daftar, dan mulai terima pesanan hari ini.
        </p>
      </div>

      <!-- Steps -->
      <div ref="stepsRef" class="steps-row">
        <!-- Connecting dashed line -->
        <div class="steps-connector" aria-hidden="true">
          <div class="connector-line" :class="{ 'connector-line--active': stepsVisible }" />
        </div>

        <div
          v-for="(step, i) in steps"
          :key="step.id"
          class="step"
          :class="{ 'is-visible': stepsVisible }"
          :style="{ '--delay': `${i * 0.15}s` }"
        >
          <div class="step-icon-area">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-icon-bg" :style="{ background: step.bg }">
              <UIcon :name="step.icon" class="step-icon" :style="{ color: step.color }" />
            </div>
          </div>
          <div class="step-body">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
            <div class="step-time">
              <UIcon name="i-lucide-clock" class="time-icon" />
              {{ step.time }}
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div ref="ctaRef" class="how-cta" :class="{ 'is-visible': ctaVisible }">
        <NuxtLink class="btn btn-primary btn-lg" to="/#">
          Daftar Gratis Sekarang
        </NuxtLink>
        <p class="cta-note">Tidak perlu kartu kredit &bull; Batalkan kapan saja</p>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    id: 'download',
    icon: 'i-lucide-download',
    title: 'Download & Daftar',
    desc: 'Download aplikasi Santap, buat akun gratis, dan masukkan informasi outlet Anda. Selesai dalam 5 menit.',
    time: '~5 menit',
    bg: '#FFF1E8',
    color: '#E87722'
  },
  {
    id: 'setup',
    icon: 'i-lucide-utensils',
    title: 'Setup Menu',
    desc: 'Tambahkan produk, atur harga dan kategori. Template siap pakai tersedia untuk mempercepat proses setup.',
    time: '~10 menit',
    bg: '#E8F5EF',
    color: '#2D8A4E'
  },
  {
    id: 'sell',
    icon: 'i-lucide-shopping-bag',
    title: 'Mulai Berjualan',
    desc: 'Terima pesanan langsung dari aplikasi, proses pembayaran, dan lihat laporan penjualan hari itu juga.',
    time: 'Seketika',
    bg: '#EEF2FF',
    color: '#4F46E5'
  }
]

const headerRef = ref<HTMLElement | null>(null)
const stepsRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const headerVisible = ref(false)
const stepsVisible = ref(false)
const ctaVisible = ref(false)

const { stop: s1 } = useIntersectionObserver(headerRef, ([e]) => {
  if (e && e.isIntersecting) { headerVisible.value = true; s1() }
}, { threshold: 0.2 })

const { stop: s2 } = useIntersectionObserver(stepsRef, ([e]) => {
  if (e && e.isIntersecting) { stepsVisible.value = true; s2() }
}, { threshold: 0.15 })

const { stop: s3 } = useIntersectionObserver(ctaRef, ([e]) => {
  if (e && e.isIntersecting) { ctaVisible.value = true; s3() }
}, { threshold: 0.5 })
</script>

<style scoped>
.how-section {
  padding: 96px 0;
  background: var(--color-blush);
}

/* ── Header ──────────────────────────────────────────────── */
.section-header {
  max-width: 540px;
  margin: 0 auto 72px;
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

/* ── Steps row ───────────────────────────────────────────── */
.steps-row {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

/* Connector line */
.steps-connector {
  position: absolute;
  top: 44px;
  left: calc(16.67% + 26px);
  right: calc(16.67% + 26px);
  height: 1.5px;
  background: var(--color-border);
  overflow: hidden;
  z-index: 0;
}

.connector-line {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--color-primary), rgba(232, 119, 34, 0.2));
  transition: width 1.4s var(--ease-out) 0.5s;
}

.connector-line--active { width: 100%; }

/* ── Step ────────────────────────────────────────────────── */
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 18px;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.55s var(--ease-out) var(--delay),
    transform 0.55s var(--ease-out) var(--delay);
}

.step.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.step-icon-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  color: #FFF;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid var(--color-blush);
  z-index: 2;
}

.step-icon-bg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-1);
  transition: transform var(--duration-normal) var(--ease-spring), box-shadow var(--duration-normal) var(--ease-default);
}

.step:hover .step-icon-bg {
  transform: scale(1.08) rotate(-5deg);
  box-shadow: var(--shadow-2);
}

.step-icon {
  width: 32px;
  height: 32px;
}

.step-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-title {
  font-size: var(--text-h3);
  font-weight: 600;
  color: var(--color-text-primary);
}

.step-desc {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 220px;
  margin: 0 auto;
}

.step-time {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
  border: 0.5px solid rgba(232,119,34,0.2);
  border-radius: var(--radius-full);
  padding: 4px 12px;
  width: max-content;
  margin: 0 auto;
}

.time-icon {
  width: 12px;
  height: 12px;
}

/* ── Bottom CTA ──────────────────────────────────────────── */
.how-cta {
  margin-top: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
}

.how-cta.is-visible { opacity: 1; transform: translateY(0); }

.cta-note {
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  margin: 0;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 768px) {
  .how-section { padding: 72px 0; }

  .steps-row {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
    gap: 0;
  }

  .steps-connector { display: none; }

  .step {
    flex-direction: row;
    text-align: left;
    gap: 20px;
    padding: 24px 0;
    border-bottom: 0.5px solid var(--color-border);
    align-items: flex-start;
  }

  .step:last-child { border-bottom: none; }

  .step-icon-bg { flex-shrink: 0; }

  .step-desc,
  .step-time { margin: 0; }
}
</style>
