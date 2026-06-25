<script setup lang="ts">
/**
 * StickyCartButton.vue
 * Tombol CTA sticky di bawah detail item — full width, rounded-full, solid orange brand.
 * Label dinamis (mis. "Tambah ke Keranjang") + total harga + icon bag.
 *
 * Presentational only — total & label dikirim parent, klik di-emit balik.
 */

defineProps<{
  label: string
  total: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    class="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-orange-500/10 font-bold flex items-center justify-between transition-all duration-150 cursor-pointer whitespace-nowrap"
    @click="emit('click')"
  >
    <div class="flex items-center gap-1.5 min-w-0">
      <UIcon name="i-lucide-shopping-bag" class="size-4 shrink-0 text-orange-100" />
      <span class="text-xs font-bold tracking-wide truncate">{{ label }}</span>
    </div>
    <span class="text-xs font-bold tracking-wide shrink-0 bg-white/12 px-2 py-0.5 rounded border border-white/10">
      {{ formatPrice(total) }}
    </span>
  </button>
</template>
