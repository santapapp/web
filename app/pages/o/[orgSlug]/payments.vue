<script setup lang="ts">
definePageMeta({
  layout: 'blank',
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
const isSharing = ref(false)
const canUseWebShare = computed(() => {
  if (!import.meta.client) return false
  const nav = navigator as any
  return !!(nav.share && nav.canShare)
})
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
    // Gunakan proxy backend untuk menghindari masalah CORS di Canvas client
    const config = useRuntimeConfig()
    const baseUrl = String(config.public.apiBaseUrl || 'https://api.santap.app').replace(/\/$/, '')
    return `${baseUrl}/v1/customer/qr-proxy?url=${encodeURIComponent(qrString)}`
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

// Helper to safely draw rounded rects on canvas across all devices
const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | number[]
) => {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius)
  } else {
    const r = typeof radius === 'number' ? radius : (radius[0] || 0)
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + width - r, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + r)
    ctx.lineTo(x + width, y + height - r)
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
    ctx.lineTo(x + r, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
  }
}

// Generate a premium branded Santap payment card image
const generateSantapPaymentCardBlob = async (qrDataUrl: string): Promise<Blob> => {
  const qrImg = new Image()
  qrImg.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    qrImg.onload = () => resolve()
    qrImg.onerror = () => reject(new Error('Gagal memuat gambar QR.'))
    qrImg.src = qrDataUrl
  })

  const width = 480
  const height = 720
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // 1. Draw soft cream background
  ctx.fillStyle = '#FAFAF9' // stone-50
  ctx.fillRect(0, 0, width, height)

  // 2. Draw Top Header Panel (Orange brand background with rounded top corners)
  ctx.fillStyle = '#E87722' // Santap orange
  ctx.beginPath()
  drawRoundRect(ctx, 0, 0, width, 130, [16, 16, 0, 0])
  ctx.fill()

  // 3. Draw brand header text
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 32px system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('SANTAP', width / 2, 50)

  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.fillText('QRIS - E-PAYMENT CARD', width / 2, 90)

  // 4. White Main Card content section
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  drawRoundRect(ctx, 20, 150, width - 40, 520, 16)
  ctx.fill()

  // Draw border for main card
  ctx.lineWidth = 1.5
  ctx.strokeStyle = '#E7E5E4' // stone-200
  ctx.stroke()

  // 5. Merchant Details
  ctx.fillStyle = '#1C1917' // stone-900
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
  const orgName = customerSession.organization.value?.name || 'Restoran Santap'
  ctx.fillText(orgName, width / 2, 195)

  ctx.fillStyle = '#78716C' // stone-500
  ctx.font = '600 13px system-ui, -apple-system, sans-serif'
  const tableName = openBill.value?.dining_table?.name || openBill.value?.dining_table?.code || 'Meja'
  const orderNum = openBill.value?.order_number ?? '-'
  ctx.fillText(`${tableName}   •   #${orderNum}`, width / 2, 225)

  // 6. Draw QRIS Frame
  ctx.strokeStyle = '#E87722'
  ctx.lineWidth = 2
  ctx.beginPath()
  drawRoundRect(ctx, width / 2 - 110, 250, 220, 220, 12)
  ctx.stroke()

  // Draw QR Image
  ctx.drawImage(qrImg, width / 2 - 100, 260, 200, 200)

  // Draw QRIS text banner below QR
  ctx.fillStyle = '#E87722'
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif'
  ctx.fillText('PINDAI MENGGUNAKAN QRIS', width / 2, 495)

  // 7. Divider dashed line
  ctx.strokeStyle = '#E7E5E4'
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 6])
  ctx.beginPath()
  ctx.moveTo(40, 525)
  ctx.lineTo(width - 40, 525)
  ctx.stroke()
  ctx.setLineDash([]) // reset line dash

  // 8. Total tagihan
  ctx.fillStyle = '#78716C' // stone-500
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
  ctx.fillText('TOTAL TAGIHAN', width / 2, 550)

  ctx.fillStyle = '#E87722' // orange-600
  ctx.font = '900 28px system-ui, -apple-system, sans-serif'
  const totalStr = formatCurrency(openBill.value?.total_amount ?? 0)
  ctx.fillText(totalStr, width / 2, 585)

  // 9. Payment Methods instructions
  ctx.fillStyle = '#78716C' // stone-500
  ctx.font = '500 11px system-ui, -apple-system, sans-serif'
  ctx.fillText('Mendukung: DANA, GoPay, OVO, LinkAja, ShopeePay,', width / 2, 625)
  ctx.fillText('BRIMo, BCA Mobile, Livin\' Mandiri, dan e-wallet/m-banking lainnya.', width / 2, 640)

  // 10. Outer Footer
  ctx.fillStyle = '#A8A29E' // stone-400
  ctx.font = 'bold 10px system-ui, -apple-system, sans-serif'
  ctx.fillText('Terima kasih atas pesanan Anda   •   powered by santap.id', width / 2, 685)

  // Export to Blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Gagal merender gambar.'))
      }
    }, 'image/png')
  })
}

