<script setup lang="ts">
/**
 * MobileCheckoutBar.vue
 * Sticky bottom checkout bar displayed on mobile when there are active items in the cart.
 * Designed to provide immediate feedback and primary checkout action.
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
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-y-full"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-to-class="translate-y-full"
  >
    <div
      v-if="totalQty > 0"
      class="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] px-5 pt-3.5 pb-[max(16px,env(safe-area-inset-bottom))] z-40"
      role="complementary"
      aria-label="Keranjang pesanan"
    >
      <!-- Alert Errors -->
      <UAlert
        v-if="error"
        icon="i-lucide-alert-circle"
        color="error"
        variant="soft"
        :description="error"
        class="mb-3 rounded-xl border border-rose-200/50"
      />

      <!-- Premium Solid Primary Checkout Button -->
      <button
        type="button"
        :disabled="submitting"
        class="w-full min-h-[44px] px-5 py-3 rounded-xl bg-amber-700 text-white hover:bg-amber-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-md font-bold flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer text-sm"
        @click="emit('submit')"
      >
        <div class="flex items-center gap-2.5">
          <!-- Total quantity badge inside button -->
          <span class="size-6 rounded-lg bg-white/20 text-white text-xs font-black flex items-center justify-center shadow-inner">
            {{ totalQty }}
          </span>
          <span class="text-left font-black tracking-wide">
            {{ submitting ? 'Mengirim...' : 'Pesan Sekarang' }}
          </span>
        </div>
        
        <div class="flex items-center gap-1">
          <span class="font-black text-amber-100">{{ formatPrice(totalPrice) }}</span>
          <UIcon name="i-lucide-chevron-right" class="size-4 text-amber-100" />
        </div>
      </button>
    </div>
  </Transition>
</template>
