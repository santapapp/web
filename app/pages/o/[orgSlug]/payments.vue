<script setup lang="ts">
definePageMeta({
  middleware: ['org-exists']
})

const route = useRoute()
const { org, fetchPublicOrg } = usePublicOrg()

await fetchPublicOrg()

const orderToken = computed(() => {
  const value = route.query.order
  return Array.isArray(value) ? value[0] : value
})
</script>

<template>
  <section class="page-section">
    <div class="container stack">
      <p class="eyebrow">Payments</p>
      <h1>{{ org?.name ?? route.params.orgSlug }}</h1>

      <SharedStateBlock
        v-if="!orderToken"
        label="Payment"
        title="Order token belum tersedia"
        description="Halaman payment membutuhkan query order=ORD_xxx."
      />

      <SharedStateBlock
        v-else
        label="pending"
        title="Payment route siap"
        :description="`Token order: ${orderToken}`"
      >
        <p>API payment mock sudah tersedia melalui `useApi().getPaymentDetail()` dan `useApi().payOrder()`.</p>
      </SharedStateBlock>
    </div>
  </section>
</template>

