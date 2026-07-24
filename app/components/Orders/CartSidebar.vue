<script setup lang="ts">
/**
 * CartSidebar.vue
 * Desktop sidebar for displaying customer cart items, quantities,
 * and presenting the checkout primary actions with premium hierarchy.
 */

import { computed, ref, watch } from 'vue'
import type { CartItem } from '~/stores/cart.store'

const props = defineProps<{
  items: CartItem[]
  submitting?: boolean
  error?: string | null
  customerName?: string
  orderNote?: string
}>()

const emit = defineEmits<{
  submit: []
  'update-qty': [cartItemId: string, qty: number]
  remove: [cartItemId: string]
  'update-note': [cartItemId: string, note: string]
  'update:customerName': [name: string]
  'update:orderNote': [note: string]
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

const customerNameLocal = computed({
  get: () => props.customerName || '',
  set: (val: string) => emit('update:customerName', val)
})

const orderNoteLocal = computed({
  get: () => props.orderNote || '',
  set: (val: string) => emit('update:orderNote', val)
})

const itemNotes = ref<Record<string, string>>({})

watch(
  () => props.items,
  (newItems) => {
    const nextNotes: Record<string, string> = {}
    for (const item of newItems) {
      nextNotes[item.id] = itemNotes.value[item.id] ?? item.note ?? ''
    }
    itemNotes.value = nextNotes
  },
  { immediate: true, deep: true }
)

const updateItemNote = (cartItemId: string, noteText: string) => {
  emit('update-note', cartItemId, noteText)
}

const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (target) {
    target.blur()
  }
}
</script>

