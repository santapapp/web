<template>
  <span :class="['ui-badge', variantClass]">
    <UIcon v-if="icon" :name="icon" class="badge-icon" />
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'brand' | 'subtle'
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const variantClass = computed(() => `ui-badge--${props.variant}`)
</script>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--radius-full);
  font-size: var(--text-caption);
  font-weight: 500;
  padding: 5px 12px;
  width: max-content;
  line-height: 1.4;
}

.badge-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* default */
.ui-badge--default {
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border);
  color: var(--color-text-secondary);
}

/* brand — orange pill */
.ui-badge--brand {
  background: var(--color-primary-light);
  border: 0.5px solid rgba(232, 119, 34, 0.25);
  color: var(--color-primary);
}

/* subtle — gray background */
.ui-badge--subtle {
  background: var(--color-bg-subtle);
  border: 0.5px solid var(--color-border);
  color: var(--color-text-secondary);
}
</style>
