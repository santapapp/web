<script setup lang="ts">
/**
 * OrderItemsCard.vue
 * Daftar lengkap item dalam satu pesanan ("Detail Pesanan").
 *
 * Menormalisasi struktur item dari backend agar variant/addon selalu tampil
 * sebagai children di bawah produk induk — mendukung 2 bentuk response:
 *   1) Nested: item.children sudah terisi (OrderItemResource default).
 *   2) Flat: children terpisah di array items dengan parent_item_id.
 *
 * Tidak menghitung ulang harga — semua nilai dari field existing.
 */

import type { CustomerOrderDetail, CustomerOrderItem } from '~/types/customer-order'

const props = defineProps<{
  order: CustomerOrderDetail
}>()

/**
 * Normalisasi: kembalikan daftar item induk (produk) dengan children terisi.
 * - Jika sudah nested → pakai apa adanya.
 * - Jika flat → kelompokkan child ke induknya via parent_item_id.
 */
const parentItems = computed<CustomerOrderItem[]>(() => {
  const all = props.order.items ?? []
  const parents = all.filter((i) => !i.parent_item_id)

  // Sudah punya children nested di salah satu parent → anggap nested.
  const hasNested = parents.some((p) => (p.children?.length ?? 0) > 0)
  if (hasNested) return parents

  // Flat: bangun children dari parent_item_id.
  const childrenByParent = new Map<string, CustomerOrderItem[]>()
  for (const item of all) {
    if (item.parent_item_id == null) continue
    const key = String(item.parent_item_id)
    const list = childrenByParent.get(key) ?? []
    list.push(item)
    childrenByParent.set(key, list)
  }

  if (childrenByParent.size === 0) return parents

  return parents.map((p) => ({
    ...p,
    children: childrenByParent.get(String(p.id)) ?? p.children ?? []
  }))
})

const totalItems = computed(() =>
  parentItems.value.reduce((sum, i) => sum + (i.quantity || 0), 0)
)

const orderCancelled = computed(() =>
  props.order.order_status === 'cancelled' ||
  props.order.payment_status === 'cancelled' ||
  props.order.payment_status === 'failed'
)
</script>

<template>
  <div class="bg-white rounded-xl shadow-xs border border-stone-200/60 p-3">
    <div class="flex items-center justify-between gap-2 mb-1">
      <div class="text-xs font-extrabold uppercase tracking-wide text-stone-800">
        Detail Pesanan
      </div>
      <span v-if="totalItems > 0" class="text-xs font-bold text-stone-400">
        {{ totalItems }} item
      </span>
    </div>

    <div v-if="parentItems.length" class="divide-y divide-stone-100">
      <OrdersOrderItemDetail
        v-for="item in parentItems"
        :key="item.id"
        :item="item"
        :order-cancelled="orderCancelled"
      />
    </div>

    <p v-else class="text-sm text-stone-400 py-3">
      Detail item belum tersedia.
    </p>
  </div>
</template>
