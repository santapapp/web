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
    class="w-full min-h-[56px] px-6 py-3.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-orange-500/25 font-bold flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer"
    @click="emit('click')"
  >
    <span class="text-[15px] font-extrabold tracking-wide">{{ label }}</span>
    <span class="text-orange-200 font-bold">—</span>
    <span class="text-[15px] font-extrabold tracking-wide">{{ formatPrice(total) }}</span>
    <UIcon name="i-lucide-shopping-bag" class="size-5 ml-0.5" />
  </button>
</template>
