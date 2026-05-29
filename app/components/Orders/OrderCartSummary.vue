<script setup lang="ts">
import type { CartItem } from '~/stores/cart.store'

const props = defineProps<{
  items: CartItem[]
}>()

const totalQty = computed(() => props.items.reduce((sum, item) => sum + item.quantity, 0))
const totalPrice = computed(() => props.items.reduce((sum, item) => sum + item.preview_subtotal, 0))

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4">
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-500">Item</span>
      <strong class="text-gray-950">{{ totalQty }}</strong>
    </div>
    <div class="mt-2 flex items-center justify-between text-sm">
      <span class="text-gray-500">Subtotal preview</span>
      <strong class="text-gray-950">{{ formatPrice(totalPrice) }}</strong>
    </div>
  </div>
</template>