<template>
  <aside class="hidden lg:flex flex-col w-80 xl:w-96 bg-white border-l border-gray-100 h-[calc(100dvh-56px)] lg:h-[calc(100dvh-64px)] sticky top-14 lg:top-16 shadow-sm">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100">
      <div class="text-sm font-extrabold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
        <UIcon name="i-lucide-shopping-bag" class="size-4.5 text-orange-600 shrink-0" />
        <span>Keranjang Belanja</span>
        <span
          v-if="totalQty > 0"
          class="ml-auto px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black shadow-sm"
        >
          {{ totalQty }} Items
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-gray-50/20">
      <div class="w-full bg-white rounded-2xl border border-gray-100 shadow-xs p-8 flex flex-col items-center justify-center gap-2 text-center">
        <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-1 shrink-0">
          <UIcon name="i-lucide-shopping-bag" class="size-7 text-amber-700/60" />
        </div>
        <p class="text-sm font-bold text-stone-800">Keranjang Masih Kosong</p>
        <p class="text-xs text-stone-400 font-normal max-w-[220px] leading-relaxed">Pilih menu favoritmu dari daftar untuk mulai membuat pesanan.</p>
      </div>
    </div>

    <!-- Items List -->
    <div v-else class="flex-1 overflow-y-auto">
      <div class="divide-y divide-gray-50">
        <div v-for="item in items" :key="item.id" class="px-5 py-4 hover:bg-gray-50/50 transition-colors duration-150">
          <div class="flex items-start justify-between gap-3 mb-2.5">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 leading-snug">{{ item.name }}</p>

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

              <!-- Item note input -->
              <div class="mt-2">
                <UInput
                  :id="'sidebar-note-' + item.id"
                  v-model="itemNotes[item.id]"
                  @blur="updateItemNote(item.id, itemNotes[item.id] ?? '')"
                  @keydown.enter="handleBlur"
                  placeholder="Catatan menu..."
                  icon="i-lucide-pencil-line"
                  size="sm"
                  class="w-full"
                  color="neutral"
                  variant="outline"
                  :ui="{
                    base: 'rounded-xl border border-orange-200/80 bg-orange-50/10 ring-0 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 placeholder:text-slate-400 transition-all duration-200 h-9 text-xs pl-9 pr-3 shadow-xs',
                    leading: 'absolute inset-y-0 left-0 flex items-center justify-center pl-3 pointer-events-none',
                    leadingIcon: 'size-3.5 text-slate-400 shrink-0'
                  }"
                />
              </div>
            </div>

            <!-- Delete button -->
            <button
              type="button"
              class="size-8 rounded-full text-rose-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
              aria-label="Hapus"
              @click="emit('remove', item.id)"
            >
              <UIcon name="i-lucide-trash-2" class="size-4" />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <!-- Stepper quantity control -->
            <div class="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
              <button
                type="button"
                class="size-7 rounded-full text-orange-600 hover:bg-orange-50 active:scale-90 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                :disabled="item.quantity <= 1"
                @click="emit('update-qty', item.id, item.quantity - 1)"
              >
                <UIcon name="i-lucide-minus" class="size-3.5" />
              </button>
              <span class="text-xs font-black text-gray-900 w-5 text-center tabular-nums">
                {{ item.quantity }}
              </span>
              <button
                type="button"
                class="size-7 rounded-full text-orange-600 hover:bg-orange-50 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
                @click="emit('update-qty', item.id, item.quantity + 1)"
              >
                <UIcon name="i-lucide-plus" class="size-3.5" />
              </button>
            </div>

            <span class="text-sm font-extrabold text-gray-900">
              {{ formatPrice(item.preview_subtotal) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Customer Info & Global Order Notes -->
      <div class="px-5 py-5 border-t border-gray-100 bg-gray-50/20 space-y-4">
        <p class="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Informasi Pesanan</p>
        
        <div class="space-y-3.5">
          <div class="space-y-1.5">
            <label for="sidebar-customer-name" class="block text-[11px] font-bold text-gray-600 px-1">
              Nama Customer <span class="text-gray-400 font-medium normal-case">(Opsional)</span>
            </label>
            <UInput
              id="sidebar-customer-name"
              v-model="customerNameLocal"
              placeholder="Contoh: Ilham"
              icon="i-lucide-user"
              size="sm"
              class="w-full"
              color="neutral"
              variant="outline"
              :ui="{
                base: 'rounded-2xl border border-orange-200 bg-white ring-0 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 placeholder:text-slate-400 transition-all duration-200 h-11 text-xs pl-10 pr-3.5 shadow-xs',
                leading: 'absolute inset-y-0 left-0 flex items-center justify-center pl-3.5 pointer-events-none',
                leadingIcon: 'size-4 text-slate-400 shrink-0'
              }"
            />
          </div>

          <div class="space-y-1.5">
            <label for="sidebar-order-note" class="block text-[11px] font-bold text-gray-600 px-1">
              Catatan Pesanan <span class="text-gray-400 font-medium normal-case">(Opsional)</span>
            </label>
            <UTextarea
              id="sidebar-order-note"
              v-model="orderNoteLocal"
              placeholder="Contoh: antar ke meja setelah semua siap"
              :rows="2"
              size="sm"
              class="w-full"
              color="neutral"
              variant="outline"
              :ui="{
                base: 'rounded-2xl border border-orange-200 bg-white ring-0 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 placeholder:text-slate-400 transition-all duration-200 px-3.5 py-2.5 text-xs min-h-[64px] shadow-xs resize-none'
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Checkout Actions -->
    <div v-if="items.length > 0" class="border-t border-gray-100 p-5 space-y-4 bg-white">
      <!-- Preview subtotal -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500 font-semibold">Subtotal (estimasi)</span>
        <span class="text-base font-extrabold text-orange-600">{{ formatPrice(totalPrice) }}</span>
      </div>
      <p class="text-[10px] text-gray-400 font-semibold leading-normal">Harga akhir akan disesuaikan pada struk pembayaran kasir.</p>

      <!-- Alert Errors -->
      <UAlert
        v-slot:default
        v-if="error"
        icon="i-lucide-alert-circle"
        color="error"
        variant="soft"
        :description="error"
        class="rounded-xl"
      />

      <!-- Checkout Button -->
      <button
        type="button"
        :disabled="submitting"
        class="w-full min-h-[44px] px-6 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer text-sm"
        @click="emit('submit')"
      >
        <UIcon v-if="submitting" name="i-lucide-loader-2" class="size-4 animate-spin shrink-0" />
        <UIcon v-else name="i-lucide-shopping-bag" class="size-4 shrink-0" />
        <span>{{ submitting ? 'Mengirim...' : 'Pesan Sekarang' }}</span>
      </button>

      <p class="text-[10px] text-center text-gray-400 font-medium">
        Setelah memesan, Anda bisa membayar ke kasir atau via online QRIS.
      </p>
    </div>
  </aside>
</template>
