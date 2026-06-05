<script setup lang="ts">
/**
 * MobileCheckoutBar.vue
 * Sticky floating bottom checkout bar — dark background, floating with margin,
 * large rounded corners for premium floating effect.
 */

const props = defineProps<{
  totalQty: number
  totalPrice: number
  submitting?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  submit: []
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
      class="lg:hidden fixed bottom-4 inset-x-4 z-40"
      role="complementary"
      aria-label="Keranjang pesanan"
    >
      <!-- Error Alert -->
      <UAlert
        v-if="error"
        icon="i-lucide-alert-circle"
        color="error"
        variant="soft"
        :description="error"
        class="mb-2 rounded-2xl"
      />

      <!-- Floating Dark Bar -->
      <button
        type="button"
        :disabled="submitting"
        class="w-full min-h-[56px] px-5 py-3.5 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-2xl shadow-gray-900/30 font-bold flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer"
        @click="emit('submit')"
      >
        <!-- Left: qty badge + label -->
        <div class="flex items-center gap-3">
          <span class="size-7 rounded-xl bg-orange-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
            {{ totalQty }}
          </span>
          <span class="text-sm font-bold tracking-wide">
            {{ submitting ? 'Mengirim...' : 'Masukkan Keranjang!' }}
          </span>
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
