<script setup lang="ts">
/**
 * QuantityControl.vue
 * Kontrol jumlah item: label "JUMLAH" + tombol minus/plus berbentuk circle outline
 * dengan angka quantity di tengah.
 *
 * Presentational only — quantity state dipegang parent via v-model.
 */

const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const minValue = computed(() => props.min ?? 1)

const decrease = () => {
  if (props.modelValue <= minValue.value) return
  emit('update:modelValue', props.modelValue - 1)
}

const increase = () => {
  if (props.max != null && props.modelValue >= props.max) return
  emit('update:modelValue', props.modelValue + 1)
}
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <span class="text-xs font-extrabold uppercase tracking-wider text-gray-700">
      Jumlah
    </span>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="size-9 rounded-full border-2 border-orange-500 text-orange-600 flex items-center justify-center hover:bg-orange-50 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
        :disabled="modelValue <= minValue"
        aria-label="Kurangi jumlah"
        @click="decrease"
      >
        <UIcon name="i-lucide-minus" class="size-4" />
      </button>

      <span class="text-base font-extrabold text-gray-900 w-7 text-center tabular-nums">
        {{ modelValue }}
      </span>

      <button
        type="button"
        class="size-9 rounded-full border-2 border-orange-500 text-orange-600 flex items-center justify-center hover:bg-orange-50 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
        :disabled="max != null && modelValue >= max"
        aria-label="Tambah jumlah"
        @click="increase"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
      </button>
    </div>
  </div>
</template>
