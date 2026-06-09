<script setup lang="ts">
/**
 * CartSheet.vue — Tinjauan keranjang fullscreen.
 *
 * Tampil sebagai overlay fullscreen yang menutup seluruh viewport untuk
 * memberikan pengalaman checkout terfokus (mobile-first).
 */

import { computed, ref, watch, onUnmounted } from 'vue'
import type { CartItem } from '~/stores/cart.store'

const props = defineProps<{
  open: boolean
  items: CartItem[]
  submitting?: boolean
  error?: string | null
  isOpenBill?: boolean
  paymentLocked?: boolean   // Open bill: payment pending → tidak bisa tambah item
  taxEnabled?: boolean
  taxRate?: number
  serviceChargeEnabled?: boolean
  serviceChargeRate?: number
  tableLabel?: string | null
  customerName?: string
  orderNote?: string
}>()

const emit = defineEmits<{
  close: []
  submit: []
  'add-more': []
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

const totalQty = computed(() =>
  props.items.reduce((sum, item) => sum + item.quantity, 0)
)

const subtotal = computed(() =>
  props.items.reduce((sum, item) => sum + item.preview_subtotal, 0)
)

const taxAmount = computed(() =>
  props.taxEnabled && props.taxRate
    ? Math.round((subtotal.value * props.taxRate) / 100)
    : 0
)

const serviceChargeAmount = computed(() =>
  props.serviceChargeEnabled && props.serviceChargeRate
    ? Math.round((subtotal.value * props.serviceChargeRate) / 100)
    : 0
)

const total = computed(() => subtotal.value + taxAmount.value + serviceChargeAmount.value)

// Writable computed properties untuk customerName dan orderNote
const customerNameLocal = computed({
  get: () => props.customerName || '',
  set: (val: string) => emit('update:customerName', val)
})

const orderNoteLocal = computed({
  get: () => props.orderNote || '',
  set: (val: string) => emit('update:orderNote', val)
})

// State lokal untuk melacak input catatan per item agar kursor ketik tetap stabil
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

// Client-only body scroll lock
watch(
  () => props.open,
  (isOpen) => {
    if (import.meta.client) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-90"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-90"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex justify-center bg-black/45 backdrop-blur-xs w-full h-dvh min-h-screen overflow-hidden"
      >
        <div class="bg-gray-50 flex flex-col w-full max-w-lg md:max-w-xl h-full shadow-2xl relative outline-none">
          <!-- Header (Sticky) -->
          <header class="sticky top-0 z-10 flex-shrink-0 flex items-center justify-between gap-2 px-4 py-3 bg-white border-b border-gray-100">
            <button
              type="button"
              class="size-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-90 transition-all duration-150 cursor-pointer"
              aria-label="Kembali ke menu"
              @click="emit('close')"
            >
              <UIcon name="i-lucide-arrow-left" class="size-5" />
            </button>

            <div class="flex flex-col items-center text-center">
              <h2 class="text-base font-extrabold text-gray-900 leading-none">Keranjang saat ini</h2>
              <span v-if="tableLabel" class="text-xs text-orange-600 font-semibold mt-1">{{ tableLabel.toLowerCase().includes('meja') ? tableLabel : 'Meja ' + tableLabel }}</span>
            </div>

            <span class="size-10 flex-shrink-0" aria-hidden="true" />
          </header>

          <!-- Scrollable content -->
          <div class="flex-1 overflow-y-auto px-4 pt-4 pb-8 space-y-5">
            <!-- Empty State -->
            <div
              v-if="items.length === 0"
              class="flex flex-col items-center justify-center gap-4 py-20 text-center"
            >
              <div class="size-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                <UIcon name="i-lucide-shopping-cart" class="size-6" />
              </div>
              <p class="text-sm text-gray-500 font-semibold max-w-[220px]">
                Keranjang masih kosong. Pilih menu untuk mulai memesan.
              </p>
            </div>

            <template v-else>
              <!-- Items card -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                <div v-for="item in items" :key="item.id" class="flex flex-col p-4 gap-3">
                  <div class="flex gap-3">
                    <!-- Thumbnail image / placeholder -->
                    <div class="size-16 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 via-gray-50 to-gray-100 flex items-center justify-center shrink-0 border border-gray-100">
                      <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                      <UIcon v-else name="i-lucide-utensils" class="size-6 text-gray-300" />
                    </div>

                    <div class="flex-1 min-w-0 flex flex-col justify-between">
                      <!-- Name + remove -->
                      <div class="flex items-start justify-between gap-2">
                        <div>
                          <p class="text-sm font-extrabold text-gray-900 leading-snug">{{ item.name }}</p>
                          <p class="text-xs text-gray-500 font-medium mt-0.5">
                            {{ formatPrice(item.preview_subtotal / item.quantity) }}
                          </p>
                        </div>
                        <button
                          type="button"
                          class="size-7 rounded-full text-rose-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                          aria-label="Hapus item"
                          @click="emit('remove', item.id)"
                        >
                          <UIcon name="i-lucide-trash-2" class="size-4" />
                        </button>
                      </div>

                      <!-- Variants -->
                      <div v-if="item.selected_variants.length > 0" class="mt-1 flex flex-wrap gap-1">
                        <span
                          v-for="v in item.selected_variants"
                          :key="v.variant_id"
                          class="inline-flex items-center text-[10px] bg-gray-50 text-gray-600 border border-gray-200/60 font-semibold px-2 py-0.5 rounded-md"
                        >
                          {{ v.variant_name }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Price + Quantity Stepper -->
                  <div class="flex items-center justify-between mt-1 pt-1.5 border-t border-gray-50">
                    <div class="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                      <button
                        type="button"
                        class="size-7 rounded-full text-orange-600 hover:bg-orange-50 active:scale-90 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                        :disabled="item.quantity <= 1"
                        aria-label="Kurangi"
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
                        aria-label="Tambah"
                        @click="emit('update-qty', item.id, item.quantity + 1)"
                      >
                        <UIcon name="i-lucide-plus" class="size-3.5" />
                      </button>
                    </div>

                    <span class="text-sm font-extrabold text-gray-900">
                      {{ formatPrice(item.preview_subtotal) }}
                    </span>
                  </div>

                  <!-- Item note input -->
                  <div class="mt-1">
                    <UInput
                      :id="'note-' + item.id"
                      v-model="itemNotes[item.id]"
                      @blur="updateItemNote(item.id, itemNotes[item.id] ?? '')"
                      @keydown.enter="handleBlur"
                      placeholder="Catatan untuk menu ini (contoh: tidak pedas)..."
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

                <!-- Add more row -->
                <button
                  type="button"
                  class="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50/70 transition-colors cursor-pointer"
                  @click="emit('add-more')"
                >
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-gray-900">Ada lagi yang mau dibeli?</p>
                    <p class="text-xs text-gray-400 font-medium">Masih bisa nambah menu lain, yuk.</p>
                  </div>
                  <span class="flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-orange-200 text-orange-600 text-xs font-bold flex-shrink-0">
                    <UIcon name="i-lucide-plus" class="size-3.5" />
                    Tambah
                  </span>
                </button>
              </div>

              <!-- Customer Info & Global Order Notes -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                <div class="border-b border-gray-100 pb-3">
                  <h3 class="text-sm font-extrabold text-gray-900">Informasi Pesanan</h3>
                </div>
                
                <div class="space-y-4">
                  <div class="space-y-1.5">
                    <label for="customer-name" class="block text-xs font-extrabold text-gray-700 uppercase tracking-wide px-1">
                      Nama Customer <span class="text-gray-400 font-semibold normal-case">(Opsional)</span>
                    </label>
                    <UInput
                      id="customer-name"
                      v-model="customerNameLocal"
                      placeholder="Contoh: Ilham"
                      icon="i-lucide-user"
                      size="md"
                      class="w-full"
                      color="neutral"
                      variant="outline"
                      :ui="{
                        base: 'rounded-2xl border border-orange-200 bg-white ring-0 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 placeholder:text-slate-400 transition-all duration-200 h-12 text-sm pl-11 pr-4 shadow-xs',
                        leading: 'absolute inset-y-0 left-0 flex items-center justify-center pl-4 pointer-events-none',
                        leadingIcon: 'size-4.5 text-slate-400 shrink-0'
                      }"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label for="order-note" class="block text-xs font-extrabold text-gray-700 uppercase tracking-wide px-1">
                      Catatan Pesanan <span class="text-gray-400 font-semibold normal-case">(Opsional)</span>
                    </label>
                    <UTextarea
                      id="order-note"
                      v-model="orderNoteLocal"
                      placeholder="Contoh: antar ke meja setelah semua siap"
                      :rows="2"
                      size="md"
                      class="w-full"
                      color="neutral"
                      variant="outline"
                      :ui="{
                        base: 'rounded-2xl border border-orange-200 bg-white ring-0 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 placeholder:text-slate-400 transition-all duration-200 px-4 py-3 text-sm min-h-[80px] shadow-xs resize-none'
                      }"
                    />
                  </div>
                </div>
              </div>

              <!-- Payment summary -->
              <div class="mt-6">
                <h3 class="text-sm font-extrabold text-gray-900 mb-4 px-1">Ringkasan Pembayaran</h3>
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 font-semibold">Subtotal</span>
                    <span class="font-bold text-gray-700">{{ formatPrice(subtotal) }}</span>
                  </div>
                  <div v-if="taxAmount > 0" class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 font-semibold">PPN {{ taxRate }}%</span>
                    <span class="font-bold text-gray-700">{{ formatPrice(taxAmount) }}</span>
                  </div>
                  <div v-if="serviceChargeAmount > 0" class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 font-semibold">Biaya Layanan {{ serviceChargeRate }}%</span>
                    <span class="font-bold text-gray-700">{{ formatPrice(serviceChargeAmount) }}</span>
                  </div>
                  <div class="border-t border-dashed border-gray-200 pt-2.5 flex items-center justify-between">
                    <span class="text-sm font-extrabold text-gray-900">Total Bayar</span>
                    <span class="text-base font-extrabold text-orange-600">{{ formatPrice(total) }}</span>
                  </div>
                </div>
                <p class="text-[11px] text-gray-400 font-semibold leading-normal mt-3 px-1">
                  Estimasi. Harga akhir akan disesuaikan pada struk pembayaran kasir.
                </p>
              </div>
            </template>
          </div>

          <!-- Sticky footer CTA -->
          <div
            v-if="items.length > 0"
            class="flex-shrink-0 border-t border-gray-100 bg-white px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))] space-y-3"
          >
            <!-- Payment locked banner (open bill dengan payment pending) -->
            <div
              v-if="paymentLocked"
              class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5"
            >
              <UIcon name="i-lucide-lock" class="size-4.5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-extrabold text-amber-900">Pesanan Terkunci</p>
                <p class="text-xs text-amber-700 font-medium mt-0.5 leading-relaxed">
                  Pembayaran sedang menunggu konfirmasi. Selesaikan atau batalkan pembayaran terlebih dahulu.
                </p>
              </div>
            </div>

            <UAlert
              v-slot:default
              v-if="error"
              icon="i-lucide-alert-circle"
              color="error"
              variant="soft"
              :description="error"
              class="rounded-xl"
            />

            <button
              type="button"
              :disabled="submitting || paymentLocked"
              class="w-full min-h-[56px] px-6 py-3.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-orange-500/20 font-bold flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer"
              @click="emit('submit')"
            >
              <span class="flex items-center gap-2.5">
                <span class="size-7 rounded-xl bg-white/15 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  {{ totalQty }}
                </span>
                <span class="text-[15px] font-extrabold tracking-wide">
                  {{ submitting ? 'Mengirim...' : isOpenBill ? 'Tambah ke Pesanan' : 'Pesan Sekarang' }}
                </span>
              </span>
              <span class="flex items-center gap-2">
                <span class="text-[15px] font-extrabold tracking-wide">{{ formatPrice(total) }}</span>
                <UIcon v-if="submitting" name="i-lucide-loader-2" class="size-5 animate-spin" />
                <UIcon v-else name="i-lucide-shopping-bag" class="size-5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
