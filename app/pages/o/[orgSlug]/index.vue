<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import OrgHeroSection from '~/components/org/OrgHeroSection.vue'
import OrgStartOrderCard from '~/components/org/OrgStartOrderCard.vue'
import OrgMenuPreviewSection from '~/components/org/OrgMenuPreviewSection.vue'

definePageMeta({
  layout: 'org',
  middleware: ['org-exists']
})

const route = useRoute()
const orgSlug = computed(() => String(route.params.orgSlug || ''))
const orderPath = computed(() => `/o/${orgSlug.value}/orders`)

const overlay = useUiOverlayStore()
const customerSession = useCustomerSession()

const {
  org,
  openingStatus,
  fullAddress,
  isLoading,
  isNotFound,
  isServerError,
  refresh
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
  setCategory
} = useOrderMenu()

const pageLoading = computed(() => isLoading.value || menuPending.value)
const loadedMenuSlug = ref('')

watch(
  org,
  async (value) => {
    const slug = value?.slug || orgSlug.value
    if (!slug || loadedMenuSlug.value === slug) return
    loadedMenuSlug.value = slug
    await loadForOrgSlug(slug)
  },
  { immediate: true }
)

const sameSlug = (left?: string | null, right?: string | null) =>
  String(left || '').trim().toLowerCase() === String(right || '').trim().toLowerCase()

const isSessionForThisOrg = computed(() =>
  sameSlug(customerSession.orgSlug.value, orgSlug.value)
)

const cartMode = computed(() =>
  isSessionForThisOrg.value && customerSession.sessionMode.value === 'open_bill'
    ? 'open_bill'
    : 'table_order'
)

const cart = useOrderCart(cartMode)
const productDetailCtaDisabled = computed(() => overlay.anyOpen && !overlay.isProduct)

const realCategories = computed(() =>
  categories.value.filter((category) => category.id !== 'all')
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

useOutletSeo(orgSlug, {
  org,
  isLoading,
  isNotFound,
  isServerError,
  routeType: 'outlet-index',
})
</script>

<template>
  <div class="min-h-dvh bg-gray-50">
    <!-- Loading skeleton -->
    <div v-if="pageLoading" class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <USkeleton class="h-64 w-full rounded-lg" />
      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        <USkeleton v-for="n in 3" :key="n" class="h-28 rounded-lg" />
      </div>
      <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <USkeleton v-for="n in 6" :key="n" class="h-44 rounded-lg" />
      </div>
    </div>

    <!-- Server error state -->
    <OrgStatusPage
      v-else-if="isServerError"
      type="server_error"
      @retry="refresh"
    />

    <!-- Not found state -->
    <OrgStatusPage
      v-else-if="isNotFound || !org"
      type="not_found"
    />

    <!-- Success state -->
    <template v-else>
      <OrgHeroSection
        :org="org"
        :opening-status="openingStatus"
        :full-address="fullAddress"
      />

      <div class="space-y-5 pb-10">
        <OrgStartOrderCard :order-to="orderPath" />
        
        <OrgMenuPreviewSection
          v-model:search-query="searchQuery"
          :products="filteredProducts"
          :loading="menuPending"
          :categories="categories"
          :active-category="activeCategory"
          :should-group-by-category="shouldGroupByCategory"
          :filtered-category-groups="filteredCategoryGroups"
          :menu-error="menuError"
          :menu-error-message="menuErrorMessage"
          @open-detail="cart.openProductDetail"
          @change-category="setCategory"
          @retry="loadForOrgSlug(org?.slug || orgSlug)"
        />
      </div>
    </template>

    <!-- Product detail modal/sheet -->
    <OrdersProductDetailSheet
      :product="cart.selectedProduct.value"
      :open="cart.showProductDetail.value"
      :cta-disabled="productDetailCtaDisabled"
      :read-only="true"
      @close="cart.closeProductDetail"
    />
  </div>
</template>
