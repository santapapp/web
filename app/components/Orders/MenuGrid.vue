<script setup lang="ts">
import type { MenuProduct } from '~/types/customer-menu'

const props = defineProps<{
  products: MenuProduct[]
  loading?: boolean
  cartQtyMap?: Record<number, number>
}>()

const emit = defineEmits<{
  add: [product: MenuProduct]
  'open-detail': [product: MenuProduct]
}>()
</script>

<template>
  <div>
    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="bg-white rounded-2xl overflow-hidden border border-gray-100"
      >
        <USkeleton class="aspect-square w-full" />
        <div class="p-3 space-y-2">
          <USkeleton class="h-4 w-3/4 rounded" />
          <USkeleton class="h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="products.length === 0"
      class="flex flex-col items-center justify-center py-20 gap-3 text-center"
    >
      <UIcon name="i-lucide-utensils-crossed" class="size-12 text-gray-300" />
      <p class="text-sm text-gray-500">Menu tidak ditemukan</p>
    </div>

    <!-- Grid -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
    >
      <OrdersMenuCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :cart-qty="cartQtyMap?.[product.id] ?? 0"
        @add="emit('add', $event)"
        @open-detail="emit('open-detail', $event)"
      />
    </div>
  </div>
</template>
