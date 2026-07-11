<script setup lang="ts">
/**
 * OpenBillSessionView — Halaman detail sesi Open Bill aktif.
 *
 * Ditampilkan di orders.vue saat customer memiliki sesi open bill aktif.
 * Menampilkan:
 *   - Status sesi (aktif / locked saat payment pending)
 *   - Daftar item yang sudah dipesan
 *   - Total sementara
 *   - CTA: Tambah Pesanan | Bayar Total Pesanan
 *   - QR Code link sesi untuk dibagikan ke orang lain
 */

import type { CustomerOrderDetail } from '~/types/customer-order'

const props = defineProps<{
  order: CustomerOrderDetail | null
  loading?: boolean
  orgSlug: string
  billToken: string
}>()

const emit = defineEmits<{
  'add-more': []
  'payment-initiated': []
  'exit-session': []
}>()

const router = useRouter()
const api = useCustomerApi()
const sessionStore = useCustomerSessionStore()

// ── Payment State ─────────────────────────────────────────────────────────
const payPending = ref(false)
const payError = ref<string | null>(null)

// ── QR Share Modal ────────────────────────────────────────────────────────
const showQrModal = ref(false)
const shareUrl = computed(() => {
  if (!import.meta.client) return ''
  const origin = window.location.origin
  return `${origin}/o/${props.orgSlug}/orders?bill=${props.billToken}`
})
const qrImageUrl = computed(() => {
  if (!shareUrl.value) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(shareUrl.value)}&bgcolor=ffffff&color=1a1714&margin=2`
})

const copySuccess = ref(false)
const copyLink = async () => {
  if (!import.meta.client) return
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  } catch {
    // Fallback: select text
  }
}

// ── Computed from order ───────────────────────────────────────────────────
const isPaymentPending = computed(() =>
  props.order?.payment_status === 'pending'
)

const isBillClosed = computed(() =>
  props.order?.bill_status === 'closed' || props.order?.bill_status === 'cancelled'
)

const isPaid = computed(() => props.order?.payment_status === 'paid')

const rootItems = computed(() =>
  (props.order?.items ?? []).filter(i => !i.parent_item_id)
)

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)

// ── Inisiasi Payment QRIS ─────────────────────────────────────────────────
const handlePayNow = async () => {
  if (payPending.value) return
  payPending.value = true
  payError.value = null

  try {
    await api.initiateQris()
    // Redirect ke halaman payment dengan bill token
    await router.push({
      path: `/o/${props.orgSlug}/payments`,
      query: { bill: props.billToken }
    })
    emit('payment-initiated')
  } catch (err: any) {
    payError.value = err?.message ?? 'Gagal memulai pembayaran. Coba lagi.'
  } finally {
    payPending.value = false
  }
}

// Warna badge status item
const itemStatusColor = (status: string | null) => {
  switch (status) {
    case 'served': return 'text-emerald-700 bg-emerald-50 border-emerald-100'
    case 'ready': return 'text-blue-700 bg-blue-50 border-blue-100'
    case 'preparing': return 'text-amber-700 bg-amber-50 border-amber-100'
    case 'confirmed': return 'text-violet-700 bg-violet-50 border-violet-100'
    case 'cancelled': return 'text-stone-400 bg-stone-50 border-stone-100'
    default: return 'text-stone-500 bg-stone-50 border-stone-100'
  }
}

const itemStatusLabel = (status: string | null) => {
  switch (status) {
    case 'served': return 'Tersaji'
    case 'ready': return 'Siap'
    case 'preparing': return 'Dimasak'
    case 'confirmed': return 'Dikonfirmasi'
    case 'pending': return 'Pending'
    case 'cancelled': return 'Dibatalkan'
    default: return status ?? '-'
  }
}

const overlayStore = useUiOverlayStore()

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  if (!target) return
  overlayStore.openBillHeaderPassed = target.scrollTop > 50
}

onMounted(() => {
  overlayStore.openBillHeaderPassed = false
})

onUnmounted(() => {
  overlayStore.openBillHeaderPassed = false
})
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0 bg-gray-50">
    <!-- Main scroll container -->
    <div class="flex-1 overflow-y-auto" @scroll="handleScroll">
      <!-- Header Banner -->
      <header class="flex-shrink-0 bg-emerald-50/50 border-b border-emerald-100 shadow-none">
        <div class="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8">
          <div class="flex flex-col min-w-0">
            <div class="text-base sm:text-lg font-black text-emerald-950 leading-tight">Pesanan Open Bill</div>
            <p v-if="order?.order_number" class="text-xs sm:text-sm text-emerald-700/95 font-bold font-mono mt-0.5">
              #{{ order.order_number }}
            </p>
          </div>

          <!-- Badge status sesi & Aksi Cepat -->
          <div class="flex items-center gap-2 shrink-0">
            <div
              v-if="isBillClosed || isPaid"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-500 border border-stone-200"
            >
              <span class="size-1.5 rounded-full bg-stone-400" />
              Sesi Selesai
            </div>
            <div
              v-else-if="isPaymentPending"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-750 border border-amber-200 animate-pulse"
            >
              <span class="size-1.5 rounded-full bg-amber-500" />
              Menunggu Bayar
            </div>

            <!-- Share QR Button -->
            <button
              type="button"
              class="size-9 rounded-xl flex items-center justify-center text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200 bg-white/80 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
              title="Bagikan QR Sesi"
              @click="showQrModal = true"
            >
              <UIcon name="i-lucide-qr-code" class="size-4.5" />
            </button>

            <!-- Keluar Sesi Button -->
            <button
              type="button"
              class="size-9 rounded-xl flex items-center justify-center text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 bg-white/80 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
              title="Keluar Sesi"
              @click="emit('exit-session')"
            >
              <UIcon name="i-lucide-log-out" class="size-4.5" />
            </button>
          </div>
        </div>
      </header>

    <!-- Content -->
    <div class="w-full max-w-lg lg:max-w-5xl mx-auto px-4 py-5 space-y-4 lg:space-y-5">

        <!-- Loading skeleton -->
        <template v-if="loading">
          <div class="space-y-3">
            <div class="h-28 bg-stone-200/60 rounded-3xl animate-pulse" />
            <div class="h-40 bg-stone-200/60 rounded-3xl animate-pulse" />
            <div class="h-24 bg-stone-200/60 rounded-3xl animate-pulse" />
          </div>
        </template>

        <template v-else>

          <!-- ── Payment Pending Banner ── -->
          <div
            v-if="isPaymentPending"
            class="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4 flex items-start gap-3"
          >
            <div class="size-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <UIcon name="i-lucide-clock" class="size-4.5 text-amber-700" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-amber-900">Pembayaran Sedang Berlangsung</p>
              <p class="text-xs text-amber-700 font-normal mt-0.5 leading-relaxed">
                Selesaikan atau batalkan pembayaran sebelum menambah pesanan baru.
              </p>
              <button
                type="button"
                class="mt-3 text-xs font-extrabold text-amber-800 underline underline-offset-2 cursor-pointer hover:text-amber-900"
                @click="router.push({ path: `/o/${orgSlug}/payments`, query: { bill: billToken } })"
              >
                Lihat Status Pembayaran →
              </button>
            </div>
          </div>

          <!-- ── Bill Closed / Paid Banner ── -->
          <div
            v-else-if="isBillClosed || isPaid"
            class="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-4 flex items-start gap-3"
          >
            <div class="size-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
              <UIcon name="i-lucide-check-circle-2" class="size-4.5 text-emerald-700" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-emerald-900">Sesi Open Bill Selesai</p>
              <p class="text-xs text-emerald-700 font-normal mt-0.5 leading-relaxed">
                Tagihan sudah dibayar. Terima kasih sudah memesan! ❤️
              </p>
            </div>
          </div>

          <!-- ── Info Banner (sesi aktif, belum ada item) ── -->
          <div
            v-else-if="!order?.items?.length"
            class="bg-orange-50/60 border border-orange-200/60 rounded-2xl px-4 py-4 flex items-start gap-3"
          >
            <div class="size-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0 mt-0.5">
              <UIcon name="i-lucide-receipt" class="size-4.5 text-orange-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-orange-900">Belum Ada Pesanan</p>
              <p class="text-xs text-orange-700/80 font-normal mt-0.5 leading-relaxed">
                Tambahkan menu untuk mulai memesan di sesi open bill ini.
              </p>
            </div>
          </div>

          <!-- ── Info Banner sesi aktif dengan item ── -->
          <div
            <div
            v-else
            class="bg-blue-50/60 border border-blue-200/50 rounded-xl px-3 py-2 flex items-center gap-2.5"
          >
            <UIcon name="i-lucide-info" class="size-4 text-blue-600 shrink-0" />
            <p class="text-[10px] text-blue-800 font-semibold leading-relaxed">
              Pembayaran dilakukan di akhir. Anda bisa menambah pesanan berkali-kali.
            </p>
          </div>

          <!-- ── Item List ── -->
          <div v-if="rootItems.length > 0" class="bg-white rounded-xl border border-stone-200/60 shadow-sm overflow-hidden">
            <div class="flex items-center justify-between px-3 py-2.5 border-b border-stone-100">
              <div class="text-xs font-semibold text-stone-900 flex items-center gap-2">
                <UIcon name="i-lucide-utensils" class="size-3.5 text-orange-500" />
                Item Pesanan
              </div>
              <span class="text-[10px] font-bold text-stone-400">{{ rootItems.length }} item</span>
            </div>

            <div class="divide-y divide-stone-50">
              <div
                v-for="item in rootItems"
                :key="item.id"
                class="flex gap-2.5 px-3 py-2.5"
              >
                <!-- Thumbnail -->
                <div class="size-10 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-stone-100 flex items-center justify-center shrink-0 border border-stone-100">
                  <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                  <UIcon v-else name="i-lucide-utensils" class="size-4 text-stone-300" />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-xs font-semibold text-stone-900 leading-snug truncate">{{ item.name }}</p>
                      <!-- Children (variants/addons) -->
                      <div v-if="item.children?.length" class="mt-0.5 flex flex-wrap gap-1">
                        <span
                          v-for="child in item.children"
                          :key="child.id"
                          class="text-[9px] text-stone-500 bg-stone-50 border border-stone-200/60 font-medium px-1.5 py-0.5 rounded"
                        >
                          {{ child.name }}
                        </span>
                      </div>
                    </div>
                    <!-- Status badge -->
                    <span
                      v-if="item.item_status"
                      class="shrink-0 text-[9px] font-bold px-1.5 py-0.2 rounded-full border"
                      :class="itemStatusColor(item.item_status)"
                    >
                      {{ itemStatusLabel(item.item_status) }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between mt-1.5">
                    <span class="text-[10px] text-stone-404 font-semibold">× {{ item.quantity }}</span>
                    <span class="text-xs font-bold text-stone-800">{{ formatCurrency(item.subtotal) }}</span>
                  </div>

                  <!-- Item note -->
                  <p v-if="item.note" class="text-[10px] text-stone-400 font-medium mt-0.5 italic">
                    "{{ item.note }}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Financial Summary ── -->
          <div v-if="order" class="bg-white rounded-xl border border-stone-200/60 shadow-sm p-3 space-y-3">
            <div class="text-[10px] font-bold uppercase tracking-wider text-stone-500 pb-2 border-b border-stone-100">
              Ringkasan Tagihan
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-stone-500 font-semibold">Subtotal</span>
                <span class="font-semibold text-stone-700">{{ formatCurrency(order.subtotal_amount) }}</span>
              </div>
              <div v-if="order.discount_amount > 0" class="flex justify-between text-emerald-600">
                <span class="font-semibold">Diskon</span>
                <span class="font-semibold">-{{ formatCurrency(order.discount_amount) }}</span>
              </div>
              <div v-if="order.service_charge_amount > 0" class="flex justify-between">
                <span class="text-stone-500 font-semibold">Biaya Layanan</span>
                <span class="font-semibold text-stone-700">{{ formatCurrency(order.service_charge_amount) }}</span>
              </div>
              <div v-if="order.tax_amount > 0" class="flex justify-between">
                <span class="text-stone-500 font-semibold">Pajak</span>
                <span class="font-semibold text-stone-700">{{ formatCurrency(order.tax_amount) }}</span>
              </div>
              <div class="border-t border-dashed border-stone-200 pt-2 flex justify-between items-baseline">
                <span class="text-xs font-bold text-stone-900 uppercase tracking-wide">Total</span>
                <span class="text-sm font-black text-orange-600 tracking-tight">{{ formatCurrency(order.total_amount) }}</span>
              </div>
            </div>
          </div>

          <!-- ── CTA Actions ── -->
          <div class="space-y-2 pb-6">
            <!-- Bayar Total (hanya saat sesi aktif dan ada item dan payment bukan paid) -->
            <button
              v-if="!isBillClosed && !isPaid && rootItems.length > 0"
              type="button"
              :disabled="payPending"
              class="w-full min-h-[38px] rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 active:scale-[0.98] transition-all duration-150 shadow-md shadow-orange-600/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              @click="handlePayNow"
            >
              <UIcon v-if="payPending" name="i-lucide-loader-2" class="size-4 animate-spin" />
              <UIcon v-else name="i-lucide-credit-card" class="size-4" />
              <span>{{ payPending ? 'Mempersiapkan...' : `Bayar Total — ${formatCurrency(order?.total_amount ?? 0)}` }}</span>
            </button>

            <p v-if="payError" class="text-xs text-rose-600 text-center font-bold px-2">{{ payError }}</p>

            <!-- Tambah Pesanan Lagi -->
            <button
              v-if="!isBillClosed && !isPaid"
              type="button"
              class="w-full min-h-[38px] rounded-lg bg-stone-900 text-white font-bold hover:bg-stone-850 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-stone-900/10 text-xs"
              @click="emit('add-more')"
            >
              <UIcon name="i-lucide-plus" class="size-4" />
              <span>Tambah Pesanan</span>
            </button>

            <!-- Pesan Baru (setelah sesi selesai) -->
            <button
              v-if="isBillClosed || isPaid"
              type="button"
              class="w-full min-h-[38px] rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 active:scale-[0.98] transition-all duration-150 shadow-md shadow-orange-600/25 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              @click="router.push(`/o/${orgSlug}/orders`)"
            >
              <UIcon name="i-lucide-refresh-ccw" class="size-4" />
              <span>Pesan Lagi</span>
            </button>

            <!-- Share QR Button (selalu ada, selama sesi belum closed) -->
            <button
              v-if="!isBillClosed && !isPaid"
              type="button"
              class="w-full min-h-[34px] rounded-lg bg-stone-100 text-stone-700 font-bold hover:bg-stone-200/80 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
              @click="showQrModal = true"
            >
              <UIcon name="i-lucide-share-2" class="size-3.5" />
              <span>Bagikan Sesi ke Teman</span>
            </button>

            <!-- Keluar Sesi Button (selalu ada) -->
            <button
              type="button"
              class="w-full min-h-[34px] rounded-lg bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
              @click="emit('exit-session')"
            >
              <UIcon name="i-lucide-log-out" class="size-3.5" />
              <span>Keluar dari Sesi Ini</span>
            </button>
          </div>

        </template>
      </div>
    </div>

    <!-- ── QR Share Modal ─────────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-250 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showQrModal"
          class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click.self="showQrModal = false"
        >
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="translate-y-8 opacity-0 scale-95"
            enter-to-class="translate-y-0 opacity-100 scale-100"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100 scale-100"
            leave-to-class="translate-y-4 opacity-0 scale-95"
            appear
          >
            <div
              v-if="showQrModal"
              class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <!-- Modal header -->
              <div class="relative px-5 pt-5 pb-3.5 text-center border-b border-stone-100">
                <button
                  type="button"
                  class="absolute top-3.5 right-3.5 size-7 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Tutup modal"
                  @click="showQrModal = false"
                >
                  <UIcon name="i-lucide-x" class="size-4" />
                </button>
                <div class="size-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-2.5">
                  <UIcon name="i-lucide-qr-code" class="size-5 text-orange-600" />
                </div>
                <div class="text-sm font-bold text-stone-900">Bagikan Sesi Open Bill</div>
                <p class="text-xs text-stone-400 mt-1 leading-relaxed">
                  Scan QR ini untuk bergabung dan memesan bersama.
                </p>
              </div>

              <!-- QR Code -->
              <div class="px-5 py-5 flex flex-col items-center gap-4">
                <!-- QR Image — clean, no corner decorations -->
                <div class="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs inline-flex items-center justify-center">
                  <img
                    :src="qrImageUrl"
                    alt="QR Code sesi Open Bill — pindai untuk bergabung ke sesi yang sama"
                    class="size-44 sm:size-48 object-contain block"
                    loading="lazy"
                  />
                </div>

                <!-- Order number badge -->
                <div class="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-full px-3.5 py-1.5">
                  <UIcon name="i-lucide-receipt" class="size-3.5 text-stone-400 shrink-0" />
                  <span class="text-xs font-bold text-stone-700 font-mono tracking-wide">
                    {{ order?.order_number ?? '—' }}
                  </span>
                </div>

                <!-- Helper text -->
                <p class="text-center text-xs text-stone-400 font-medium leading-relaxed max-w-[220px]">
                  Siapapun yang scan QR ini bisa memesan di sesi yang sama.
                </p>
              </div>

              <!-- Footer button -->
              <div class="px-5 pb-5">
                <button
                  type="button"
                  class="w-full h-11 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer text-sm"
                  @click="showQrModal = false"
                >
                  Tutup
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
