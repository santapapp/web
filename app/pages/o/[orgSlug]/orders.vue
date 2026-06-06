<script setup lang="ts">
import type { CartMode } from '~/stores/cart.store'

definePageMeta({
  layout: 'order',
  middleware: ['org-exists', 'validate-order-query']
})

const route = useRoute()
const router = useRouter()
const orgSlug = computed(() => String(route.params.orgSlug || ''))

const {
  mode,
  tableToken,
  billToken,
  orderToken,
  invalidReason
} = useOrderMode()

const customerSession = useCustomerSession()
const overlay = useUiOverlayStore()
const sessionLoading = ref(mode.value !== 'invalid')
const sessionError = ref<string | null>(null)
const isSessionReady = ref(false)

// Konfigurasi pajak / biaya layanan org (publik, di-cache oleh useAsyncData key).
// Dipakai untuk ringkasan pembayaran di CartSheet.
const { org, openingStatus, fullAddress } = usePublicOrg(orgSlug)

const {
  filteredProducts,
  searchQuery,
  pending: menuPending,
  loadForSession,
  categories,
  activeCategory,
  setCategory
} = useOrderMenu()

const {
  order,
  statusPending,
  statusError,
  fetchOpenBill,
  fetchOrderStatus
} = useCustomerOrder()

// Riwayat pesanan terbaru per org (localStorage) — untuk ditampilkan di entry state.
const orderHistory = useOrderHistory(orgSlug.value)

const cartMode = computed<CartMode>(() =>
  customerSession.sessionMode.value === 'open_bill' ? 'open_bill' : 'table_order'
)

const cart = useOrderCart(cartMode)
const checkout = useCheckout(orgSlug, cart)

const productDetailCtaDisabled = computed(() => overlay.anyOpen && !overlay.isProduct)

const cartItems = cart.items
const cartTotalQuantity = cart.totalQuantity
const cartTotalPrice = cart.totalPrice
const cartQtyMap = cart.cartQtyMap

const tableLabel = computed(() => {
  const table = customerSession.table.value
  if (!table) return null
  return table.name || table.code
})

const isOpenBill = computed(() => customerSession.sessionMode.value === 'open_bill')

const statusErrorMessage = computed(() =>
  statusError.value?.message ?? null
)

const clearQuery = async () => {
  if (Object.keys(route.query).length === 0) return
  await router.replace({ path: route.path })
}

// ── Live polling untuk tracking view (mode order_detail) ──────────────────────
// Status final selalu dibaca dari Laravel (gateway = source of truth). Endpoint
// publik /orders/{order} men-sinkronkan pembayaran ke provider, jadi polling ini
// otomatis menangkap pembayaran yang baru settle maupun progres dapur.
const TRACKING_POLL_MS = 8000
let trackingPoll: ReturnType<typeof setInterval> | null = null

const isOrderTerminal = (o: typeof order.value): boolean => {
  if (!o) return false
  return (
    o.order_status === 'completed' ||
    o.order_status === 'cancelled' ||
    o.payment_status === 'cancelled' ||
    o.payment_status === 'failed'
  )
}

const stopTrackingPoll = () => {
  if (trackingPoll) {
    clearInterval(trackingPoll)
    trackingPoll = null
  }
}

const startTrackingPoll = () => {
  stopTrackingPoll()
  // Tidak perlu polling kalau sudah status final.
  if (isOrderTerminal(order.value)) return

  trackingPoll = setInterval(async () => {
    if (mode.value !== 'order_detail') {
      stopTrackingPoll()
      return
    }
    // silent: refresh diam-diam di background — tampilan tidak berubah jadi loading,
    // hanya ter-update in-place saat status benar-benar berubah.
    await fetchOrderStatus(orgSlug.value, orderToken.value || '', { silent: true })
    if (isOrderTerminal(order.value)) stopTrackingPoll()
  }, TRACKING_POLL_MS)
}

onUnmounted(stopTrackingPoll)

