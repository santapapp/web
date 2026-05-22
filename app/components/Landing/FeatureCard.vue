<template>
  <div class="feature-card">
    <!-- Icon -->
    <div class="feature-icon-wrap">
      <UIcon :name="icon" class="feature-icon" />
    </div>

    <!-- Content -->
    <div class="feature-content">
      <h3 class="feature-title">{{ title }}</h3>
      <p class="feature-desc">{{ description }}</p>
    </div>

    <!-- Arrow -->
    <div class="feature-arrow">
      <UIcon name="i-lucide-arrow-right" class="arrow-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<style scoped>
.feature-card {
  position: relative;
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: default;
  transition:
    box-shadow var(--duration-normal) var(--ease-default),
    transform var(--duration-normal) var(--ease-default),
    border-color var(--duration-normal) var(--ease-default);
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 0% 100%, rgba(232, 119, 34, 0.04) 0%, transparent 60%);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-default);
  border-radius: inherit;
  pointer-events: none;
}

.feature-card:hover {
  box-shadow: var(--shadow-2);
  transform: translateY(-2px);
  border-color: var(--color-border-strong);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover .feature-arrow {
  opacity: 1;
  transform: translateX(0);
}

.feature-card:hover .feature-icon-wrap {
  background: var(--color-primary);
}

.feature-card:hover .feature-icon {
  color: #FFFFFF;
}

/* ── Icon ─────────────────────────────────────────────────── */
.feature-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background var(--duration-normal) var(--ease-default);
}

.feature-icon {
  width: 26px;
  height: 26px;
  color: var(--color-primary);
  transition: color var(--duration-normal) var(--ease-default);
}

/* ── Content ─────────────────────────────────────────────── */
.feature-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.feature-title {
  font-size: var(--text-h3);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.feature-desc {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* ── Arrow ───────────────────────────────────────────────── */
.feature-arrow {
  align-self: flex-end;
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity var(--duration-fast) var(--ease-default),
    transform var(--duration-fast) var(--ease-spring);
}

.arrow-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}
</style>
