<template>
  <section class="cta-section">
    <!-- Background decoration -->
    <div class="cta-bg" aria-hidden="true">
      <div class="cta-orb cta-orb--1" />
      <div class="cta-orb cta-orb--2" />
      <div class="cta-dots" />
    </div>

    <div class="container">
      <div ref="contentRef" class="cta-content" :class="{ 'is-visible': contentVisible }">

        <!-- Eyebrow -->
        <div class="cta-eyebrow">
          <UIcon name="i-lucide-rocket" class="cta-rocket" />
          <span>Mulai perjalanan digital restoran Anda</span>
        </div>

        <!-- Heading -->
        <h2 class="cta-heading">
          Satu aplikasi.<br>
          <em class="cta-heading-serif">Semua yang dibutuhkan.</em>
        </h2>

        <!-- Body -->
        <p class="cta-body">
          Daftar gratis dan rasakan langsung bagaimana Santap
          menyederhanakan operasional kasir restoran Anda.
          Tidak perlu komitmen. Tidak perlu kartu kredit.
        </p>

        <!-- CTA -->
        <div class="btn-row cta-actions">
          <NuxtLink class="btn btn-white btn-lg" to="/register">
            Daftar Gratis
          </NuxtLink>
          <NuxtLink class="btn btn-outline-white" to="/features">
            Pelajari Fitur
          </NuxtLink>
        </div>

        <!-- Trust row -->
        <div class="cta-trust">
          <div v-for="t in trust" :key="t.id" class="trust-pill">
            <UIcon :name="t.icon" class="trust-pill-icon" />
            {{ t.label }}
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const trust = [
  { id: 'free', icon: 'i-lucide-gift', label: 'Gratis untuk memulai' },
  { id: 'secure', icon: 'i-lucide-shield-check', label: 'Data terenkripsi' },
  { id: 'cancel', icon: 'i-lucide-x-circle', label: 'Batalkan kapan saja' },
]

const contentRef = ref<HTMLElement | null>(null)
const contentVisible = ref(false)

const { stop } = useIntersectionObserver(contentRef, ([e]) => {
  if (e && e.isIntersecting) { contentVisible.value = true; stop() }
}, { threshold: 0.2 })
</script>

<style scoped>
.cta-section {
  position: relative;
  padding: 100px 0;
  background: linear-gradient(140deg, #D46B0A 0%, var(--color-primary) 45%, #E8963A 100%);
  overflow: hidden;
}

/* ── Background decoration ───────────────────────────────── */
.cta-bg { position: absolute; inset: 0; pointer-events: none; }

.cta-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
}

.cta-orb--1 {
  width: 560px;
  height: 560px;
  top: -220px;
  right: -120px;
  animation: floatY 12s ease-in-out infinite;
}

.cta-orb--2 {
  width: 280px;
  height: 280px;
  bottom: -140px;
  left: -60px;
  animation: floatY 9s ease-in-out infinite 2s reverse;
}

.cta-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1.5px, transparent 1.5px);
  background-size: 26px 26px;
}

/* ── Content ─────────────────────────────────────────────── */
.cta-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 28px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
}

.cta-content.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Eyebrow */
.cta-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: var(--radius-full);
  padding: 7px 18px;
  color: rgba(255,255,255,0.9);
  font-size: var(--text-caption);
  font-weight: 500;
  backdrop-filter: blur(8px);
}

.cta-rocket {
  width: 15px;
  height: 15px;
  animation: wiggle 2.5s ease-in-out infinite;
}

/* Heading */
.cta-heading {
  font-family: var(--font-body);
  font-size: clamp(30px, 5vw, 48px);
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.12;
  letter-spacing: -0.025em;
  max-width: 500px;
}

.cta-heading-serif {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 700;
}

/* Body */
.cta-body {
  font-size: var(--text-body-lg);
  color: rgba(255,255,255,0.78);
  max-width: 480px;
  line-height: 1.72;
  margin: 0;
}

/* Actions */
.cta-actions { justify-content: center; gap: 14px; }

/* Trust pills */
.cta-trust {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
}

.trust-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-full);
  padding: 5px 14px;
  font-size: var(--text-caption);
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  backdrop-filter: blur(4px);
}

.trust-pill-icon { width: 13px; height: 13px; flex-shrink: 0; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 600px) {
  .cta-section { padding: 72px 0; }
  .cta-actions { flex-direction: column; align-items: stretch; }
  .cta-trust { flex-direction: column; align-items: center; }
}
</style>