const loadOrderingUi = async () => {
  isSessionReady.value = true
  sessionError.value = null

  // fetchOpenBill() is ONLY for open_bill session mode
  const fetchTasks: Promise<any>[] = [loadForSession()]
  if (isOpenBill.value) {
    fetchTasks.push(fetchOpenBill())
  }

  const results = await Promise.all(fetchTasks)
  const orderResult = isOpenBill.value ? results[1] : null

  if (orderResult && !orderResult.success) {
    customerSession.clearSession()
    isSessionReady.value = false
    sessionError.value = orderResult.error?.message ?? 'Sesi tidak valid atau sudah kedaluwarsa.'
    return
  }
}

const startSessionFromToken = async (token: string, shouldClearQuery = false) => {
  sessionLoading.value = true
  sessionError.value = null
  isSessionReady.value = false

  const result = await customerSession.startSessionFromToken(token, { orgSlug: orgSlug.value })

  if (!result.success) {
    sessionLoading.value = false
    if (result.correctSlug) {
      await router.replace({
        path: `/o/${result.correctSlug}/orders`,
        query: { table: token }
      })
      return
    }
    sessionError.value = result.error ?? 'Kode meja tidak valid atau sudah tidak tersedia.'
    return
  }

  await loadOrderingUi()
  sessionLoading.value = false

  if (shouldClearQuery) {
    await clearQuery()
  }
}

let initRun = 0

const initialize = async () => {
  if (!import.meta.client) return
  await nextTick()

  const run = ++initRun
  sessionError.value = null
  // Hentikan polling tracking sebelumnya saat route berubah / re-init.
  stopTrackingPoll()

  if (mode.value === 'invalid') {
    customerSession.clearSession()
    isSessionReady.value = false
    sessionError.value =
      invalidReason.value === 'unsupported_query'
        ? 'Link pesanan tidak valid. Gunakan QR atau kode yang dibuat kasir.'
        : 'Link pesanan tidak valid.'
    return
  }

  if (mode.value === 'order_detail') {
    isSessionReady.value = false
    sessionLoading.value = false
    await fetchOrderStatus(orgSlug.value, orderToken.value || '')
    if (run !== initRun) return
    // Mulai polling live agar status pembayaran & dapur ter-update tanpa refresh manual.
    startTrackingPoll()
    return
  }

  if (mode.value === 'table_order' && tableToken.value) {
    // Table order: pertahankan token di URL sebagai entry point sementara.
    // JANGAN clearQuery — token meja bukan session; jika halaman di-refresh, konteks
    // dibangun ulang dari URL sebagai order BARU (bukan melanjutkan session lama).
    await startSessionFromToken(tableToken.value, false)
    return
  }

  if (mode.value === 'open_bill' && billToken.value) {
    sessionLoading.value = true
    const result = await customerSession.startSessionForOpenBill(billToken.value, { orgSlug: orgSlug.value })
    if (!result.success) {
       sessionLoading.value = false
       if (result.correctSlug) {
           await router.replace({
             path: `/o/${result.correctSlug}/orders`,
             query: { bill: billToken.value }
           })
           return
       }
       sessionError.value = result.error ?? 'Bill tidak valid.'
       return
    }
    await loadOrderingUi()
    sessionLoading.value = false
    await clearQuery()
    return
  }

  // Tanpa query table/order/bill:
  // - Open bill yang tersimpan (session sah) boleh dipulihkan & dilanjutkan.
  // - Table order BUKAN session, jadi TIDAK pernah auto-restore. Tampilkan entry state
  //   agar user scan/masukkan kode meja untuk memulai order baru.
  sessionLoading.value = true

  const restored = await customerSession.restoreAndValidateForOrg(orgSlug.value)
  if (run !== initRun) return

  if (restored && customerSession.sessionMode.value === 'open_bill') {
    await loadOrderingUi()
  } else {
    // Pastikan tidak ada sisa konteks meja yang membuat UI ordering terbuka tanpa scan.
    if (customerSession.sessionMode.value !== 'open_bill') {
      customerSession.clearSession()
    }
    isSessionReady.value = false
    sessionError.value = 'no_session'
    // Segarkan status riwayat (non-final) agar badge di entry state akurat.
    orderHistory.refreshFromBackend()
  }

  sessionLoading.value = false
}

