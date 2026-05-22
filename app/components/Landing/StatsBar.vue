<template>
  <section class="stats-bar">
    <div class="container">
      <div ref="barRef" class="stats-grid" :class="{ 'is-visible': isVisible }">
        <div
          v-for="(item, i) in highlights"
          :key="item.id"
          class="stat-item"
          :style="{ '--delay': `${i * 0.08}s` }"
        >
          <div class="stat-icon-wrap" :style="{ background: item.bgColor }">
            <UIcon :name="item.icon" class="stat-icon" :style="{ color: item.iconColor }" />
          </div>
          <div class="stat-body">
            <span class="stat-value">{{ item.value }}</span>
            <span class="stat-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const barRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

const { stop } = useIntersectionObserver(
  barRef,
  ([entry]) => {
    if (entry.isIntersecting) { isVisible.value = true; stop() }
  },
  { threshold: 0.3 }
)

const highlights = [
  {
    id: 'mobile',
    icon: 'i-lucide-smartphone',
    value: 'Android & iOS',
    label: 'Aplikasi mobile native',
    bgColor: '#FFF1E8',
    iconColor: '#E87722'
  },
  {
    id: 'realtime',
    icon: 'i-lucide-zap',
    value: 'Real-time',
    label: 'Sinkronisasi data otomatis',
    bgColor: '#E8F5EF',
    iconColor: '#2D8A4E'
  },
  {
    id: 'payment',
    icon: 'i-lucide-credit-card',
    value: 'QRIS Ready',
    label: 'Semua metode pembayaran',
    bgColor: '#EEF2FF',
    iconColor: '#4F46E5'
  },
  {
    id: 'cloud',
    icon: 'i-lucide-cloud',
    value: 'Cloud Backup',
    label: 'Data aman & terenkripsi',
    bgColor: '#FFF7F2',
    iconColor: '#C45E0F'
  }
]
</script>

<style scoped>
.stats-bar {
  padding: 0;
  position: relative;
  z-index: 2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-1);
  overflow: hidden;
  margin: -24px 0 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 26px 22px;
  border-right: 0.5px solid var(--color-border);
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.45s var(--ease-out) var(--delay),
    transform 0.45s var(--ease-out) var(--delay);
  cursor: default;
}

.stat-item:last-child { border-right: none; }

.stats-grid.is-visible .stat-item {
  opacity: 1;
  transform: translateY(0);
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform var(--duration-normal) var(--ease-spring);
}

.stat-item:hover .stat-icon-wrap {
  transform: scale(1.1) rotate(-3deg);
}

.stat-icon {
  width: 22px;
  height: 22px;
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: var(--text-caption);
  font-weight: 400;
  color: var(--color-text-tertiary);
  line-height: 1.3;
}

@media (max-width: 840px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    margin: 0;
  }

  .stat-item:nth-child(2) { border-right: none; }
  .stat-item:nth-child(1),
  .stat-item:nth-child(2) { border-bottom: 0.5px solid var(--color-border); }
}

@media (max-width: 480px) {
  .stats-grid { border-radius: var(--radius-lg); }
  .stat-item { padding: 18px 16px; gap: 10px; }
}
</style>
