<script setup lang="ts">
definePageMeta({
  middleware: ['org-exists']
})

const { org, categories, items, pending, error, fetchPublicOrg } = usePublicOrg()

await fetchPublicOrg()

const availableItems = computed(() => items.value.filter((item) => item.is_available))

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
</script>

<template>
  <section class="page-section">
    <div class="container stack">
      <div v-if="pending" class="content-card stack">
        <span class="badge">Loading</span>
        <h1>Memuat restoran</h1>
        <p>Data mock sedang disiapkan.</p>
      </div>

      <SharedStateBlock
        v-else-if="error"
        label="Error"
        title="Restoran tidak ditemukan"
        :description="error.message"
      />

      <template v-else-if="org">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Restoran publik</p>
            <h1>{{ org.name }}</h1>
            <p>{{ org.description }}</p>

            <div class="button-row">
              <NuxtLink class="btn-primary" :to="`/o/${org.slug}/orders?table=TBL_8KJ2QX`">
                Demo QR meja
              </NuxtLink>
              <NuxtLink class="btn-outline" :to="`/o/${org.slug}/orders?bill=BILL_7JA92K`">
                Demo open bill
              </NuxtLink>
            </div>
          </div>

          <aside class="content-card stack">
            <span class="badge">{{ org.open_status }}</span>
            <h3>{{ org.address }}</h3>
            <p class="muted">Timezone: {{ org.timezone }}</p>
          </aside>
        </div>

        <section class="stack">
          <div class="stack">
            <p class="eyebrow">Menu publik</p>
            <h2>{{ availableItems.length }} menu tersedia</h2>
          </div>

          <div class="grid-cards">
            <article v-for="category in categories" :key="category.id" class="content-card stack">
              <span class="badge">{{ category.name }}</span>
              <div
                v-for="item in availableItems.filter((menuItem) => menuItem.category_id === category.id)"
                :key="item.id"
                class="menu-row"
              >
                <div>
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.description }}</p>
                </div>
                <strong>{{ formatCurrency(item.price) }}</strong>
              </div>
            </article>
          </div>
        </section>
      </template>
    </div>
  </section>
</template>

<style scoped>
.menu-row {
  border-top: 1px solid var(--color-gray-100);
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr auto;
  padding-top: 16px;
}

.menu-row strong {
  color: var(--color-orange);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .menu-row {
    grid-template-columns: 1fr;
  }
}
</style>