watch(
  () => route.fullPath,
  () => {
    initialize()
  },
  { immediate: true }
)

const handleManualSubmit = (code: string) => {
  startSessionFromToken(code)
}

const handleScanToken = (token: string) => {
  overlay.close('scanner')
  startSessionFromToken(token)
}

const handleIncrease = (product: any) => {
  cart.addDirect(product)
}

const handleDecrease = (product: any) => {
  const item = cartItems.value.find(
    (i) => i.menuId === product.id && i.selected_variants.length === 0
  )
  if (!item) return
  if (item.quantity <= 1) {
    cart.removeById(item.id)
  } else {
    cart.updateQuantityById(item.id, item.quantity - 1)
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0 bg-gray-50">
    <OrdersOrderStatusView
      v-if="mode === 'order_detail'"
      :order="order"
      :loading="statusPending"
      :error="statusErrorMessage"
      :org-slug="orgSlug"
      :order-token="orderToken"
    />

    <OrdersSessionLoading v-else-if="sessionLoading" />

    <OrdersStartSection
      v-else-if="!isSessionReady"
      :session-error="sessionError"
      :loading="sessionLoading"
      :history-items="orderHistory.items.value"
      :org-slug="orgSlug"
      :org="org ?? undefined"
      :opening-status="openingStatus ?? undefined"
      :full-address="fullAddress || undefined"
      @open-scanner="overlay.open('scanner')"
      @submit-manual="handleManualSubmit"
    />

    <template v-else>
      <div class="flex h-[calc(100dvh-56px)] lg:h-[calc(100dvh-64px)]">
        <main class="flex-1 overflow-y-auto">
          <OrdersOrderMenuList
            v-model:search-query="searchQuery"
            :products="filteredProducts"
            :loading="menuPending"
            :cart-qty-map="cartQtyMap"
            :table-label="tableLabel"
            :is-open-bill="isOpenBill"
            :categories="categories"
            :active-category="activeCategory"
            @add="cart.addDirect"
            @open-detail="cart.openProductDetail"
            @change-category="setCategory"
            @decrease="handleDecrease"
            @increase="handleIncrease"
          />
        </main>
      </div>

      <OrdersMobileCheckoutBar
        v-if="!overlay.anyOpen"
        :total-qty="cartTotalQuantity"
        :total-price="cartTotalPrice"
        @view-cart="overlay.open('cart')"
      />
    </template>

    <OrdersCartSheet
      v-model:customer-name="cart.customerName.value"
      v-model:order-note="cart.orderNote.value"
      :open="overlay.isCart"
      :items="cartItems"
      :submitting="checkout.submitting.value"
      :error="checkout.error.value"
      :is-open-bill="isOpenBill"
      :tax-enabled="org?.tax_enabled"
      :tax-rate="org?.tax_rate"
      :service-charge-enabled="org?.service_charge_enabled"
      :service-charge-rate="org?.service_charge_rate"
      :table-label="tableLabel"
      @close="overlay.close('cart')"
      @add-more="overlay.close('cart')"
      @update-qty="cart.updateQuantityById"
      @remove="cart.removeById"
      @update-note="cart.updateNoteById"
      @submit="checkout.checkout"
    />

    <Teleport to="body">
      <OrdersQrScannerPanel
        v-if="overlay.isScanner"
        @scan="handleScanToken"
        @close="overlay.close('scanner')"
      />
    </Teleport>

    <OrdersProductDetailSheet
      :product="cart.selectedProduct.value"
      :open="cart.showProductDetail.value"
      :cta-disabled="productDetailCtaDisabled"
      @close="cart.closeProductDetail"
      @add-to-cart="cart.addFromDetail"
    />
  </div>
</template>
