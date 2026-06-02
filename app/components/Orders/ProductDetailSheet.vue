<script setup lang="ts">
/**
 * ProductDetailSheet — Bottom sheet / slideover untuk detail product & pilih variant.
 *
 * Alur (LOGIC TIDAK BERUBAH):
 * 1. Tampilkan info product (image, nama, harga dasar, deskripsi)
 * 2. Untuk setiap variant_group, tampilkan pilihan via OrdersOptionGroup:
 *    - max_select = 1 → radio (single select)
 *    - max_select > 1 → checkbox (multi select)
 * 3. Validasi is_required + min_select sebelum submit
 * 4. Emit 'add-to-cart' dengan payload mentah (product, qty, note, selected_variants)
 *    — Cart store yang bertanggung jawab membuat CartItem dan cart key
 *
 * Tidak menyimpan CartItem final — hanya emit pilihan user.
 * Slicing UI mengikuti referensi: card putih, image+nama+harga di tengah,
 * section per grup dengan divider, quantity control, sticky CTA orange.
 */

import type { MenuProduct, MenuVariantGroup } from '~/types/customer-menu'
import type { SelectedVariant } from '~/stores/cart.store'

const props = defineProps<{
  product: MenuProduct | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  'add-to-cart': [{
    product: MenuProduct
    quantity: number
    note: string
    selected_variants: SelectedVariant[]
  }]
}>()

// ─── State ────────────────────────────────────────────────────────────────────

/**
 * Selections: { [variantGroupId]: Set<variantId> }
 * Set kosong = belum pilih untuk group tersebut.
 */
const selections = ref<Record<number, Set<number>>>({})
const quantity = ref(1)
const note = ref('')
const validationError = ref<string | null>(null)

// Reset state setiap kali product berubah
watch(() => props.product, (p) => {
  if (!p) return
  const init: Record<number, Set<number>> = {}
  for (const group of p.variant_groups) {
    init[group.id] = new Set()
  }
  selections.value = init
  quantity.value = 1
  note.value = ''
  validationError.value = null
}, { immediate: true })

// ─── Computed ─────────────────────────────────────────────────────────────────

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)

/** Preview total = (base_price + sum variant prices) * qty */
const previewTotal = computed(() => {
  if (!props.product) return 0
  let variantSum = 0
  for (const group of props.product.variant_groups) {
    const selected = selections.value[group.id]
    if (!selected) continue
    for (const variantId of selected) {
      const variant = group.variants.find((v) => v.id === variantId)
      if (variant) variantSum += variant.price
    }
  }
  return (props.product.price + variantSum) * quantity.value
})

// ─── Selection Helpers ────────────────────────────────────────────────────────

/** Array variant_id terpilih untuk satu group (untuk prop OrdersOptionGroup) */
const selectedIdsFor = (groupId: number): number[] =>
  Array.from(selections.value[groupId] ?? [])

const toggleVariant = (group: MenuVariantGroup, variantId: number) => {
  const set = selections.value[group.id] ?? new Set<number>()

  if (group.max_select === 1) {
    // Radio behaviour: replace
    const next = new Set<number>()
    if (!set.has(variantId)) next.add(variantId)
    selections.value[group.id] = next
  } else {
    // Checkbox behaviour
    const next = new Set(set)
    if (next.has(variantId)) {
      next.delete(variantId)
    } else if (next.size < group.max_select) {
      next.add(variantId)
    }
    selections.value[group.id] = next
  }
  validationError.value = null
}

// ─── Validation ───────────────────────────────────────────────────────────────

const validate = (): boolean => {
  if (!props.product) return false

  for (const group of props.product.variant_groups) {
    const selected = selections.value[group.id]
    const count = selected?.size ?? 0

    if (group.is_required && count < (group.min_select || 1)) {
      validationError.value = `Pilih minimal ${group.min_select || 1} dari "${group.name}".`
      return false
    }
  }
  return true
}

// ─── Submit ───────────────────────────────────────────────────────────────────

