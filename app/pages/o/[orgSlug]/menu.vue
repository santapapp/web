<script setup lang="ts">
import type { CartMode } from '~/stores/cart.store'
import type { MenuProduct } from '~/types/menu'

definePageMeta({
  layout: 'org',
  middleware: ['org-exists']
})

const route = useRoute()
const router = useRouter()
const orgSlug = computed(() => String(route.params.orgSlug || ''))
const outletPath = computed(() => `/o/${orgSlug.value}`)
const orderPath = computed(() => `/o/${orgSlug.value}/orders`)

const overlay = useUiOverlayStore()
const customerSession = useCustomerSession()

const {
  org,
  openingStatus,
  fullAddress,
  isLoading: orgIsLoading,
  isNotFound: orgIsNotFound,
  isServerError: orgIsServerError,
  refresh: refreshOrg
} = usePublicOrg(orgSlug)

const {
  products,
  filteredProducts,
  searchQuery,
  pending: menuPending,
  error: menuError,
  loadForOrgSlug,
  categories,
  activeCategory,
  totalCount,
  setCategory
} = useOrderMenu()

useOutletSeo(orgSlug, {
  org,
  isLoading: orgIsLoading,
  isNotFound: orgIsNotFound,
  isServerError: orgIsServerError,
  routeType: 'menu'
})

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const sameSlug = (left?: string | null, right?: string | null) =>
  String(left || '').trim().toLowerCase() === String(right || '').trim().toLowerCase()

const loadedMenuSlug = ref('')
const checkoutBlockedMessage = ref<string | null>(null)

const loadMenu = async (slug = org.value?.slug || orgSlug.value) => {
  const normalizedSlug = String(slug || '').trim()
  if (!normalizedSlug) return

  loadedMenuSlug.value = normalizedSlug
  await loadForOrgSlug(normalizedSlug)
}

watch(
  [org, orgSlug],
  ([orgValue, routeSlug]) => {
    const activeSlug = orgValue?.slug || routeSlug
    if (!activeSlug || loadedMenuSlug.value === activeSlug) return
    loadMenu(activeSlug)
  },
  { immediate: true }
)

const realCategories = computed(() =>
  categories.value.filter((category) => category.id !== 'all')
)

const availableCount = computed(() =>
  products.value.filter((product) => product.is_available).length
)

const filteredCategoryGroups = computed(() => {
  const visibleProductIds = new Set(filteredProducts.value.map((product) => product.id))

  return realCategories.value
    .map((category) => ({
      ...category,
      menus: category.menus.filter((product) => visibleProductIds.has(product.id))
    }))
    .filter((category) => category.menus.length > 0)
})

const shouldGroupByCategory = computed(() =>
  activeCategory.value === 'all' && filteredCategoryGroups.value.length > 1
)

const menuErrorMessage = computed(() =>
  menuError.value?.message ?? 'Menu gagal dimuat. Coba lagi sebentar.'
)

const isSessionForThisOrg = computed(() =>
  sameSlug(customerSession.orgSlug.value, orgSlug.value)
)

const cartMode = computed<CartMode>(() =>
  isSessionForThisOrg.value && customerSession.sessionMode.value === 'open_bill'
    ? 'open_bill'
    : 'table_order'
)

const cart = useOrderCart(cartMode)
const productDetailCtaDisabled = computed(() => overlay.anyOpen && !overlay.isProduct)
</script>

