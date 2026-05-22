<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :class="['btn', variantClass, sizeClass, { 'btn--disabled': disabled }]"
    :disabled="disabled || undefined"
    v-bind="$attrs"
  >
    <UIcon v-if="iconLeft" :name="iconLeft" class="btn-icon" />
    <slot />
    <UIcon v-if="iconRight" :name="iconRight" class="btn-icon" />
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

interface Props {
  variant?: 'primary' | 'outline' | 'ghost' | 'white' | 'outline-white'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  disabled?: boolean
  iconLeft?: string
  iconRight?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const variantClass = computed(() => `btn-${props.variant}`)
const sizeClass = computed(() => `btn-${props.size}`)
</script>

<style scoped>
.btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
