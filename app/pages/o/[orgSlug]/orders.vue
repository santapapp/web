<script setup lang="ts">
import type { CartMode } from '~/stores/cart.store'
import { parseQrInput } from '~/composables/useCustomerSession'
import { mapOrderItem } from '~/composables/useCustomerOrder'
import { useEcho } from '~/composables/useEcho'

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
const {
  org,
  openingStatus,
  fullAddress,
  isLoading: orgIsLoading,
  isNotFound: orgIsNotFound,
  isServerError: orgIsServerError,
  refresh: refreshOrg
} = usePublicOrg(orgSlug)

// SEO: halaman order adalah sesi customer — selalu noindex.
// Canonical tidak menyertakan query params (?table=, ?bill=, ?order=).
useOutletSeo(orgSlug, {
  org,
  isLoading: orgIsLoading,
  isNotFound: orgIsNotFound,
  isServerError: orgIsServerError,
  routeType: 'orders',
})

const {
  filteredProducts,
  searchQuery,
  pending: menuPending,
  loadForSession,
  loadForOrgSlug,
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

// Computed: payment sedang pending pada open bill session
const isPaymentPending = computed(() =>
  isOpenBill.value && order.value?.payment_status === 'pending'
)

// Ref untuk element menu (dipakai saat 'add-more' dari OpenBillSessionView)
const menuSectionRef = ref<HTMLElement | null>(null)

// Riwayat pesanan terbaru per org (localStorage) — untuk ditampilkan di entry state.
const orderHistory = useOrderHistory(orgSlug.value)

const cartMode = computed<CartMode>(() =>
  customerSession.sessionMode.value === 'open_bill' ? 'open_bill' : 'table_order'
)

const cart = useOrderCart(cartMode)
const checkout = useCheckout(orgSlug, cart)

// Wrapper checkout: setelah open bill item berhasil ditambahkan,
// refresh data order dan kembali ke OpenBillSessionView.
const handleCheckout = async () => {
  const wasOpenBill = isOpenBill.value

  await checkout.checkout()

  // Hanya handle open bill — table order sudah di-handle router.push di useCheckout
  if (wasOpenBill && !checkout.error.value) {
    showMenuForAddMore.value = false
    // Refresh order terbaru agar OpenBillSessionView menampilkan item baru
    await fetchOpenBill()
  }
}

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

// Saat open bill aktif, tampilkan OpenBillSessionView dulu;
// menu bisa diakses via scroll ke bawah atau tombol "Tambah Pesanan".
// openBillDone: flag yang menjaga agar menu muncul setelah customer klik "Tambah Pesanan"
const showMenuForAddMore = ref(false)

const handleOpenBillAddMore = () => {
  showMenuForAddMore.value = true
  nextTick(() => {
    menuSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

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
let openBillPoll: ReturnType<typeof setInterval> | null = null

const stopTrackingPoll = () => {
  if (trackingPoll) {
    clearInterval(trackingPoll)
    trackingPoll = null
  }
}

const stopOpenBillPoll = () => {
  if (openBillPoll) {
    clearInterval(openBillPoll)
    openBillPoll = null
  }
}

const isOrderTerminal = (o: typeof order.value): boolean => {
  if (!o) return false
  return (
    o.order_status === 'completed' ||
    o.order_status === 'cancelled' ||
    o.payment_status === 'cancelled' ||
    o.payment_status === 'failed'
  )
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

const startOpenBillPoll = () => {
  stopOpenBillPoll()
  if (!isOpenBill.value || isOrderTerminal(order.value) || order.value?.bill_status === 'closed' || order.value?.payment_status === 'paid') return

  openBillPoll = setInterval(async () => {
    if (!isOpenBill.value) {
      stopOpenBillPoll()
      return
    }

    const res = await fetchOpenBill()
    if (res.success) {
      if (order.value?.bill_status === 'closed' || order.value?.payment_status === 'paid') {
        stopOpenBillPoll()
        const orderNumber = order.value.order_number
        if (orderNumber) {
          const publicRes = await fetchOrderStatus(orgSlug.value, orderNumber, { silent: true })
          if (publicRes.success) {
            customerSession.clearSession()
            await router.replace({
              path: `/o/${orgSlug.value}/orders`,
              query: { order: orderNumber }
            })
          }
        }
      }
    } else {
      const err = res.error as any
      if (err?.statusCode === 403) {
        stopOpenBillPoll()
        const orderNumber = order.value?.order_number
        if (orderNumber) {
          const publicRes = await fetchOrderStatus(orgSlug.value, orderNumber, { silent: true })
          if (publicRes.success) {
            customerSession.clearSession()
            await router.replace({
              path: `/o/${orgSlug.value}/orders`,
              query: { order: orderNumber }
            })
          }
        }
      }
    }
  }, TRACKING_POLL_MS)
}

onUnmounted(() => {
  stopTrackingPoll()
  stopOpenBillPoll()
  disconnectEcho()
})

const loadOrderingUi = async (isNewSession = false) => {
  isSessionReady.value = true
  sessionError.value = null

  // Untuk open bill: gunakan orgSlug dari URL (selalu tersedia, tidak bergantung
  // pada store org.id yang mungkin belum ter-populate saat ini).
  // Untuk table order: fetchMenu() sudah benar karena org.id di-set via startSession().
  const menuTask = isOpenBill.value
    ? loadForOrgSlug(orgSlug.value)
    : loadForSession()

  const fetchTasks: Promise<any>[] = [menuTask]
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

  if (isOpenBill.value) {
    startOpenBillPoll()
  }

  triggerWelcome(isNewSession)
}

const startSessionFromToken = async (token: string, shouldClearQuery = false, isNewSession = false) => {
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

  await loadOrderingUi(isNewSession)
  sessionLoading.value = false

  if (shouldClearQuery) {
    await clearQuery()
  }
}

let initRun = 0

const initialize = async () => {
  if (!import.meta.client) return
  await nextTick()

  // Org masih loading — tunggu selesai (watch orgIsLoading akan trigger ulang).
  if (orgIsLoading.value) {
    return
  }

  // Org tidak ditemukan atau error server — bersihkan state dan hentikan.
  if (orgIsNotFound.value || orgIsServerError.value) {
    customerSession.clearSession()
    sessionLoading.value = false
    isSessionReady.value = false
    return
  }

  const run = ++initRun
  sessionError.value = null
  // Hentikan polling tracking sebelumnya saat route berubah / re-init.
  stopTrackingPoll()
  stopOpenBillPoll()

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

// Trigger ulang initialize ketika route berubah ATAU ketika org selesai loading.
// Ini memastikan session logic tidak berjalan sebelum status org diketahui.
watch(
  [() => route.fullPath, orgIsLoading],
  () => {
    initialize()
  },
  { immediate: true }
)

const handleManualSubmit = (code: string) => {
  startSessionFromToken(code, false, true)
}

const handleScanToken = async (rawInput: string) => {
  overlay.close('scanner')

  const parsed = parseQrInput(rawInput)

  // Tidak dikenali sama sekali
  if (!parsed) {
    sessionError.value = 'Format QR tidak valid. Pastikan Anda scan QR yang benar.'
    return
  }

  // Open bill QR: URL dengan ?bill={public_token}
  // Langsung ke flow open bill — tidak lewat startSessionFromToken
  if (parsed.type === 'open_bill') {
    sessionLoading.value = true
    sessionError.value = null
    isSessionReady.value = false

    const result = await customerSession.startSessionForOpenBill(parsed.token, { orgSlug: orgSlug.value })

    if (!result.success) {
      sessionLoading.value = false
      if ((result as any).correctSlug) {
        await router.replace({
          path: `/o/${(result as any).correctSlug}/orders`,
          query: { bill: parsed.token }
        })
        return
      }
      sessionError.value = result.error ?? 'Bill tidak valid atau sudah berakhir.'
      return
    }

    await loadOrderingUi(true)
    sessionLoading.value = false
    return
  }

  // Order tracking QR: ?order= — bukan entry point untuk pemesanan
  if (parsed.type === 'order') {
    sessionError.value = 'QR ini untuk tracking pesanan, bukan untuk memesan. Gunakan QR meja.'
    return
  }

  // Table order QR — flow lama
  startSessionFromToken(rawInput, false, true)
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

// ── Real-Time Echo Integration ──
const { initEcho, disconnectEcho } = useEcho()

watch(
  [() => isOpenBill.value, () => order.value?.id],
  ([isBill, id]) => {
    if (!import.meta.client) return

    // Clean up any existing Echo connection
    disconnectEcho()

    if (isBill && id) {
      const publicToken = customerSession.sessionToken.value || order.value?.public_token
      if (!publicToken) return

      const billId = order.value?.order_id || id

      // Initialize Echo with the current customer's public token
      const echo = initEcho(publicToken)
      if (!echo) return

      // Subscribe to private channel and listen for repeat orders
      echo.private(`open-bill.${billId}`)
        .listen('.repeat-order-created', (payload: any) => {
          console.log('Real-time Open Bill Repeat Order Created:', payload)
          if (!order.value) return

          // Update total amount and bill status
          if (payload.orderTotal !== undefined || payload.order_total !== undefined) {
            order.value.total_amount = Number(payload.orderTotal ?? payload.order_total)
          }
          if (payload.billStatus || payload.bill_status) {
            order.value.bill_status = payload.billStatus || payload.bill_status
          }

          // Append items from the new batch (mapping them appropriately)
          if (Array.isArray(payload.items) && payload.items.length > 0) {
            const mappedItems = payload.items.map(mapOrderItem)

            // Avoid adding duplicates (just in case)
            const existingIds = new Set(order.value.items.map(i => i.id))
            const newItems = mappedItems.filter((item: any) => !existingIds.has(item.id))
            
            order.value.items = [...order.value.items, ...newItems]

            // Recalculate subtotal amount based on all items
            order.value.subtotal_amount = order.value.items.reduce((sum: number, item: any) => sum + item.subtotal, 0)
          }

          // Sync the updated bill details to the customer session store
          const sessionStore = useCustomerSessionStore()
          if (sessionStore.sessionType === 'open_bill' && sessionStore.openBill) {
            const rawStatus = order.value.bill_status as string
            const status: 'open' | 'closed' | 'locked' =
              rawStatus === 'locked' ? 'locked' :
              (['closed', 'cancelled', 'failed', 'paid', 'expired'].includes(rawStatus) ? 'closed' : 'open')

            sessionStore.setOpenBill({
              id: String(order.value.id ?? order.value.public_token ?? sessionStore.sessionToken ?? ''),
              bill_number: String(order.value.order_number ?? '-'),
              status,
              total_amount: Number(order.value.total_amount ?? 0)
            })
          }
        })
    }
  },
  { immediate: true }
)

// ── Welcome Screen Handlers ──
const showWelcomeModal = ref(false)
const sessionToken = computed(() => customerSession.sessionToken.value || '')
const welcomeShownKey = computed(() => `welcome_shown_${orgSlug.value}_${sessionToken.value}`)

const triggerWelcome = (force = false) => {
  if (!import.meta.client) return
  if (force && sessionToken.value) {
    sessionStorage.removeItem(welcomeShownKey.value)
  }
  if (sessionToken.value && !sessionStorage.getItem(welcomeShownKey.value)) {
    showWelcomeModal.value = true
  }
}

const handleWelcomeConfirm = () => {
  if (import.meta.client) {
    sessionStorage.setItem(welcomeShownKey.value, 'true')
  }
  showWelcomeModal.value = false
}

// ── Sesi Exit Handlers ──
const showExitConfirm = ref(false)

const handleExitSession = () => {
  showExitConfirm.value = true
}

const handleConfirmExit = () => {
  customerSession.clearSession()
  showExitConfirm.value = false
  router.push(`/o/${orgSlug.value}`)
}

const handleCancelExit = () => {
  showExitConfirm.value = false
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

    <!-- Org loading — tampilkan spinner hingga status org diketahui -->
    <OrdersSessionLoading v-else-if="orgIsLoading" />

    <!-- Org tidak ditemukan -->
    <OrgStatusPage
      v-else-if="orgIsNotFound"
      type="not_found"
    />

    <!-- Org error server / network -->
    <OrgStatusPage
      v-else-if="orgIsServerError"
      type="server_error"
      @retry="refreshOrg"
    />

    <OrdersSessionLoading v-else-if="sessionLoading" />

    <OrdersStartSection
      v-else-if="!isSessionReady"
      :session-error="sessionError"
      :loading="sessionLoading"
      :history-items="orderHistory.items.value"
      :history-refreshing="orderHistory.isRefreshing.value"
      :org-slug="orgSlug"
      :org="org ?? undefined"
      :opening-status="openingStatus ?? undefined"
      :full-address="fullAddress || undefined"
      @open-scanner="overlay.open('scanner')"
      @submit-manual="handleManualSubmit"
    />

    <template v-else>
      <div class="flex flex-col min-h-[calc(100dvh-56px)] lg:min-h-[calc(100dvh-64px)]">

        <!-- ── Open Bill Session View ────────────────────────────── -->
        <!-- Tampil saat sesi open bill aktif, sebelum customer klik "Tambah Pesanan" -->
        <OrdersOpenBillSessionView
          v-if="isOpenBill && !showMenuForAddMore"
          :order="order"
          :loading="false"
          :org-slug="orgSlug"
          :bill-token="customerSession.sessionToken.value ?? ''"
          @add-more="handleOpenBillAddMore"
          @exit-session="handleExitSession"
        />

        <!-- ── Menu (Table Order atau Add-More open bill) ────────── -->
        <div
          v-else
          class="flex h-[calc(100dvh-56px)] lg:h-[calc(100dvh-64px)]"
        >
          <main ref="menuSectionRef" class="flex-1 overflow-y-auto">
            <!-- Banner open bill: pesan lagi -->
            <div
              v-if="isOpenBill"
              class="px-4 py-3 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between gap-3 shadow-none"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  class="size-8 rounded-full flex items-center justify-center text-emerald-700 hover:bg-emerald-100 hover:text-emerald-950 bg-white border border-emerald-200 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs shrink-0"
                  title="Kembali ke Sesi"
                  @click="showMenuForAddMore = false"
                >
                  <UIcon name="i-lucide-arrow-left" class="size-4" />
                </button>
                <span class="text-xs font-black text-emerald-900 truncate">
                  Tambah Pesanan
                </span>
              </div>
              <div v-if="order?.order_number" class="text-right shrink-0">
                <span class="text-[10px] sm:text-xs font-bold font-mono text-emerald-800 bg-emerald-100/60 border border-emerald-200/50 px-2 py-0.5 rounded-lg">
                  #{{ order.order_number }}
                </span>
              </div>
            </div>

            <!-- Banner table session: ganti meja & keluar sesi -->
            <div
              v-else-if="tableLabel"
              class="px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 border-b border-orange-600/30 flex items-center justify-between gap-3 shadow-xs"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="size-6 rounded-full bg-white/15 border border-white/10 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-armchair" class="size-3.5 text-white" />
                </span>
                <span class="text-xs font-black text-white truncate drop-shadow-xs">
                  {{ tableLabel.toLowerCase().includes('meja') ? tableLabel : 'Meja ' + tableLabel }}
                </span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  class="size-8 rounded-full flex items-center justify-center text-white hover:bg-white/15 active:scale-95 transition-all duration-150 cursor-pointer"
                  aria-label="Ganti Meja"
                  title="Ganti Meja"
                  @click="overlay.open('scanner')"
                >
                  <UIcon name="i-lucide-qr-code" class="size-4.5 text-white" />
                </button>
                <span class="h-4 w-px bg-white/20" />
                <button
                  type="button"
                  class="size-8 rounded-full flex items-center justify-center text-white hover:bg-white/15 hover:text-rose-200 active:scale-95 transition-all duration-150 cursor-pointer"
                  aria-label="Keluar Sesi"
                  title="Keluar Sesi"
                  @click="handleExitSession"
                >
                  <UIcon name="i-lucide-log-out" class="size-4.5" />
                </button>
              </div>
            </div>

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
          v-if="!overlay.anyOpen && (!isOpenBill || showMenuForAddMore)"
          :total-qty="cartTotalQuantity"
          :total-price="cartTotalPrice"
          @view-cart="overlay.open('cart')"
        />
      </div>
    </template>

    <OrdersCartSheet
      v-model:customer-name="cart.customerName.value"
      v-model:order-note="cart.orderNote.value"
      :open="overlay.isCart"
      :items="cartItems"
      :submitting="checkout.submitting.value"
      :error="checkout.error.value"
      :is-open-bill="isOpenBill"
      :payment-locked="isPaymentPending"
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
      @submit="handleCheckout"
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

    <SessionConfirmExitSessionModal
      :open="showExitConfirm"
      :has-cart-items="customerSession.hasCart.value"
      :session-mode="customerSession.sessionMode.value"
      @confirm="handleConfirmExit"
      @cancel="handleCancelExit"
    />

    <Teleport to="body">
      <OrdersWelcomeModal
        :open="showWelcomeModal"
        :org-name="org?.name || ''"
        :org-logo="org?.logo"
        :table-name="tableLabel"
        :session-type="isOpenBill ? 'open_bill' : 'table_order'"
        @confirm="handleWelcomeConfirm"
      />
    </Teleport>
  </div>
</template>
