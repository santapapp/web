<template>
  <section class="testimonial-section">
    <div class="container">

      <!-- Header -->
      <div ref="headerRef" class="section-header" :class="{ 'is-visible': headerVisible }">
        <span class="overline">Dari Pengguna Kami</span>
        <h2>
          Yang mereka rasakan<br>
          <em class="h2-serif">setelah pakai Santap.</em>
        </h2>
      </div>

      <!-- Cards -->
      <div ref="cardsRef" class="testimonial-grid">
        <div
          v-for="(t, i) in testimonials"
          :key="t.id"
          class="testimonial-card hover-tilt"
          :class="{ 'is-visible': cardsVisible }"
          :style="{ '--delay': `${i * 0.12}s` }"
        >
          <!-- Stars -->
          <div class="t-stars" :aria-label="`Rating ${t.rating} bintang`">
            <UIcon
              v-for="n in 5"
              :key="n"
              name="i-lucide-star"
              class="star-icon"
              :class="{ 'star-empty': n > t.rating }"
            />
          </div>

          <!-- Quote -->
          <blockquote class="t-quote">"{{ t.quote }}"</blockquote>

          <!-- Author -->
          <div class="t-author">
            <img :src="t.avatar" :alt="`Foto ${t.name}`" class="t-avatar" loading="lazy">
            <div>
              <p class="t-name">{{ t.name }}</p>
              <p class="t-role">{{ t.role }}, {{ t.place }}</p>
            </div>
          </div>

          <!-- Decorative quote mark -->
          <div class="t-deco-quote" aria-hidden="true">"</div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    id: 't1',
    quote: 'Pencatatan pesanan jadi jauh lebih rapi. Kasir kami langsung bisa pakai tanpa pelatihan panjang.',
    name: 'Budi Santoso',
    role: 'Owner',
    place: 'Warung Makan Pak Budi',
    rating: 5,
    avatar: '/images/avatar-1.jpg'
  },
  {
    id: 't2',
    quote: 'Laporan harian sekarang tinggal buka aplikasi. Tidak perlu repot rekap manual setiap malam lagi.',
    name: 'Maya Indira',
    role: 'Manager',
    place: 'Kopi Nusantara Cafe',
    rating: 5,
    avatar: '/images/avatar-2.jpg'
  },
  {
    id: 't3',
    quote: 'Setup cepat, tampilan bersih, dan tidak bikin pusing. Persis yang dicari untuk restoran kami.',
    name: 'Ahmad Fauzi',
    role: 'Owner',
    place: 'Rumah Makan Sari Bundo',
    rating: 5,
    avatar: '/images/avatar-3.jpg'
  }
]

const headerRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const headerVisible = ref(false)
const cardsVisible = ref(false)

const { stop: s1 } = useIntersectionObserver(headerRef, ([e]) => {
  if (e && e.isIntersecting) { headerVisible.value = true; s1() }
}, { threshold: 0.2 })

const { stop: s2 } = useIntersectionObserver(cardsRef, ([e]) => {
  if (e && e.isIntersecting) { cardsVisible.value = true; s2() }
}, { threshold: 0.1 })
</script>

<style scoped>
.testimonial-section {
  padding: 96px 0;
  background: var(--color-bg-subtle);
}

/* ── Header ──────────────────────────────────────────────── */
.section-header {
  max-width: 520px;
  margin: 0 auto 56px;
  text-align: center;
  display: grid;
  gap: 14px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.65s var(--ease-out), transform 0.65s var(--ease-out);
}

.section-header.is-visible { opacity: 1; transform: translateY(0); }

.h2-serif {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 700;
}

/* ── Grid ─────────────────────────────────────────────────── */
.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ── Card ─────────────────────────────────────────────────── */
.testimonial-card {
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.6s var(--ease-out) var(--delay),
    transform 0.6s var(--ease-out) var(--delay),
    box-shadow var(--duration-normal) var(--ease-default),
    rotate var(--duration-normal) var(--ease-spring);
}

.testimonial-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Decorative quote mark */
.t-deco-quote {
  position: absolute;
  top: 12px;
  right: 20px;
  font-family: var(--font-display);
  font-size: 100px;
  font-style: italic;
  line-height: 1;
  color: var(--color-peach);
  pointer-events: none;
  user-select: none;
}

/* Stars */
.t-stars {
  display: flex;
  gap: 3px;
  position: relative;
  z-index: 1;
}

.star-icon {
  width: 16px;
  height: 16px;
  color: #F59E0B;
}

.star-empty { color: var(--color-border-strong); }

/* Quote */
.t-quote {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  line-height: 1.75;
  margin: 0;
  flex: 1;
  font-style: normal;
  position: relative;
  z-index: 1;
}

/* Author */
.t-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 0.5px solid var(--color-border);
  position: relative;
  z-index: 1;
}

.t-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-bg-subtle);
  flex-shrink: 0;
}

.t-name {
  font-size: var(--text-label);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
}

.t-role {
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  margin: 0;
  line-height: 1.3;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .testimonial-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .testimonial-section { padding: 72px 0; }
  .testimonial-card { padding: 24px; }
  .t-deco-quote { font-size: 72px; }
}
</style>