const handleAddToCart = () => {
  if (!props.product || !validate()) return

  const selected_variants: SelectedVariant[] = []

  for (const group of props.product.variant_groups) {
    const selectedIds = selections.value[group.id] ?? new Set()
    for (const variantId of selectedIds) {
      const variant = group.variants.find((v) => v.id === variantId)
      if (variant) {
        selected_variants.push({
          variant_group_id: group.id,
          variant_group_name: group.name,
          variant_id: variant.id,
          variant_name: variant.name,
          price: variant.price
        })
      }
    }
  }

  emit('add-to-cart', {
    product: props.product,
    quantity: quantity.value,
    note: note.value.trim(),
    selected_variants
  })
  emit('close')
}
</script>

<template>
  <UDrawer
    :open="open && !!product"
    direction="bottom"
    :handle="false"
    @update:open="(v) => !v && emit('close')"
  >
    <template #content>
      <div
        v-if="product"
        class="bg-stone-100 rounded-t-3xl flex flex-col w-full h-full max-h-[94dvh] outline-none"
      >
        <!-- Drag handle (mobile) -->
        <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div class="w-10 h-1.5 rounded-full bg-stone-300" />
        </div>

        <!-- Header: back / title / spacer -->
        <header class="flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2">
          <button
            type="button"
            class="size-10 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90 transition-all duration-150 cursor-pointer"
            aria-label="Kembali"
            @click="emit('close')"
          >
            <UIcon name="i-lucide-arrow-left" class="size-5" />
          </button>

          <h2 class="text-base font-bold text-stone-900 truncate">Pesanan saat ini</h2>

          <!-- Spacer untuk menjaga title tetap center (slot opsi bisa ditambah bila ada kebutuhan) -->
          <span class="size-10 flex-shrink-0" aria-hidden="true" />
        </header>

        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto px-4 pb-4">
          <!-- White product card -->
          <div class="bg-white rounded-3xl shadow-sm border border-stone-200/70 px-5 pt-6 pb-2">
            <!-- Product image (centered) -->
            <div class="flex justify-center">
              <div class="size-40 sm:size-44 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  v-if="product.image"
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-contain"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100"
                >
                  <UIcon name="i-lucide-utensils" class="size-10 text-amber-900/20" />
                </div>
              </div>
            </div>

            <!-- Name + price (centered) -->
            <div class="text-center mt-3 mb-1">
              <h1 class="text-lg font-extrabold uppercase tracking-wide text-stone-900">
                {{ product.name }}
              </h1>
              <p class="text-base font-bold text-amber-600 mt-1">
                {{ formatPrice(product.price) }}
              </p>
              <p
                v-if="product.description"
                class="text-sm text-stone-500 leading-relaxed mt-2 max-w-sm mx-auto"
              >
                {{ product.description }}
              </p>
            </div>

            <!-- Option groups: divider antar section -->
            <div v-if="product.variant_groups.length" class="mt-2 divide-y divide-stone-100">
              <OrdersOptionGroup
                v-for="group in product.variant_groups"
                :key="group.id"
                :group="group"
                :selected-ids="selectedIdsFor(group.id)"
                @toggle="(variantId) => toggleVariant(group, variantId)"
              />
            </div>

            <!-- Note per item -->
            <div class="border-t border-stone-100 py-4">
              <label
                class="block text-xs font-extrabold uppercase tracking-wide text-stone-800 mb-2 px-1"
                for="product-note"
              >
                Catatan (opsional)
              </label>
              <UTextarea
                id="product-note"
                v-model="note"
                placeholder="Contoh: Tidak pedas, tanpa bawang"
                :rows="2"
                :maxlength="150"
                class="w-full"
                resize
              />
            </div>
          </div>
        </div>

        <!-- Sticky Footer: quantity + CTA -->
        <div
          class="flex-shrink-0 border-t border-stone-200 bg-stone-100/95 backdrop-blur px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] space-y-3"
        >
          <!-- Validation error -->
          <UAlert
            v-if="validationError"
            icon="i-lucide-alert-circle"
            color="error"
            variant="soft"
            :description="validationError"
            class="rounded-xl"
          />

          <!-- Quantity -->
          <OrdersQuantityControl v-model="quantity" :min="1" />

          <!-- Add to cart CTA -->
          <OrdersStickyCartButton
            label="Tambah ke Keranjang"
            :total="previewTotal"
            @click="handleAddToCart"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>
