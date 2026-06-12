<script setup lang="ts">
definePageMeta({
  layout: 'org',
  middleware: ['org-exists']
})

const route = useRoute()
const router = useRouter()
const orgSlug = computed(() => String(route.params.orgSlug || ''))

// SEO: halaman payment selalu noindex — berisi session pembayaran customer.
// Tidak perlu fetch data org hanya untuk SEO; title statis sudah cukup.
useSeoMeta({
  title: 'Pembayaran | Santap',
  description: 'Selesaikan pembayaran pesanan Anda di Santap.',
  ogTitle: 'Pembayaran | Santap',
  ogDescription: 'Selesaikan pembayaran pesanan Anda di Santap.',
  ogSiteName: 'Santap',
  ogLocale: 'id_ID',
  twitterCard: 'summary_large_image',
})
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

// Composables
const customerSession = useCustomerSession()
const sessionStore = useCustomerSessionStore()
const { openBill, billPending, statusPending, fetchOpenBill, fetchOrderStatus, fetchPublicPaymentStatus } = useCustomerOrder()
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

const toast = useToast()

// State
const sessionError = ref<string | null>(null)
const initError = ref<string | null>(null)
const qrDataUrl = ref<string | null>(null)
const isPageLoading = ref(true)
const isDownloading = ref(false)
const showCancelModal = ref(false)
// true jika halaman ini melacak TABLE ORDER (query ?order=), false untuk open bill (?bill=)
const isTableOrderPage = ref(false)

const cartModeState = computed(() => customerSession.sessionMode.value === 'open_bill' ? 'open_bill' : 'table_order')
const cartInstance = useOrderCart(cartModeState)
const customerName = computed(() => cartInstance.customerName.value)
const overlay = useUiOverlayStore()

