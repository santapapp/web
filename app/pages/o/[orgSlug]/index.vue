<script setup lang="ts">
import OrgHeroSection from '~/components/org/OrgHeroSection.vue'
import OrgTransactionInfoCard from '~/components/org/OrgTransactionInfoCard.vue'
import OrgStartOrderCard from '~/components/org/OrgStartOrderCard.vue'
import OrgMenuPreviewSection from '~/components/org/OrgMenuPreviewSection.vue'

definePageMeta({
  layout: 'org',
  middleware: ['org-exists']
})

const route = useRoute()
const orgSlug = computed(() => String(route.params.orgSlug || ''))
const orderPath = computed(() => `/o/${orgSlug.value}/orders`)

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
  pending: menuPending,
  loadForOrgSlug
} = useOrderMenu()

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
    <div v-if="isLoading" class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
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
        <OrgTransactionInfoCard :org="org" :full-address="fullAddress" />
        <OrgStartOrderCard :order-to="orderPath" />
        <OrgMenuPreviewSection
          :products="products"
          :loading="menuPending"
          :order-to="orderPath"
        />
      </div>
    </template>
  </div>
</template>
