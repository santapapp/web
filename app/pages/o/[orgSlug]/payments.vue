<script setup lang="ts">
definePageMeta({
  layout: 'org',
  middleware: ['org-exists']
})

const route = useRoute()
const router = useRouter()
const orgSlug = computed(() => String(route.params.orgSlug || ''))

// Composables
const customerSession = useCustomerSession()
const sessionStore = useCustomerSessionStore()
const { openBill, billPending, fetchOpenBill, fetchOrderStatus, fetchPublicPaymentStatus } = useCustomerOrder()
const {
  payment,
  isPaid,
  isFailed,
  isExpired,
  countdown,
  isPolling,
  initiatePending,
  cancelPending,
  initiatePayment,
  setExternalPayment,
  startPolling,
  stopPolling,
  cancelPayment
} = useCustomerPayment()

// State
const sessionError = ref<string | null>(null)
const initError = ref<string | null>(null)
const qrDataUrl = ref<string | null>(null)
// true jika halaman ini melacak TABLE ORDER (query ?order=), false untuk open bill (?bill=)
const isTableOrderPage = ref(false)

// Saat pembayaran sukses: catat reference ke history & bersihkan cart.
// Table order BUKAN session — JANGAN buat ulang session meja apa pun.
watch(isPaid, (newVal) => {
  if (newVal) {
    if (openBill.value) {
      const raw = openBill.value
      const isOpenBillOrder = customerSession.sessionMode.value === 'open_bill'
      const history = useOrderHistory(orgSlug.value)
      history.addOrUpdate({
        order_public_id: raw.public_token,
        order_code: raw.order_number,
        order_id: raw.order_id ?? raw.id ?? undefined,
        public_token: raw.public_token ?? undefined,
        org_slug: orgSlug.value,
        org_name: customerSession.organization.value?.name ?? undefined,
        table_label: raw.dining_table?.name ?? raw.dining_table?.code ?? undefined,
        mode: isOpenBillOrder ? 'open_bill' : 'table',
        status: mapToHistoryStatus(raw.order_status, raw.payment_status, raw.bill_status),
        total_amount: Number(raw.total_amount ?? 0),
        created_at: raw.created_at ?? new Date().toISOString(),
        last_seen_at: new Date().toISOString()
      })
    }

    const isOpenBill = customerSession.sessionMode.value === 'open_bill'

    // Bersihkan cart sesuai mode
    const cartMode = isOpenBill ? 'open_bill' : 'table_order'
    const cart = useOrderCart(ref(cartMode))
    cart.clearCart()

    // Open bill: clear session (sudah selesai dibayar). Table order: tidak ada session
    // yang perlu dipertahankan maupun dibuat ulang.
    customerSession.clearSession()

    // Auto-redirect ke tracking status setelah 2 detik
    const orderNumber = openBill.value?.order_number
    if (orderNumber) {
      setTimeout(() => {
        router.push({
          path: `/o/${orgSlug.value}/orders`,
          query: { order: orderNumber }
        })
      }, 2000)
    }
  }
})

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

