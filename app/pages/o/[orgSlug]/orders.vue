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
  orderToken,
  invalidReason
} = useOrderMode()

const customerSession = useCustomerSession()
const sessionLoading = ref(mode.value === 'table_order' && Boolean(tableToken.value))
const sessionError = ref<string | null>(null)
const isSessionReady = ref(false)
const showScanner = ref(false)

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

const cartMode = computed<CartMode>(() =>
  String(order.value?.order_type || '').includes('open_bill') ? 'open_bill' : 'table_order'
)

const cart = useOrderCart(cartMode)
const checkout = useCheckout(orgSlug, cart)

const cartItems = cart.items
const cartTotalQuantity = cart.totalQuantity
const cartTotalPrice = cart.totalPrice
const cartQtyMap = cart.cartQtyMap

const tableLabel = computed(() => {
  const table = customerSession.table.value
  if (!table) return null
  return table.name || table.code
})

const isOpenBill = computed(() =>
  String(order.value?.order_type || '').includes('open_bill')
)

const statusErrorMessage = computed(() =>
  statusError.value?.message ?? null
)

const clearQuery = async () => {
  if (Object.keys(route.query).length === 0) return
  await router.replace({ path: route.path })
}

const loadOrderingUi = async () => {
  isSessionReady.value = true
  sessionError.value = null

  const [menuResult, orderResult] = await Promise.all([
    loadForSession(),
    fetchOpenBill()
  ])

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

  const run = ++initRun
  sessionError.value = null

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
    return
  }

  if (mode.value === 'table_order' && tableToken.value) {
    await startSessionFromToken(tableToken.value, true)
    return
  }

  sessionLoading.value = true

  const restored = await customerSession.restoreAndValidateForOrg(orgSlug.value)
  if (run !== initRun) return

  if (restored) {
    await loadOrderingUi()
  } else {
    isSessionReady.value = false
    sessionError.value = 'no_session'
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
  showScanner.value = false
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
      @open-scanner="showScanner = true"
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

        <OrdersCartSidebar
          :items="cartItems"
          :submitting="checkout.submitting.value"
          :error="checkout.error.value"
          @submit="checkout.checkout"
          @update-qty="cart.updateQuantityById"
          @remove="cart.removeById"
        />
      </div>

      <OrdersMobileCheckoutBar
        :total-qty="cartTotalQuantity"
        :total-price="cartTotalPrice"
        :submitting="checkout.submitting.value"
        :error="checkout.error.value"
        @submit="checkout.checkout"
      />
    </template>

    <Teleport to="body">
      <OrdersQrScannerPanel
        v-if="showScanner"
        @scan="handleScanToken"
        @close="showScanner = false"
      />
    </Teleport>

    <OrdersProductDetailSheet
      :product="cart.selectedProduct.value"
      :open="cart.showProductDetail.value"
      @close="cart.closeProductDetail"
      @add-to-cart="cart.addFromDetail"
    />
  </div>
</template>
