<script setup lang="ts">
definePageMeta({
  middleware: ['org-exists', 'validate-order-query']
})

const route = useRoute()
const { org, items, fetchPublicOrg } = usePublicOrg()
const { state, mode, tableToken, orderToken, billToken } = useOrderMode()
const { ensureGuestSession, id: guestSessionId } = useGuestSession()
const tableCart = useCart('table_order')
const billCart = useCart('open_bill')
const sessionStatus = ref('Belum dibuat')

await fetchPublicOrg()

const activeCart = computed(() => (mode.value === 'open_bill' ? billCart : tableCart))
const firstAvailableItem = computed(() => items.value.find((item) => item.is_available))

const addMockItem = () => {
  if (!firstAvailableItem.value) return

  activeCart.value.addItem({
    menuId: firstAvailableItem.value.id,
    name: firstAvailableItem.value.name,
    price: firstAvailableItem.value.price
  })
}

onMounted(async () => {
  if (!org.value || mode.value === 'empty' || mode.value === 'order_detail' || mode.value === 'invalid') return

  const sessionId = await ensureGuestSession(org.value.slug, {
    tableToken: tableToken.value,
    billToken: billToken.value
  })

  sessionStatus.value = sessionId ?? 'Tidak tersedia'
})
</script>

<template>
  <section class="page-section">
    <div class="container stack">
      <p class="eyebrow">Orders</p>
      <h1>{{ org?.name ?? route.params.orgSlug }}</h1>

      <SharedStateBlock
        v-if="state.mode === 'empty'"
        label="Empty"
        title="Scan QR untuk mulai order"
        description="Halaman orders tanpa query belum memiliki konteks meja, order, atau open bill."
      >
        <div class="button-row">
          <NuxtLink class="btn-primary" :to="`/o/${route.params.orgSlug}/orders?table=TBL_8KJ2QX`">
            Coba table token
          </NuxtLink>
          <NuxtLink class="btn-outline" :to="`/o/${route.params.orgSlug}/orders?bill=BILL_7JA92K`">
            Coba bill token
          </NuxtLink>
        </div>
      </SharedStateBlock>

      <div v-else-if="mode === 'table_order'" class="grid-cards">
        <SharedStateBlock
          label="table_order"
          title="Mode order meja"
          :description="`Token meja: ${tableToken}`"
        >
          <p>Guest session: {{ guestSessionId ?? sessionStatus }}</p>
        </SharedStateBlock>

        <section class="content-card stack">
          <span class="badge">Cart meja</span>
          <h2>{{ tableCart.totalQuantity.value }} item</h2>
          <p>Total sementara: Rp{{ tableCart.totalPrice.value.toLocaleString('id-ID') }}</p>
          <button class="btn-primary" type="button" @click="addMockItem">
            Tambah menu mock
          </button>
        </section>
      </div>

      <SharedStateBlock
        v-else-if="mode === 'order_detail'"
        label="order_detail"
        title="Mode detail order"
        :description="`Token order: ${orderToken}`"
      >
        <p>Integrasi detail order sudah tersedia di `useApi`, implementasi UI penuh masuk Phase 5.</p>
      </SharedStateBlock>

      <div v-else-if="mode === 'open_bill'" class="grid-cards">
        <SharedStateBlock
          label="open_bill"
          title="Mode open bill"
          :description="`Token bill: ${billToken}`"
        >
          <p>Guest session: {{ guestSessionId ?? sessionStatus }}</p>
        </SharedStateBlock>

        <section class="content-card stack">
          <span class="badge">Cart open bill</span>
          <h2>{{ billCart.totalQuantity.value }} item</h2>
          <p>Total sementara: Rp{{ billCart.totalPrice.value.toLocaleString('id-ID') }}</p>
          <button class="btn-primary" type="button" @click="addMockItem">
            Tambah menu mock
          </button>
        </section>
      </div>
    </div>
  </section>
</template>