// Download QRIS sebagai PNG dengan template kartu Santap premium
const handleDownloadQris = async () => {
  if (!qrDataUrl.value || isDownloading.value) return
  isDownloading.value = true

  try {
    const blob = await generateSantapPaymentCardBlob(qrDataUrl.value)

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qris-payment-${openBill.value?.order_number ?? 'santap'}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.add({
      title: 'QRIS berhasil diunduh',
      description: `Kartu pembayaran qris-payment-${openBill.value?.order_number ?? 'santap'}.png telah tersimpan.`,
      color: 'success',
      icon: 'i-lucide-download'
    })
  } catch (err: any) {
    console.error('[handleDownloadQris]', err)
    toast.add({
      title: 'Gagal mengunduh QRIS',
      description: err.message || 'Silakan coba lagi atau screenshot QR Code secara manual.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isDownloading.value = false
  }
}

// Bagikan QRIS ke e-wallet, mobile banking, WhatsApp, atau simpan ke galeri menggunakan Web Share API
const handleShareQris = async () => {
  if (!qrDataUrl.value || isSharing.value) return
  isSharing.value = true

  try {
    const blob = await generateSantapPaymentCardBlob(qrDataUrl.value)
    const file = new File(
      [blob],
      `pembayaran-qris-${openBill.value?.order_number ?? 'santap'}.png`,
      { type: 'image/png' }
    )

    if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `Pembayaran QRIS - ${customerSession.organization.value?.name ?? 'Santap'}`,
        text: `Silakan scan QRIS untuk membayar pesanan sebesar ${formatCurrency(openBill.value?.total_amount ?? 0)}.`
      })

      toast.add({
        title: 'Menu Berbagi Dinonaktifkan/Dibuka',
        description: 'Silakan pilih aplikasi pembayaran (DANA, BRIMo, GoPay, dll.) atau simpan ke galeri.',
        color: 'success',
        icon: 'i-lucide-share-2'
      })
    } else {
      throw new Error('Fitur berbagi file tidak didukung oleh browser Anda.')
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // User cancelled the share dialog
      return
    }
    console.error('[handleShareQris]', err)
    toast.add({
      title: 'Gagal Berbagi QRIS',
      description: err.message || 'Silakan download gambar QR secara manual.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isSharing.value = false
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
      sessionStore.persist(orgSlug.value)
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
  <div class="min-h-dvh bg-gray-50 flex flex-col customer-ordering-layout">

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
          @click="() => { showCancelModal = false }"
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
        <header class="sticky top-0 z-20 flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-stone-100">
          <div class="w-full max-w-5xl mx-auto flex items-center justify-between gap-2 px-4 py-3">
            <button
              type="button"
              class="size-9 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 active:scale-95 transition-all duration-150 cursor-pointer"
              aria-label="Kembali ke pesanan"
              @click="router.push(`/o/${orgSlug}/orders`)"
            >
              <UIcon name="i-lucide-arrow-left" class="size-5" />
            </button>
            <div class="flex flex-col items-center text-center">
              <div class="text-sm font-bold text-stone-900 leading-none">Detail Pembayaran</div>
              <span v-if="openBill" class="text-[11px] text-stone-400 font-medium mt-0.5">{{ openBill.order_number }}</span>
            </div>
            <span class="size-9 flex-shrink-0" aria-hidden="true" />
          </div>
        </header>

        <!-- Main Layout -->
        <div class="w-full max-w-lg lg:max-w-5xl mx-auto px-4 py-5">

          <!-- ── Payment Sukses ── -->
          <div v-if="isPaid" class="max-w-sm mx-auto bg-white rounded-xl border border-stone-200/60 p-5 text-center space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div class="relative size-12 mx-auto">
              <div class="absolute inset-0 rounded-xl bg-emerald-100/60 animate-ping opacity-70" />
              <div class="relative size-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <UIcon name="i-lucide-check-circle-2" class="size-6" />
              </div>
            </div>
            <div class="space-y-1">
              <div class="text-base font-bold text-stone-900">Pembayaran Berhasil!</div>
              <p class="text-xs text-stone-500 leading-relaxed">Terima kasih. Pesanan Anda sedang diproses oleh kasir & dapur kami.</p>
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
              @click="() => { router.push(`/o/${orgSlug}/orders`) }"
            />
          </div>

          <!-- ── Payment Expired ── -->
          <div v-else-if="isExpired" class="max-w-sm mx-auto bg-white rounded-xl border border-stone-200/60 p-5 text-center space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div class="size-12 mx-auto rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <UIcon name="i-lucide-timer" class="size-6" />
            </div>
            <div class="space-y-1">
              <div class="text-base font-bold text-stone-900">Waktu Pembayaran Habis</div>
              <p class="text-xs text-stone-500 leading-relaxed">Pesanan belum diproses karena pembayaran tidak diselesaikan tepat waktu. Silakan coba bayar kembali atau buat pesanan baru.</p>
            </div>
            <UButton
              label="Kembali ke Menu"
              color="primary"
              icon="i-lucide-arrow-left"
              block
              @click="() => { router.push(`/o/${orgSlug}/orders`) }"
            />
          </div>

          <!-- ── Payment Dibatalkan ── -->
          <div v-else-if="isFailed" class="max-w-sm mx-auto bg-white rounded-xl border border-stone-200/60 p-5 text-center space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div class="size-12 mx-auto rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center">
              <UIcon name="i-lucide-x-circle" class="size-6" />
            </div>
            <div class="space-y-1">
              <div class="text-base font-bold text-stone-900">Pembayaran Dibatalkan</div>
              <p class="text-xs text-stone-500 leading-relaxed">Transaksi QRIS dibatalkan. Silakan coba lagi jika ingin melanjutkan pembayaran.</p>
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
            <div class="bg-white rounded-xl border border-stone-200/60 shadow-sm overflow-hidden">
              <!-- Card Header -->
              <div class="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-receipt" class="size-4 text-orange-500 shrink-0" />
                  <div class="text-sm font-bold text-stone-900">Detail Tagihan</div>
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
              <div class="px-4 py-3.5 space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-500 font-medium shrink-0">No. Tagihan</span>
                  <span class="text-xs font-mono font-bold text-stone-900 text-right truncate">{{ openBill.order_number }}</span>
                </div>
                <div v-if="openBill.order_id" class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-500 font-medium shrink-0">ID Order</span>
                  <span class="text-xs font-mono font-semibold text-stone-800 text-right">{{ openBill.order_id }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-500 font-medium shrink-0">Meja / Area</span>
                  <span class="text-xs font-semibold text-stone-800 text-right">{{ openBill.dining_table?.name || openBill.dining_table?.code || '-' }}</span>
                </div>
                <div v-if="customerName" class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-500 font-medium shrink-0">Pelanggan</span>
                  <span class="text-xs font-semibold text-stone-800 text-right capitalize">{{ customerName }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs text-stone-500 font-medium shrink-0">Metode</span>
                  <span class="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                    <UIcon name="i-lucide-qr-code" class="size-3.5 text-orange-500 shrink-0" />
                    QRIS
                  </span>
                </div>

              </div>

              <!-- Financial Breakdown -->
              <div class="border-t border-dashed border-stone-200 px-4 py-3.5 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-stone-500 font-medium">Subtotal</span>
                  <span class="text-xs font-semibold text-stone-800">{{ formatCurrency(openBill.subtotal_amount) }}</span>
                </div>
                <div v-if="openBill.discount_amount > 0" class="flex items-center justify-between">
                  <span class="text-xs text-emerald-600 font-medium">Diskon</span>
                  <span class="text-xs font-semibold text-emerald-600">-{{ formatCurrency(openBill.discount_amount) }}</span>
                </div>
                <div v-if="openBill.service_charge_amount > 0" class="flex items-center justify-between">
                  <span class="text-xs text-stone-500 font-medium">Biaya Layanan</span>
                  <span class="text-xs font-semibold text-stone-800">{{ formatCurrency(openBill.service_charge_amount) }}</span>
                </div>
                <div v-if="openBill.tax_amount > 0" class="flex items-center justify-between">
                  <span class="text-xs text-stone-500 font-medium">Pajak</span>
                  <span class="text-xs font-semibold text-stone-800">{{ formatCurrency(openBill.tax_amount) }}</span>
                </div>
                <!-- Total -->
                <div class="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span class="text-[13px] font-bold text-stone-900">Total Bayar</span>
                  <span class="text-sm font-extrabold text-orange-600 tracking-tight">{{ formatCurrency(openBill.total_amount) }}</span>
                </div>
              </div>
            </div>

            <!-- ── Kolom Kanan: Pembayaran QRIS ── -->
            <div v-if="openBill.total_amount > 0" class="bg-white rounded-xl border border-stone-200/60 shadow-sm overflow-hidden">

              <!-- Card Header -->
              <div class="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-qr-code" class="size-4 text-orange-500 shrink-0" />
                  <div class="text-sm font-bold text-stone-900">Pembayaran QRIS</div>
                </div>
                <!-- Polling status indicator -->
                <div v-if="isPolling" class="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Menunggu</span>
                </div>
              </div>

              <!-- QR Code Section: active state -->
              <div v-if="qrDataUrl && !isPaid && !isFailed && !isExpired" class="px-4 py-4 flex flex-col items-center gap-4">

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
                    label="Download Gambar QR"
                    color="primary"
                    icon="i-lucide-download"
                    block
                    :loading="isDownloading"
                    :disabled="isDownloading || isSharing"
                    @click="handleDownloadQris"
                  />

                  <!-- Share QRIS to Payment Apps / WhatsApp / Gallery -->
                  <UButton
                    v-if="canUseWebShare"
                    label="Bagikan ke Aplikasi Pembayaran"
                    color="neutral"
                    variant="subtle"
                    icon="i-lucide-share-2"
                    block
                    :loading="isSharing"
                    :disabled="isSharing || isDownloading"
                    @click="handleShareQris"
                  />

                  <!-- Cancel Payment (open bill only) -->
                  <UButton
                    v-if="!isTableOrderPage"
                    label="Batalkan Pembayaran"
                    color="error"
                    variant="ghost"
                    icon="i-lucide-circle-x"
                    block
                    :loading="cancelPending"
                    :disabled="cancelPending"
                    @click="handleCancelPayment"
                  />
                </div>
              </div>

              <!-- Initiate Payment State — open bill, no QR yet -->
              <div v-else-if="!isTableOrderPage && !qrDataUrl && !isPaid && !isFailed && !isExpired" class="px-4 py-6 text-center">
                <div class="relative size-12 mx-auto mb-4">
                  <div class="absolute inset-0 bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 rounded-xl blur-md opacity-40 animate-pulse" />
                  <div class="relative size-12 rounded-xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                    QRIS
                  </div>
                </div>
                <div class="space-y-1 mb-4">
                  <div class="text-sm font-bold text-stone-900">Pembayaran Online QRIS</div>
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
              <div v-else-if="isTableOrderPage && !qrDataUrl && !isPaid && !isFailed && !isExpired" class="px-4 py-6 text-center">
                <div class="size-10 mx-auto mb-4 rounded-xl bg-stone-50 border border-stone-200 text-2xl flex items-center justify-center">
                  🏪
                </div>
                <div class="space-y-1 mb-4">
                  <div class="text-sm font-bold text-stone-900">Pembayaran di Kasir</div>
                  <p class="text-xs text-stone-500 leading-relaxed max-w-[240px] mx-auto">
                    Pesanan Anda telah tercatat di kasir. Silakan lakukan pembayaran langsung di kasir restoran atau tunggu staf kami melayani Anda di meja.
                  </p>
                </div>
                <div v-if="countdown > 0" class="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 py-1.5 px-3 rounded-xl mb-4">
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
          <div v-if="openBill && qrDataUrl && !isPaid && !isFailed && !isExpired" class="mt-5">
            <!-- Steps -->
            <div class="bg-white rounded-xl border border-stone-200/60 shadow-sm px-5 py-4">
              <div class="text-sm font-bold text-stone-900 flex items-center gap-1.5 mb-4">
                <UIcon name="i-lucide-info" class="size-4.5 text-orange-500" />
                Petunjuk Pembayaran
              </div>
              <ol class="space-y-3">
                <li class="flex items-start gap-2.5">
                  <span class="size-5.5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 text-xs">1</span>
                  <span class="text-xs text-stone-500 leading-relaxed pt-0.5">Buka aplikasi mobile banking atau e-wallet (GoPay, OVO, Dana, LinkAja, ShopeePay, dll).</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="size-5.5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 text-xs">2</span>
                  <span class="text-xs text-stone-500 leading-relaxed pt-0.5">Pilih opsi <strong class="text-stone-700">Scan / Bayar QRIS</strong> dan arahkan kamera ke QR Code di atas.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="size-5.5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 text-xs">3</span>
                  <span class="text-xs text-stone-500 leading-relaxed pt-0.5">Pastikan nominal tagihan sudah sesuai, lalu masukkan PIN pembayaran untuk menyelesaikan transaksi.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="size-5.5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 text-xs">4</span>
                  <span class="text-xs text-stone-500 leading-relaxed pt-0.5">Setelah pembayaran sukses, sistem akan memperbarui status pesanan secara otomatis dalam beberapa detik.</span>
                </li>
              </ol>

              <div class="mt-4 pt-3.5 border-t border-dashed border-stone-100 flex items-start gap-2 text-[11px] text-stone-400 leading-relaxed">
                <UIcon name="i-lucide-shield-check" class="size-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  Layanan pembayaran QRIS ini diproses secara aman. Pada aplikasi e-wallet Anda, detail penerima akan tertera atas nama <strong class="text-stone-600 font-semibold">PT Sarwa Kalyana Cara</strong> selaku penyelenggara resmi.
                </span>
              </div>
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
              @click="() => { router.push(`/o/${orgSlug}/orders`) }"
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
