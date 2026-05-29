<script setup lang="ts">
/**
 * CartSidebar.vue
 * Desktop sidebar for displaying customer cart items, quantities,
 * and presenting the checkout primary actions with premium hierarchy.
 */

import { computed } from 'vue'
import type { CartItem } from '~/stores/cart.store'

const props = defineProps<{
  items: CartItem[]
  submitting?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  submit: []
  'update-qty': [cartItemId: string, qty: number]
  remove: [cartItemId: string]
}>()

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)

const totalPrice = computed(() =>
  props.items.reduce((sum, item) => sum + item.preview_subtotal, 0)
)

const totalQty = computed(() =>
  props.items.reduce((sum, item) => sum + item.quantity, 0)
)
</script>

<template>
  <aside class="hidden lg:flex flex-col w-80 xl:w-96 bg-white border-l border-stone-200 h-[calc(100dvh-56px)] lg:h-[calc(100dvh-64px)] sticky top-14 lg:top-16 shadow-sm">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-stone-150">
      <h2 class="text-sm font-extrabold text-stone-900 flex items-center gap-2 uppercase tracking-wide">
        <UIcon name="i-lucide-shopping-bag" class="size-4.5 text-amber-700 shrink-0" />
        <span>Keranjang Belanja</span>
        <span 
          v-if="totalQty > 0" 
          class="ml-auto px-2 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-black shadow-sm"
        >
          {{ totalQty }} Items
        </span>
      </h2>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="flex-1 flex flex-col items-center justify-center gap-4 px-5 text-center bg-stone-50/20">
      <div class="size-14 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-300 shrink-0 shadow-sm">
        <UIcon name="i-lucide-shopping-cart" class="size-6" />
      </div>
      <p class="text-xs sm:text-sm text-stone-500 font-semibold max-w-[200px]">Pilih menu dari daftar untuk mulai memesan.</p>
    </div>

    <!-- Items List -->
    <div v-else class="flex-1 overflow-y-auto bg-stone-50/10">
      <div class="divide-y divide-stone-150">
        <div v-for="item in items" :key="item.id" class="px-5 py-4 hover:bg-stone-50/30 transition-colors duration-150">
          <div class="flex items-start justify-between gap-3 mb-2.5">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-stone-900 leading-snug">{{ item.name }}</p>
              
              <!-- Selected variants list -->
              <div v-if="item.selected_variants.length > 0" class="mt-1.5 flex flex-wrap gap-1">
                <UBadge
                  v-for="v in item.selected_variants"
                  :key="v.variant_id"
                  :label="v.variant_name"
                  color="neutral"
                  variant="soft"
                  size="sm"
                  class="font-semibold text-[10px] rounded-full px-2 py-0"
                />
              </div>
              <p v-if="item.note" class="text-xs text-stone-500 mt-1.5 italic font-medium">“{{ item.note }}”</p>
            </div>
            
            <!-- Styled delete button (soft danger style) -->
            <button
              type="button"
              class="size-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
              aria-label="Hapus"
              @click="emit('remove', item.id)"
            >
              <UIcon name="i-lucide-trash-2" class="size-4" />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <!-- Stepper quantity control -->
            <div class="flex items-center gap-1.5 border border-stone-250 bg-white rounded-xl px-1.5 py-0.5 shadow-sm">
              <button
                type="button"
                class="size-8 rounded-lg text-amber-850 hover:bg-amber-50 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
                :disabled="item.quantity <= 1"
                @click="emit('update-qty', item.id, item.quantity - 1)"
              >
                <UIcon name="i-lucide-minus" class="size-3.5" />
              </button>
              <span class="text-xs font-black text-stone-900 w-5 text-center tabular-nums">
                {{ item.quantity }}
              </span>
              <button
                type="button"
                class="size-8 rounded-lg text-amber-850 hover:bg-amber-50 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
                @click="emit('update-qty', item.id, item.quantity + 1)"
              >
                <UIcon name="i-lucide-plus" class="size-3.5" />
              </button>
            </div>
            
            <span class="text-sm font-extrabold text-stone-900">
              {{ formatPrice(item.preview_subtotal) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Checkout Actions -->
    <div v-if="items.length > 0" class="border-t border-stone-200 p-5 space-y-4 bg-white shadow-lg">
      <!-- Preview subtotal -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-stone-500 font-semibold">Subtotal (estimasi)</span>
        <span class="text-base font-extrabold text-amber-700">{{ formatPrice(totalPrice) }}</span>
      </div>
      <p class="text-[10px] text-stone-400 font-semibold leading-normal">Harga akhir akan disesuaikan pada struk pembayaran kasir.</p>

      <!-- Alert Errors -->
      <UAlert
        v-slot:default
        v-if="error"
        icon="i-lucide-alert-circle"
        color="error"
        variant="soft"
        :description="error"
        class="rounded-xl border border-rose-200/50"
      />

      <!-- Premium Solid Primary Button -->
      <button
        type="button"
        :disabled="submitting"
        class="w-full min-h-[44px] px-6 py-3 rounded-xl bg-amber-700 text-white hover:bg-amber-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer text-sm"
        @click="emit('submit')"
      >
        <UIcon v-if="submitting" name="i-lucide-loader-2" class="size-4 animate-spin shrink-0" />
        <UIcon v-else name="i-lucide-shopping-bag" class="size-4 shrink-0" />
        <span>{{ submitting ? 'Mengirim...' : 'Pesan Sekarang' }}</span>
      </button>

      <p class="text-[10px] text-center text-stone-400 font-medium">
        Setelah memesan, Anda bisa membayar ke kasir atau via online QRIS.
      </p>
    </div>
  </aside>
</template>
