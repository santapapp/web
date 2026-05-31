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
  hasOrderHistory,
  isLoading,
  isNotFound
} = usePublicOrg(orgSlug)

const {
  products,
  pending: menuPending,
  loadForOrgSlug
} = useOrderMenu()

const loadedMenuSlug = ref('')

// Disediakan oleh layout `org` — buka drawer "Pesanan Saya" untuk melihat riwayat.
const openOrdersDrawer = inject<() => void>('openOrdersDrawer', () => {})

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

useSeoMeta({
  title: () => org.value ? `${org.value.name} | Santap` : 'Outlet | Santap',
  description: () =>
    org.value
      ? `Lihat informasi outlet dan preview menu ${org.value.name}. Mulai pesanan dari halaman order Santap.`
      : 'Lihat informasi outlet dan preview menu di Santap.'
})
</script>

<template>
  <div class="min-h-dvh bg-gray-50">
    <div v-if="isLoading" class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <USkeleton class="h-64 w-full rounded-lg" />
      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        <USkeleton v-for="n in 3" :key="n" class="h-28 rounded-lg" />
      </div>
      <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <USkeleton v-for="n in 6" :key="n" class="h-44 rounded-lg" />
      </div>
    </div>

    <section v-else-if="isNotFound || !org" class="flex min-h-[calc(100dvh-64px)] items-center justify-center px-4 py-12">
      <div class="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center">
        <UIcon name="i-lucide-store" class="mx-auto size-10 text-gray-300" />
        <h1 class="mt-4 text-xl font-bold text-gray-950">Outlet tidak ditemukan</h1>
        <p class="mt-2 text-sm leading-6 text-gray-500">
          Link outlet tidak valid atau outlet sedang tidak tersedia.
        </p>
        <UButton
          to="/"
          color="primary"
          variant="solid"
          icon="i-lucide-home"
          label="Kembali"
          class="mt-5"
        />
      </div>
    </section>

    <template v-else>
      <OrgHeroSection
        :org="org"
        :opening-status="openingStatus"
        :full-address="fullAddress"
      />

      <div class="space-y-5 pb-10">
        <OrgTransactionInfoCard :org="org" :full-address="fullAddress" />
        <OrgStartOrderCard
          :order-to="orderPath"
          :has-order-history="hasOrderHistory"
          @open-history="openOrdersDrawer"
        />
        <OrgMenuPreviewSection
          :products="products"
          :loading="menuPending"
          :order-to="orderPath"
        />
      </div>
    </template>
  </div>
</template>