// Format countdown (detik) menjadi mm:ss
const formatCountdown = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Generate QR code dari qr_string menggunakan canvas API
const generateQrDataUrl = async (qrString: string): Promise<string> => {
  if (qrString.startsWith('http')) {
    return qrString
  }
  // Gunakan QR API publik untuk generate QR image
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrString)}&bgcolor=ffffff&color=1a1714&margin=2`
}

// Inisiasi pembayaran dan generate QR
const handleInitiatePayment = async () => {
  initError.value = null
  qrDataUrl.value = null

  const result = await initiatePayment()

  if (!result.success || !result.data) {
    initError.value = result.error?.message ?? 'Gagal memulai pembayaran QRIS.'
    return
  }

  // qr_url adalah URL langsung dari API — bisa berupa URL atau QRIS string
  const qrUrl = result.data.qr_url
  if (qrUrl) {
    qrDataUrl.value = await generateQrDataUrl(qrUrl)
    // Mulai polling setelah QR ditampilkan (tidak perlu argumen — token di header)
    startPolling()
  }
}

// Batalkan pembayaran
const handleCancelPayment = async () => {
  if (!payment.value) return
  await cancelPayment()
  qrDataUrl.value = null
}

onMounted(async () => {
  // Pre-load session dari URL query parameter jika ada
  let isTableOrder = false
  let trackingIdentifier = ''

  if (route.query.order && typeof route.query.order === 'string') {
    isTableOrder = true
    trackingIdentifier = route.query.order
  } else if (route.query.bill && typeof route.query.bill === 'string') {
    sessionStore.sessionToken = route.query.bill
    sessionStore.sessionType = 'open_bill'
    sessionStore.persist()
    trackingIdentifier = route.query.bill
  }

  // Tandai mode halaman untuk template (sembunyikan aksi khusus open bill saat table order).
  isTableOrderPage.value = isTableOrder

  // Restore session
  const isValid = customerSession.restoreLocal()

  if (!isValid && !isTableOrder) {
    // Redirect ke orders agar user bisa mulai sesi baru
    router.replace(`/o/${orgSlug.value}/orders`)
    return
  }

  // Load order aktif
  if (isTableOrder) {
    await fetchOrderStatus(orgSlug.value, trackingIdentifier)
  } else {
    await fetchOpenBill()
  }

  const bill = openBill.value

  if (!bill) {
    // Tidak ada order aktif sama sekali — kembali ke orders
    router.replace(`/o/${orgSlug.value}/orders`)
    return
  }

  if (bill.payment_status === 'paid') {
    // Order sudah terbayar
    isPaid.value = true

    // Bersihkan cart sesuai mode. Table order BUKAN session — tidak ada session
    // meja yang perlu dipertahankan atau dibuat ulang di sini.
    const cartMode = isTableOrder ? 'table_order' : 'open_bill'
    const cart = useOrderCart(ref(cartMode))
    cart.clearCart()

    if (!isTableOrder) {
      customerSession.clearSession()
    }
    return
  }

  // Cancelled/expired: untuk table order ditandai payment_status/order_status = 'cancelled'
  // (bill_status tetap 'none'). Untuk open bill ditandai bill_status 'closed'.
  if (
    bill.payment_status === 'cancelled' ||
    bill.payment_status === 'failed' ||
    bill.order_status === 'cancelled' ||
    bill.bill_status === 'closed' ||
    bill.bill_status === 'cancelled'
  ) {
    isExpired.value = true
    isFailed.value = true
    return
  }

  if (bill.payment_status === 'pending' || !qrDataUrl.value) {
    // Cari history untuk melihat apakah ada qris_data cache (untuk table order yang fetch public tidak mengembalikan qris_data)
    const history = useOrderHistory(orgSlug.value)
    const historyItem = history.items.value.find(i => 
      i.order_code === trackingIdentifier || i.order_public_id === trackingIdentifier
    )
    const cachedQris = historyItem?.qris_data

    const qrisData = bill.qris_data || cachedQris
    const expiresAt = bill.payment_expires_at

    if (qrisData && (qrisData.qr_url || qrisData.qr_string) && expiresAt) {
      const qrSource = qrisData.qr_url || qrisData.qr_string
      qrDataUrl.value = await generateQrDataUrl(qrSource!)
      setExternalPayment(
        qrSource!,
        qrisData.payment_reference || bill.payment_reference,
        expiresAt,
        bill.server_time
      )
      if (isTableOrder) {
        // Table order: poll endpoint PUBLIK /v1/customer/orders/{order}/payment-status.
        // Tidak memakai session, table token, maupun X-Public-Token.
        startPolling(async () => {
          const res = await fetchPublicPaymentStatus(trackingIdentifier)
          return res.data?.payment_status
        })
      } else {
        startPolling()
      }
    } else if (!isTableOrder) {
      // Inisiasi mandiri untuk Open Bill
      await handleInitiatePayment()
    } else {
      // Tidak ada data QR di Table Order (misalnya pesanan dibayar di kasir).
      // Alih-alih gagal, kita mulai polling untuk menunggu kasir mengubah status menjadi paid.
      startPolling(async () => {
        const res = await fetchPublicPaymentStatus(trackingIdentifier)
        return res.data?.payment_status
      })
    }
  }
})
</script>

<template>
  <div class="min-h-dvh bg-gray-50 flex flex-col">
    <!-- Session Error -->
    <div v-if="sessionError" class="min-h-[80dvh] flex items-center justify-center p-6 bg-gradient-to-br from-orange-50/20 via-white to-orange-50/20">
      <div class="bg-white/90 backdrop-blur-md border border-rose-100 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-xl shadow-stone-100/80 animate-in fade-in zoom-in-95 duration-200">
        <div class="size-16 rounded-2xl bg-rose-50 border border-rose-100/50 flex items-center justify-center text-rose-600 mx-auto shadow-inner">
          <UIcon name="i-lucide-lock" class="size-7" />
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-black text-stone-900 leading-none">Sesi Tidak Valid</h2>
          <p class="text-sm text-stone-500 leading-relaxed">{{ sessionError }}</p>
        </div>
        <NuxtLink :to="`/o/${orgSlug}/orders`" class="w-full h-12 rounded-2xl bg-orange-600 text-white font-extrabold hover:bg-orange-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center shadow-lg shadow-orange-600/25 cursor-pointer">
          ← Kembali ke Menu
        </NuxtLink>
      </div>
    </div>

    <template v-else>
      <!-- Header -->
      <header class="sticky top-0 z-20 flex-shrink-0 flex items-center justify-between gap-2 px-4 py-3 bg-white/85 backdrop-blur-md border-b border-stone-100/80">
        <button
          type="button"
          class="size-10 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-50 border border-stone-100 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
          @click="router.push(`/o/${orgSlug}/orders`)"
        >
          <UIcon name="i-lucide-arrow-left" class="size-5" />
        </button>
        <div class="flex flex-col items-center text-center">
          <h2 class="text-base font-black text-stone-900 leading-none">Detail Pembayaran</h2>
        </div>
        <span class="size-10 flex-shrink-0" aria-hidden="true" />
      </header>

      <!-- Main Layout -->
      <div class="w-full max-w-lg mx-auto px-4 py-6 space-y-6">

        <!-- ── Payment Sukses ── -->
        <div v-if="isPaid" class="bg-white rounded-3xl border border-stone-100 p-8 text-center space-y-6 shadow-xl shadow-stone-100/80 animate-in fade-in zoom-in-95 duration-200">
          <div class="relative size-20 mx-auto mb-2">
            <!-- Pulsing concentric circles for premium feeling -->
            <div class="absolute inset-0 rounded-3xl bg-emerald-100/50 animate-ping opacity-75" />
            <div class="relative size-20 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <UIcon name="i-lucide-check-circle-2" class="size-10 animate-bounce" />
            </div>
          </div>
          <div class="space-y-2">
            <h2 class="text-2xl font-black text-stone-900">Pembayaran Berhasil!</h2>
            <p class="text-sm text-stone-500 leading-relaxed">Terima kasih. Pesanan Anda sedang diproses oleh kasir & dapur kami.</p>
          </div>
          <div v-if="payment" class="bg-stone-50/50 border border-stone-100 rounded-2xl p-4 text-sm font-semibold space-y-2">
            <div class="flex items-center justify-between text-xs text-stone-400 font-bold uppercase tracking-wider">
              <span>Referensi Pembayaran</span>
              <span>Total</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-stone-700 font-mono font-bold tracking-tight">{{ payment.payment_reference }}</span>
              <strong class="text-emerald-600 text-base font-black">{{ formatCurrency(openBill?.total_amount ?? 0) }}</strong>
            </div>
          </div>
          <button @click="router.push(`/o/${orgSlug}/orders`)" class="w-full h-13 rounded-2xl bg-orange-600 text-white font-extrabold hover:bg-orange-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center shadow-lg shadow-orange-600/25 cursor-pointer">
            Pesan Lagi
          </button>
        </div>

        <!-- ── Payment Expired (timeout) ── -->
        <div v-else-if="isExpired" class="bg-white rounded-3xl border border-stone-100 p-8 text-center space-y-6 shadow-xl shadow-stone-100/80 animate-in fade-in zoom-in-95 duration-200">
          <div class="relative size-20 mx-auto mb-2">
            <div class="absolute inset-0 rounded-3xl bg-amber-100/50 animate-pulse" />
            <div class="relative size-20 rounded-3xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <UIcon name="i-lucide-timer" class="size-10" />
            </div>
          </div>
          <div class="space-y-2">
            <h2 class="text-xl font-black text-stone-900">Waktu Pembayaran Habis</h2>
            <p class="text-sm text-stone-500 leading-relaxed">Pesanan belum diproses karena pembayaran tidak diselesaikan tepat waktu. Silakan coba bayar kembali atau buat pesanan baru.</p>
          </div>
          <button @click="router.push(`/o/${orgSlug}/orders`)" class="w-full h-13 rounded-2xl bg-orange-600 text-white font-extrabold hover:bg-orange-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center shadow-lg shadow-orange-600/25 cursor-pointer">
            Kembali ke Menu
          </button>
        </div>

        <!-- ── Payment Dibatalkan ── -->
        <div v-else-if="isFailed" class="bg-white rounded-3xl border border-stone-100 p-8 text-center space-y-6 shadow-xl shadow-stone-100/80 animate-in fade-in zoom-in-95 duration-200">
          <div class="relative size-20 mx-auto mb-2">
            <div class="relative size-20 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm animate-shake">
              <UIcon name="i-lucide-x-circle" class="size-10" />
            </div>
          </div>
          <div class="space-y-2">
            <h2 class="text-xl font-black text-stone-900">Pembayaran Dibatalkan</h2>
            <p class="text-sm text-stone-500 leading-relaxed">Transaksi pembayaran QRIS dibatalkan. Silakan coba lagi jika ingin melanjutkan pembayaran.</p>
          </div>
          <button @click="handleInitiatePayment" class="w-full h-13 rounded-2xl bg-orange-600 text-white font-extrabold hover:bg-orange-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center shadow-lg shadow-orange-600/25 cursor-pointer">
            Coba Lagi
          </button>
        </div>

        <!-- ── Main Content ── -->
        <div v-else class="space-y-6">

          <!-- Open Bill Summary Card -->
          <div v-if="billPending" class="h-44 bg-stone-100 rounded-3xl animate-pulse" />

          <div v-else-if="openBill" class="bg-white rounded-3xl border border-stone-100 shadow-md shadow-stone-100/50 p-6 space-y-4 relative overflow-hidden">
            <!-- Decorative receipt cut-out top accent -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600" />
            
            <div class="flex items-center justify-between border-b border-stone-100 pb-3.5">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider">No. Tagihan</span>
                <span class="text-sm font-black text-stone-800 font-mono tracking-tight">{{ openBill.order_number }}</span>
              </div>
              <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs" :class="{
                'bg-emerald-50 text-emerald-700 border border-emerald-100/60': openBill.bill_status === 'open',
                'bg-rose-50 text-rose-700 border border-rose-100/60': openBill.bill_status === 'closed' || openBill.bill_status === 'cancelled'
              }">
                {{ openBill.bill_status === 'open' ? 'Aktif' : openBill.bill_status === 'closed' ? 'Selesai' : openBill.bill_status === 'cancelled' ? 'Dibatalkan' : '-' }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-xs font-bold text-stone-500 bg-stone-50 border border-stone-100/70 rounded-xl px-3 py-2 w-fit">
              <UIcon name="i-lucide-armchair" class="size-4 text-orange-500 shrink-0" />
              <span>Meja {{ openBill.dining_table?.name || openBill.dining_table?.code || '-' }}</span>
            </div>

            <div class="space-y-3 pt-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-stone-500">Subtotal</span>
                <span class="font-bold text-stone-700">{{ formatCurrency(openBill.subtotal_amount) }}</span>
              </div>
              <div v-if="openBill.discount_amount > 0" class="flex items-center justify-between text-sm text-emerald-600">
                <span>Diskon</span>
                <span class="font-bold">-{{ formatCurrency(openBill.discount_amount) }}</span>
              </div>
              <div v-if="openBill.service_charge_amount > 0" class="flex items-center justify-between text-sm">
                <span class="text-stone-500">Biaya Layanan</span>
                <span class="font-bold text-stone-700">{{ formatCurrency(openBill.service_charge_amount) }}</span>
              </div>
              <div v-if="openBill.tax_amount > 0" class="flex items-center justify-between text-sm">
                <span class="text-stone-500">Pajak</span>
                <span class="font-bold text-stone-700">{{ formatCurrency(openBill.tax_amount) }}</span>
              </div>
              <div class="border-t border-dashed border-stone-200 pt-4 flex items-center justify-between">
                <span class="text-sm font-extrabold text-stone-900">Total Bayar</span>
                <span class="text-xl font-black text-orange-600">{{ formatCurrency(openBill.total_amount) }}</span>
              </div>
            </div>
          </div>

          <!-- No Bill Card -->
          <div v-else class="bg-white rounded-3xl border border-stone-100 p-8 text-center space-y-5 shadow-xl shadow-stone-100/80 animate-in fade-in zoom-in-95 duration-200">
            <div class="size-16 rounded-2xl bg-stone-50 border border-stone-100/60 text-stone-400 flex items-center justify-center mx-auto shadow-inner">
              <UIcon name="i-lucide-receipt" class="size-8 text-stone-300" />
            </div>
            <div class="space-y-2">
              <h2 class="text-lg font-black text-stone-900 leading-none">Tidak Ada Tagihan Aktif</h2>
              <p class="text-sm text-stone-500 leading-relaxed">Silakan lakukan pesanan terlebih dahulu dari menu.</p>
            </div>
            <button @click="router.push(`/o/${orgSlug}/orders`)" class="w-full h-13 rounded-2xl bg-orange-600 text-white font-extrabold hover:bg-orange-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center shadow-lg shadow-orange-600/25 cursor-pointer">
              Lihat Menu
            </button>
          </div>

          <!-- QRIS Payment Box -->
          <div v-if="openBill && openBill.total_amount > 0" class="bg-white rounded-3xl border border-stone-100 shadow-md shadow-stone-100/50 p-6 space-y-6">

            <!-- QR Code Display -->
            <div v-if="qrDataUrl && !isPaid && !isFailed && !isExpired" class="text-center space-y-5">
              <div class="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <h3 class="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
                  <UIcon name="i-lucide-qr-code" class="size-4.5 text-orange-500" />
                  Pembayaran QRIS
                </h3>
                <div v-if="isPolling" class="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-lg">
                  <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Menunggu Pembayaran</span>
                </div>
              </div>

              <!-- QR Image Wrapper with scan-border and glow -->
              <div class="relative inline-block p-4 bg-white border border-stone-100 rounded-3xl shadow-sm mx-auto overflow-hidden">
                <!-- Glowing corner scan brackets -->
                <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500 rounded-tl-sm"></div>
                <div class="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-500 rounded-tr-sm"></div>
                <div class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500 rounded-bl-sm"></div>
                <div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500 rounded-br-sm"></div>
                
                <img :src="qrDataUrl" alt="QRIS QR Code" class="size-64 sm:size-72 object-contain block relative z-10" />
                
                <!-- Animated scanner line -->
                <div class="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent top-4 animate-scanner z-20 pointer-events-none" />
                <div v-if="isPolling" class="absolute inset-0 border border-emerald-500/20 rounded-3xl pointer-events-none" />
              </div>

              <!-- Countdown timer -->
              <div v-if="countdown > 0" class="flex items-center justify-center gap-1.5 text-sm font-black tracking-wide bg-stone-50 border border-stone-100 py-2.5 rounded-2xl w-fit mx-auto px-4" :class="countdown < 60 ? 'text-red-600 animate-pulse border-red-100 bg-red-50/20' : 'text-orange-600'">
                <UIcon name="i-lucide-timer" class="size-4.5 shrink-0" />
                <span>Batas Waktu: {{ formatCountdown(countdown) }}</span>
              </div>

              <p class="text-[12px] text-stone-400 font-semibold leading-relaxed max-w-xs mx-auto">
                Pindai QRIS di atas menggunakan aplikasi mobile banking atau e-wallet (GoPay, OVO, Dana, dll) untuk menyelesaikan pembayaran.
              </p>

              <!-- Opsi Kasir -->
              <div v-if="isTableOrderPage" class="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 text-center">
                <p class="text-xs font-semibold text-orange-800 leading-relaxed flex items-center justify-center gap-1.5">
                  <UIcon name="i-lucide-store" class="size-4 shrink-0 text-orange-600" />
                  <span>Atau silakan lakukan pembayaran tunai/kartu langsung di kasir restoran.</span>
                </p>
              </div>

              <!-- Batalkan Pembayaran Button -->
              <button
                v-if="!isTableOrderPage"
                class="w-full h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 font-extrabold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="cancelPending"
                @click="handleCancelPayment"
              >
                <UIcon v-if="cancelPending" name="i-lucide-loader-2" class="size-4 animate-spin shrink-0" />
                <UIcon v-else name="i-lucide-x-circle" class="size-4 shrink-0" />
                <span>{{ cancelPending ? 'Membatalkan...' : 'Batalkan Pembayaran' }}</span>
              </button>
            </div>

            <!-- Initiate Payment Button — khusus open bill -->
            <div v-else-if="!isTableOrderPage && !qrDataUrl && !isPaid && !isFailed && !isExpired" class="text-center space-y-6 py-4">
              <!-- QRIS Logo Styled -->
              <div class="relative size-20 mx-auto">
                <div class="absolute inset-0 bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 rounded-3xl blur-md opacity-45 animate-pulse" />
                <div class="relative size-20 rounded-3xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                  QRIS
                </div>
              </div>

              <div class="space-y-2">
                <h3 class="text-lg font-black text-stone-900">Pembayaran Online QRIS</h3>
                <p class="text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
                  Bayar pesanan Anda secara instan menggunakan QRIS. Mendukung semua aplikasi e-wallet dan mobile banking.
                </p>
              </div>

              <p v-if="initError" class="text-xs text-red-600 font-bold px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl max-w-xs mx-auto animate-shake">{{ initError }}</p>

              <button
                class="w-full h-13 rounded-2xl bg-orange-600 text-white font-extrabold hover:bg-orange-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="initiatePending || !openBill"
                @click="handleInitiatePayment"
              >
                <UIcon v-if="initiatePending" name="i-lucide-loader-2" class="size-5 animate-spin" />
                <UIcon v-else name="i-lucide-credit-card" class="size-5" />
                <span>{{ initiatePending ? 'Membuat QRIS...' : `Bayar ${formatCurrency(openBill?.total_amount ?? 0)}` }}</span>
              </button>
            </div>

            <!-- Pesan bayar di kasir — khusus table order yang tidak punya data QR -->
            <div v-else-if="isTableOrderPage && !qrDataUrl && !isPaid && !isFailed && !isExpired" class="text-center space-y-6 py-4">
              <div class="relative size-20 mx-auto">
                <div class="absolute inset-0 bg-stone-200 rounded-3xl blur-md opacity-45" />
                <div class="relative size-20 rounded-3xl bg-stone-50 border border-stone-200 text-stone-600 flex items-center justify-center font-black text-3xl shadow-sm">
                  🏪
                </div>
              </div>
              <div class="space-y-2">
                <h3 class="text-lg font-black text-stone-900">Pembayaran di Kasir</h3>
                <p class="text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
                  Pesanan Anda telah tercatat di kasir. Silakan lakukan pembayaran langsung di kasir restoran atau tunggu staf kami melayani Anda di meja.
                </p>
              </div>

              <!-- Countdown timer -->
              <div v-if="countdown > 0" class="flex items-center justify-center gap-1.5 text-sm font-black text-orange-600 bg-orange-50 border border-orange-100/50 py-2.5 rounded-2xl w-fit mx-auto px-4">
                <UIcon name="i-lucide-timer" class="size-4.5 shrink-0" />
                <span>Batas Waktu: {{ formatCountdown(countdown) }}</span>
              </div>

              <div class="flex items-center justify-center gap-2 text-xs text-emerald-600 font-bold pt-2">
                <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Menunggu konfirmasi kasir...</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@keyframes scanner {
  0%, 100% {
    top: 16px;
  }
  50% {
    top: calc(100% - 18px);
  }
}

.animate-scanner {
  animation: scanner 2.5s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