<template>
  <div class="min-h-dvh bg-gray-50">
    <div v-if="orgIsLoading" class="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <USkeleton class="h-40 w-full rounded-2xl" />
      <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <USkeleton v-for="n in 10" :key="n" class="h-56 rounded-2xl" />
      </div>
    </div>

    <OrgStatusPage
      v-else-if="orgIsServerError"
      type="server_error"
      @retry="refreshOrg"
    />

    <OrgStatusPage
      v-else-if="orgIsNotFound || !org"
      type="not_found"
    />

    <template v-else>
      <!-- Hero Section -->
      <section class="border-b border-gray-100 bg-white">
        <div class="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <!-- Back link -->
          <NuxtLink
            :to="outletPath"
            class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 mb-4"
          >
            <UIcon name="i-lucide-arrow-left" class="size-3.5" />
            Kembali ke restoran
          </NuxtLink>

          <div class="flex items-start justify-between gap-4">
            <!-- Left: identity -->
            <div class="min-w-0 flex-1">
              <p class="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-0.5">Menu Lengkap</p>
              <h1 class="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl leading-none">
                {{ org.name }}
              </h1>
              <p v-if="fullAddress" class="mt-1.5 text-xs font-medium text-gray-400 leading-relaxed">
                {{ fullAddress }}
              </p>

              <!-- Stats row -->
              <div class="mt-3 flex flex-wrap items-center gap-1.5">
                <UBadge
                  v-if="openingStatus"
                  :label="openingStatus.label"
                  :color="openingStatus.open ? 'success' : 'error'"
                  variant="soft"
                  size="xs"
                  class="rounded-full font-semibold"
                />
                <span class="text-xs font-semibold text-gray-500">{{ totalCount }} menu</span>
                <span class="text-gray-300 text-xs">·</span>
                <span class="text-xs font-semibold text-gray-500">{{ availableCount }} tersedia</span>
                <template v-if="realCategories.length">
                  <span class="text-gray-300 text-xs">·</span>
                  <span class="text-xs font-semibold text-gray-500">{{ realCategories.length }} kategori</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto w-full max-w-7xl px-4 py-5 pb-32 sm:px-6 lg:px-8 lg:pb-10">
        <main class="min-w-0">
          <div class="sticky top-14 z-30 -mx-4 border-b border-gray-100 bg-gray-50/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-16 lg:mx-0 lg:rounded-2xl lg:border lg:bg-white/95 lg:px-4">
            <div class="flex flex-col gap-3">
              <OrdersMenuSearchBar v-model="searchQuery" />

              <OrdersCategoryTabs
                v-if="categories.length > 1"
                :categories="categories"
                :active-category="activeCategory"
                @change="setCategory"
              />
            </div>
          </div>

          <div class="mt-5">
            <UAlert
              v-if="menuError"
              icon="i-lucide-wifi-off"
              color="error"
              variant="soft"
              title="Menu belum bisa dimuat"
              :description="menuErrorMessage"
              class="rounded-2xl"
            >
              <template #actions>
                <UButton
                  color="error"
                  variant="soft"
                  icon="i-lucide-refresh-cw"
                  label="Coba Lagi"
                  @click="loadMenu()"
                />
              </template>
            </UAlert>

            <div v-else-if="menuPending" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <div v-for="n in 10" :key="n" class="overflow-hidden rounded-2xl bg-white shadow-sm">
                <USkeleton class="aspect-[4/3] w-full" />
                <div class="space-y-2 p-3">
                  <USkeleton class="h-4 w-3/4 rounded-lg" />
                  <USkeleton class="h-3.5 w-1/2 rounded-lg" />
                </div>
              </div>
            </div>

            <OrdersEmptyState
              v-else-if="products.length === 0"
              title="Menu belum tersedia"
              description="Restoran belum menampilkan menu untuk pelanggan."
              icon="i-lucide-utensils-crossed"
            />

            <OrdersEmptyState
              v-else-if="filteredProducts.length === 0"
              title="Menu tidak ditemukan"
              description="Coba kata kunci atau kategori lain."
              icon="i-lucide-search-x"
            />

            <div v-else-if="shouldGroupByCategory" class="space-y-8">
              <section
                v-for="category in filteredCategoryGroups"
                :key="category.id"
                class="space-y-3"
              >
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h2 class="text-base font-extrabold text-gray-950">{{ category.name }}</h2>
                    <p class="text-xs font-semibold text-gray-400">{{ category.menus.length }} menu</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  <OrdersProductCard
                    v-for="product in category.menus"
                    :key="product.id"
                    :product="product"
                    :read-only="true"
                    @open-detail="cart.openProductDetail"
                  />
                </div>
              </section>
            </div>

            <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <OrdersProductCard
                v-for="product in filteredProducts"
                :key="product.id"
                :product="product"
                :read-only="true"
                @open-detail="cart.openProductDetail"
              />
            </div>
          </div>
        </main>
      </section>
    </template>

    <OrdersProductDetailSheet
      :product="cart.selectedProduct.value"
      :open="cart.showProductDetail.value"
      :cta-disabled="productDetailCtaDisabled"
      :read-only="true"
      @close="cart.closeProductDetail"
    />
  </div>
</template>
