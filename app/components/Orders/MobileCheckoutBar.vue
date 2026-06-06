<script setup lang="ts">
/**
 * MobileCheckoutBar.vue
 * Sticky floating bottom bar — membuka tinjauan keranjang ("Lihat Keranjang"),
 * BUKAN membuat order langsung. Order baru dibuat dari dalam CartSheet.
 */

const props = defineProps<{
  totalQty: number
  totalPrice: number
}>()

const emit = defineEmits<{
  'view-cart': []
}>()

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="totalQty > 0"
      class="fixed bottom-4 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-40"
      role="complementary"
      aria-label="Keranjang pesanan"
    >
      <!-- Floating Dark Bar → buka tinjauan keranjang -->
      <button
        type="button"
        class="w-full min-h-14 px-5 py-3.5 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] shadow-2xl shadow-gray-900/30 font-bold flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer"
        @click="emit('view-cart')"
      >
        <!-- Left: qty badge + label -->
        <div class="flex items-center gap-3">
          <span class="size-7 rounded-xl bg-orange-600 text-white text-xs font-black flex items-center justify-center shrink-0">
            {{ totalQty }}
          </span>
          <span class="text-sm font-bold tracking-wide">Lihat Keranjang</span>
        </div>

        <!-- Right: price + icon -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-extrabold text-orange-400">{{ formatPrice(totalPrice) }}</span>
          <div class="size-7 rounded-xl bg-white/10 flex items-center justify-center">
            <UIcon name="i-lucide-shopping-bag" class="size-4" />
          </div>
        </div>
      </button>
    </div>
  </Transition>
</template>