// Saat pembayaran sukses: catat reference ke history & bersihkan cart.
// Table order BUKAN session — JANGAN buat ulang session meja apa pun.
watch(isPaid, (newVal) => {
  if (newVal) {
    overlay.closeAll()
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

// Download QRIS sebagai PNG dengan background putih
const handleDownloadQris = async () => {
  if (!qrDataUrl.value || isDownloading.value) return
  isDownloading.value = true

  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Gagal memuat gambar QR.'))
      img.src = qrDataUrl.value!
    })

    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // White background agar QR tetap terbaca
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    ctx.drawImage(img, 0, 0, size, size)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    )

    if (!blob) throw new Error('Gagal mengekspor gambar.')

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qris-${openBill.value?.order_number ?? 'santap'}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.add({
      title: 'QRIS berhasil diunduh',
      description: `File qris-${openBill.value?.order_number ?? 'santap'}.png telah tersimpan.`,
      color: 'success',
      icon: 'i-lucide-download'
    })
  } catch (err) {
    console.error('[handleDownloadQris]', err)
    toast.add({
      title: 'Gagal mengunduh QRIS',
      description: 'Silakan coba lagi atau screenshot QR Code secara manual.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isDownloading.value = false
  }
}

// Tampilkan modal konfirmasi sebelum batalkan
const handleCancelPayment = () => {
  showCancelModal.value = true
}

// Konfirmasi pembatalan dari modal
const confirmCancel = async () => {
  showCancelModal.value = false
  const result = await cancelPayment()
  qrDataUrl.value = null

  if (result.success) {
    toast.add({
      title: 'Pembayaran dibatalkan',
      description: 'QRIS telah dibatalkan. Anda dapat membuat pembayaran baru.',
      color: 'neutral',
      icon: 'i-lucide-circle-x'
    })
  } else {
    toast.add({
      title: 'Gagal membatalkan',
      description: 'Silakan coba lagi.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

onMounted(async () => {
  isPageLoading.value = true
  try {
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
      isPageLoading.value = false
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
      isPageLoading.value = false
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
    isPageLoading.value = false
  } catch (err) {
    console.error(err)
    isPageLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-dvh bg-gray-50 flex flex-col">

    <!-- Cancel Confirmation Modal -->
    <UModal v-model:open="showCancelModal" :ui="{ footer: 'justify-end' }">
      <template #title>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-alert-triangle" class="size-5 text-red-500 shrink-0" />
          <span>Batalkan pembayaran?</span>
        </div>
      </template>
      <template #body>
        <p class="text-sm text-stone-600 leading-relaxed">
          QRIS ini tidak dapat digunakan kembali setelah pembayaran dibatalkan. Anda dapat membuat pembayaran baru jika masih ingin melanjutkan transaksi.
        </p>
      </template>
      <template #footer>
        <UButton
          label="Kembali"
          color="neutral"
          variant="outline"
          @click="showCancelModal = false"
        />
        <UButton
          label="Ya, Batalkan"
          color="error"
          icon="i-lucide-circle-x"
          :loading="cancelPending"
          @click="confirmCancel"
        />
      </template>
    </UModal>

    <!-- Loading skeleton state -->
    <div v-if="isPageLoading" class="flex-1 flex flex-col p-4 sm:p-6 w-full max-w-lg lg:max-w-5xl mx-auto space-y-4">
      <div class="w-full h-12 bg-stone-200/60 rounded-2xl animate-pulse" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full items-start">
        <div class="h-[300px] bg-stone-200/60 rounded-2xl animate-pulse" />
        <div class="h-[440px] bg-stone-200/60 rounded-2xl animate-pulse" />
      </div>
    </div>

    <!-- Real Content -->
    <template v-else>
      <!-- Session Error -->
      <div v-if="sessionError" class="min-h-[80dvh] flex items-center justify-center p-6">
        <div class="bg-white border border-rose-100 rounded-2xl p-8 max-w-sm w-full text-center space-y-5 shadow-sm">
          <div class="size-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
            <UIcon name="i-lucide-lock" class="size-6" />
          </div>
          <div class="space-y-1.5">
            <h2 class="text-base font-bold text-stone-900">Sesi Tidak Valid</h2>
            <p class="text-sm text-stone-500 leading-relaxed">{{ sessionError }}</p>
          </div>
          <UButton
            :to="`/o/${orgSlug}/orders`"
            label="Kembali ke Menu"
            color="primary"
            icon="i-lucide-arrow-left"
            block
          />
        </div>
      </div>

      <template v-else>
        <!-- Header -->
        <header class="sticky top-0 z-20 flex-shrink-0 flex items-center justify-between gap-2 px-4 py-3 bg-white/90 backdrop-blur-md border-b border-stone-100">
          <button
            type="button"
            class="size-9 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Kembali ke pesanan"
            @click="router.push(`/o/${orgSlug}/orders`)"
          >
            <UIcon name="i-lucide-arrow-left" class="size-5" />
          </button>
          <div class="flex flex-col items-center text-center">
            <h1 class="text-sm font-bold text-stone-900 leading-none">Detail Pembayaran</h1>
            <span v-if="openBill" class="text-[11px] text-stone-400 font-medium mt-0.5">{{ openBill.order_number }}</span>
          </div>
          <span class="size-9 flex-shrink-0" aria-hidden="true" />
        </header>

        <!-- Main Layout -->
        <div class="w-full max-w-lg lg:max-w-4xl mx-auto px-4 py-5">

          <!-- ── Payment Sukses ── -->
          <div v-if="isPaid" class="max-w-sm mx-auto bg-white rounded-2xl border border-stone-200/60 p-7 text-center space-y-5 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div class="relative size-16 mx-auto">
              <div class="absolute inset-0 rounded-2xl bg-emerald-100/60 animate-ping opacity-70" />
              <div class="relative size-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <UIcon name="i-lucide-check-circle-2" class="size-9" />
              </div>
            </div>
            <div class="space-y-1.5">
              <h2 class="text-lg font-bold text-stone-900">Pembayaran Berhasil!</h2>
              <p class="text-sm text-stone-500 leading-relaxed">Terima kasih. Pesanan Anda sedang diproses oleh kasir & dapur kami.</p>
            </div>
            <div v-if="payment" class="bg-stone-50 border border-stone-100 rounded-xl p-3.5 text-left space-y-1.5">
              <div class="flex items-center justify-between text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                <span>Referensi Pembayaran</span>
                <span>Total</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-stone-700 font-mono text-xs font-bold">{{ payment.payment_reference }}</span>
                <strong class="text-emerald-600 text-sm font-black">{{ formatCurrency(openBill?.total_amount ?? 0) }}</strong>
              </div>
            </div>
            <UButton
              label="Pesan Lagi"
              color="primary"
              icon="i-lucide-utensils"
              block
              @click="router.push(`/o/${orgSlug}/orders`)"
            />
          </div>

          <!-- ── Payment Expired ── -->
          <div v-else-if="isExpired" class="max-w-sm mx-auto bg-white rounded-2xl border border-stone-200/60 p-7 text-center space-y-5 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div class="size-14 mx-auto rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <UIcon name="i-lucide-timer" class="size-8" />
            </div>
            <div class="space-y-1.5">
              <h2 class="text-base font-bold text-stone-900">Waktu Pembayaran Habis</h2>
              <p class="text-sm text-stone-500 leading-relaxed">Pesanan belum diproses karena pembayaran tidak diselesaikan tepat waktu. Silakan coba bayar kembali atau buat pesanan baru.</p>
            </div>
            <UButton
              label="Kembali ke Menu"
              color="primary"
              icon="i-lucide-arrow-left"
              block
              @click="router.push(`/o/${orgSlug}/orders`)"
            />
          </div>

          <!-- ── Payment Dibatalkan ── -->
          <div v-else-if="isFailed" class="max-w-sm mx-auto bg-white rounded-2xl border border-stone-200/60 p-7 text-center space-y-5 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div class="size-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center">
              <UIcon name="i-lucide-x-circle" class="size-8" />
            </div>
            <div class="space-y-1.5">
              <h2 class="text-base font-bold text-stone-900">Pembayaran Dibatalkan</h2>
              <p class="text-sm text-stone-500 leading-relaxed">Transaksi QRIS dibatalkan. Silakan coba lagi jika ingin melanjutkan pembayaran.</p>
            </div>
            <UButton
              label="Coba Lagi"
              color="primary"
              icon="i-lucide-refresh-cw"
              block
              :loading="initiatePending"
              @click="handleInitiatePayment"
            />
          </div>

          <!-- ── Main Content / Active Bill Layout ── -->
          <div v-else-if="openBill" class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

            <!-- ── Kolom Kiri: Detail Tagihan ── -->
            <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
              <!-- Card Header -->
              <div class="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-receipt" class="size-4 text-orange-500 shrink-0" />
                  <h2 class="text-sm font-bold text-stone-900">Detail Tagihan</h2>
                </div>
                <UBadge
                  :label="openBill.payment_status === 'paid' ? 'Lunas' : openBill.payment_status === 'pending' ? 'Pending' : 'Belum Lunas'"
                  :color="openBill.payment_status === 'paid' ? 'success' : openBill.payment_status === 'pending' ? 'warning' : 'neutral'"
                  variant="soft"
                  size="xs"
                  class="font-semibold"
                />
              </div>

              <!-- Info Rows -->
              <div class="px-5 py-4 space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-400 font-medium shrink-0">No. Tagihan</span>
                  <span class="text-sm font-mono font-bold text-stone-900 text-right truncate">{{ openBill.order_number }}</span>
                </div>
                <div v-if="openBill.order_id" class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-400 font-medium shrink-0">ID Order</span>
                  <span class="text-xs font-mono font-semibold text-stone-700 text-right">{{ openBill.order_id }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-400 font-medium shrink-0">Meja / Area</span>
                  <span class="text-sm font-semibold text-stone-800 text-right">{{ openBill.dining_table?.name || openBill.dining_table?.code || '-' }}</span>
                </div>
                <div v-if="customerName" class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-400 font-medium shrink-0">Pelanggan</span>
                  <span class="text-sm font-semibold text-stone-800 text-right capitalize">{{ customerName }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-400 font-medium shrink-0">Metode</span>
                  <span class="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                    <UIcon name="i-lucide-qr-code" class="size-3.5 text-orange-500 shrink-0" />
                    QRIS
                  </span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-400 font-medium shrink-0">Mitra Gateway</span>
                  <span class="text-xs font-semibold text-stone-700 text-right">Sekeco Payment</span>
                </div>
              </div>

              <!-- Financial Breakdown -->
              <div class="border-t border-dashed border-stone-200 px-5 py-4 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-stone-400 font-medium">Subtotal</span>
                  <span class="text-sm font-semibold text-stone-700">{{ formatCurrency(openBill.subtotal_amount) }}</span>
                </div>
                <div v-if="openBill.discount_amount > 0" class="flex items-center justify-between">
                  <span class="text-xs text-emerald-600 font-medium">Diskon</span>
                  <span class="text-sm font-semibold text-emerald-600">-{{ formatCurrency(openBill.discount_amount) }}</span>
                </div>
                <div v-if="openBill.service_charge_amount > 0" class="flex items-center justify-between">
                  <span class="text-xs text-stone-400 font-medium">Biaya Layanan</span>
                  <span class="text-sm font-semibold text-stone-700">{{ formatCurrency(openBill.service_charge_amount) }}</span>
                </div>
                <div v-if="openBill.tax_amount > 0" class="flex items-center justify-between">
                  <span class="text-xs text-stone-400 font-medium">Pajak</span>
                  <span class="text-sm font-semibold text-stone-700">{{ formatCurrency(openBill.tax_amount) }}</span>
                </div>
                <!-- Total -->
                <div class="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span class="text-sm font-bold text-stone-900">Total Bayar</span>
                  <span class="text-base font-black text-orange-600 tracking-tight">{{ formatCurrency(openBill.total_amount) }}</span>
                </div>
              </div>
            </div>

            <!-- ── Kolom Kanan: Pembayaran QRIS ── -->
            <div v-if="openBill.total_amount > 0" class="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">

              <!-- Card Header -->
              <div class="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-qr-code" class="size-4 text-orange-500 shrink-0" />
                  <h2 class="text-sm font-bold text-stone-900">Pembayaran QRIS</h2>
                </div>
                <!-- Polling status indicator -->
                <div v-if="isPolling" class="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Menunggu</span>
                </div>
              </div>

              <!-- QR Code Section: active state -->
              <div v-if="qrDataUrl && !isPaid && !isFailed && !isExpired" class="px-5 py-5 flex flex-col items-center gap-4">

                <!-- QR Code container -->
                <div class="bg-white border border-stone-200 rounded-2xl p-3 inline-flex items-center justify-center shadow-xs">
                  <img
                    :src="qrDataUrl"
                    alt="QR Code QRIS — pindai menggunakan aplikasi e-wallet atau mobile banking Anda"
                    class="size-48 sm:size-52 object-contain block"
                    loading="eager"
                  />
                </div>

                <!-- Countdown Banner -->
                <div
                  v-if="countdown > 0"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors duration-200"
                  :class="countdown < 60
                    ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse'
                    : 'bg-stone-50 border-stone-200 text-stone-600'"
                >
                  <UIcon
                    name="i-lucide-clock"
                    class="size-4 shrink-0"
                    :class="countdown < 60 ? 'text-rose-500' : 'text-stone-400'"
                  />
                  <span>
                    Sisa waktu pembayaran:
                    <span class="font-mono font-bold tabular-nums">{{ formatCountdown(countdown) }}</span>
                  </span>
                </div>

                <!-- Instruction text -->
                <p class="text-xs text-stone-400 font-medium leading-relaxed text-center max-w-[260px]">
                  Pindai QRIS menggunakan aplikasi mobile banking atau e-wallet yang mendukung QRIS.
                </p>

                <!-- Opsi Kasir (table order only) -->
                <div v-if="isTableOrderPage" class="w-full bg-orange-50/60 border border-orange-100/70 rounded-xl px-4 py-3 flex items-start gap-2">
                  <UIcon name="i-lucide-store" class="size-4 text-orange-500 shrink-0 mt-0.5" />
                  <p class="text-xs font-medium text-orange-800 leading-relaxed">
                    Atau silakan lakukan pembayaran tunai/kartu langsung di kasir restoran.
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="w-full flex flex-col gap-2.5 pt-1">
                  <!-- Download QRIS -->
                  <UButton
                    label="Download QRIS"
                    color="primary"
                    icon="i-lucide-download"
                    block
                    :loading="isDownloading"
                    :disabled="isDownloading"
                    @click="handleDownloadQris"
                  />

                  <!-- Cancel Payment (open bill only) -->
                  <UButton
                    v-if="!isTableOrderPage"
                    label="Batalkan Pembayaran"
                    color="error"
                    icon="i-lucide-circle-x"
                    block
                    :loading="cancelPending"
                    :disabled="cancelPending"
                    @click="handleCancelPayment"
                  />
                </div>
              </div>

              <!-- Initiate Payment State — open bill, no QR yet -->
              <div v-else-if="!isTableOrderPage && !qrDataUrl && !isPaid && !isFailed && !isExpired" class="px-5 py-8 text-center">
                <div class="relative size-16 mx-auto mb-5">
                  <div class="absolute inset-0 bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 rounded-2xl blur-md opacity-40 animate-pulse" />
                  <div class="relative size-16 rounded-2xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                    QRIS
                  </div>
                </div>
                <div class="space-y-1.5 mb-5">
                  <h3 class="text-sm font-bold text-stone-900">Pembayaran Online QRIS</h3>
                  <p class="text-xs text-stone-500 leading-relaxed max-w-[240px] mx-auto">
                    Bayar pesanan Anda secara instan menggunakan QRIS. Mendukung semua aplikasi e-wallet dan mobile banking.
                  </p>
                </div>
                <p v-if="initError" class="text-xs text-red-600 font-semibold px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl max-w-xs mx-auto mb-5">{{ initError }}</p>
                <UButton
                  :label="initiatePending ? 'Membuat QRIS...' : `Bayar ${formatCurrency(openBill?.total_amount ?? 0)}`"
                  color="primary"
                  icon="i-lucide-credit-card"
                  block
                  :loading="initiatePending"
                  :disabled="initiatePending || !openBill"
                  @click="handleInitiatePayment"
                />
              </div>

              <!-- Pembayaran di Kasir State — table order, no QR -->
              <div v-else-if="isTableOrderPage && !qrDataUrl && !isPaid && !isFailed && !isExpired" class="px-5 py-8 text-center">
                <div class="size-14 mx-auto mb-5 rounded-2xl bg-stone-50 border border-stone-200 text-3xl flex items-center justify-center">
                  🏪
                </div>
                <div class="space-y-1.5 mb-5">
                  <h3 class="text-sm font-bold text-stone-900">Pembayaran di Kasir</h3>
                  <p class="text-xs text-stone-500 leading-relaxed max-w-[240px] mx-auto">
                    Pesanan Anda telah tercatat di kasir. Silakan lakukan pembayaran langsung di kasir restoran atau tunggu staf kami melayani Anda di meja.
                  </p>
                </div>
                <div v-if="countdown > 0" class="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 py-2 px-4 rounded-xl mb-4">
                  <UIcon name="i-lucide-timer" class="size-4 shrink-0" />
                  <span>Batas Waktu: {{ formatCountdown(countdown) }}</span>
                </div>
                <div class="flex items-center justify-center gap-2 text-xs text-emerald-600 font-semibold">
                  <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Menunggu konfirmasi kasir...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Instructions — shown below the grid when QR is active -->
          <div v-if="openBill && qrDataUrl && !isPaid && !isFailed && !isExpired" class="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Steps -->
            <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm px-5 py-4">
              <h3 class="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-3.5">
                <UIcon name="i-lucide-info" class="size-4 text-orange-500" />
                Petunjuk Pembayaran
              </h3>
              <ol class="space-y-3">
                <li class="flex items-start gap-2.5">
                  <span class="size-5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 text-[10px]">1</span>
                  <span class="text-xs text-stone-500 leading-relaxed pt-0.5">Buka aplikasi mobile banking atau e-wallet (GoPay, OVO, Dana, LinkAja, ShopeePay, dll).</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="size-5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 text-[10px]">2</span>
                  <span class="text-xs text-stone-500 leading-relaxed pt-0.5">Pilih opsi <strong class="text-stone-700">Scan / Bayar QRIS</strong> dan arahkan kamera ke QR Code di atas.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="size-5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 text-[10px]">3</span>
                  <span class="text-xs text-stone-500 leading-relaxed pt-0.5">Pastikan nominal tagihan sudah sesuai, lalu masukkan PIN pembayaran untuk menyelesaikan transaksi.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="size-5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 text-[10px]">4</span>
                  <span class="text-xs text-stone-500 leading-relaxed pt-0.5">Setelah pembayaran sukses, sistem akan memperbarui status pesanan secara otomatis dalam beberapa detik.</span>
                </li>
              </ol>
            </div>

            <!-- Gateway Info -->
            <div class="bg-orange-50/30 rounded-2xl border border-orange-100/60 px-5 py-4">
              <div class="flex items-center gap-1.5 mb-3">
                <UIcon name="i-lucide-shield-check" class="size-4 text-orange-500 shrink-0" />
                <span class="text-xs font-bold text-orange-800">Informasi Gerbang Pembayaran</span>
              </div>
              <p class="text-xs text-stone-500 leading-relaxed mb-3">
                Layanan pembayaran QRIS ini diproses secara aman oleh mitra resmi kami, <span class="text-stone-800 font-semibold">Sekeco Payment</span>.
              </p>
              <div class="bg-white/70 border border-orange-100 rounded-xl px-3.5 py-3 mb-3">
                <span class="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-1">Catatan Penerima QRIS:</span>
                <p class="text-xs text-stone-500 leading-relaxed italic">
                  Pada aplikasi e-wallet Anda, detail penerima akan tertera atas nama <span class="text-stone-800 font-semibold not-italic">PT Sarwa Kalyana Cara</span> selaku penyelenggara gerbang pembayaran resmi.
                </p>
              </div>
              <p class="text-[11px] text-stone-400 leading-relaxed">
                * Jika QRIS tidak dapat dipindai, Anda dapat melakukan pembayaran langsung melalui kasir restoran.
              </p>
            </div>
          </div>

          <!-- No Bill Card -->
          <div v-else-if="!openBill && !isPaid && !isExpired && !isFailed" class="max-w-sm mx-auto bg-white rounded-2xl border border-stone-200/60 p-7 text-center space-y-5 shadow-sm animate-in fade-in zoom-in-95 duration-200 w-full mt-4">
            <div class="size-12 rounded-2xl bg-stone-50 border border-stone-100 text-stone-300 flex items-center justify-center mx-auto">
              <UIcon name="i-lucide-receipt" class="size-7" />
            </div>
            <div class="space-y-1.5">
              <h2 class="text-base font-bold text-stone-900">Tidak Ada Tagihan Aktif</h2>
              <p class="text-sm text-stone-500 leading-relaxed">Silakan lakukan pesanan terlebih dahulu dari menu.</p>
            </div>
            <UButton
              label="Lihat Menu"
              color="primary"
              icon="i-lucide-utensils"
              block
              @click="router.push(`/o/${orgSlug}/orders`)"
            />
          </div>

        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
