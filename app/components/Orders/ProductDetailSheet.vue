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
 */

import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import type { MenuProduct, MenuVariantGroup } from '~/types/customer-menu'
import type { SelectedVariant } from '~/stores/cart.store'

const props = defineProps<{
  product: MenuProduct | null
  open: boolean
  ctaDisabled?: boolean
  readOnly?: boolean
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

// Client-only body scroll lock
watch(
  () => props.open,
  (isOpen) => {
    if (import.meta.client) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (target) {
    target.blur()
  }
}

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

const isUnavailable = computed(() => Boolean(props.product && !props.product.is_available))

const statusLabel = computed(() => isUnavailable.value ? 'Habis' : 'Tersedia')
const statusColor = computed<'error' | 'success'>(() => isUnavailable.value ? 'error' : 'success')

const missingRequiredMessage = computed(() => {
  if (!props.product) return null

  for (const group of props.product.variant_groups) {
    const selected = selections.value[group.id]
    const count = selected?.size ?? 0
    const minSelect = group.min_select || 1

    if (group.is_required && count < minSelect) {
      return `Pilih minimal ${minSelect} dari "${group.name}".`
    }
  }

  return null
})

const isSelectionComplete = computed(() => !missingRequiredMessage.value)

const disabledReason = computed(() => {
  if (isUnavailable.value) return 'Menu ini sedang tidak tersedia.'
  return missingRequiredMessage.value
})

const disabledReasonColor = computed<'error' | 'warning'>(() =>
  isUnavailable.value ? 'error' : 'warning'
)

const addDisabled = computed(() =>
  Boolean(props.ctaDisabled || isUnavailable.value || !isSelectionComplete.value)
)

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

  if (isUnavailable.value) {
    validationError.value = 'Menu ini sedang tidak tersedia.'
    return false
  }

  if (missingRequiredMessage.value) {
    validationError.value = missingRequiredMessage.value
    return false
  }

  return true
}

// ─── Submit ───────────────────────────────────────────────────────────────────

const handleAddToCart = () => {
  if (!props.product || props.ctaDisabled || !validate()) return

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
  <Teleport to="body">
    <Transition name="slide-up">
      <section
        v-if="open && product"
        class="fixed inset-0 z-[60] flex h-[100dvh] w-full items-end justify-center overflow-hidden bg-black/35 backdrop-blur-xs sm:items-center customer-ordering-layout"
        @click.self="emit('close')"
      >
        <div class="relative flex h-[92dvh] max-h-[860px] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-gray-50 shadow-2xl outline-none sm:h-[88dvh] sm:rounded-[28px] md:max-w-xl">
          <!-- Header (flex-none) -->
          <header class="flex-none bg-white border-b border-gray-100 flex items-center justify-center gap-2 px-4 py-3">
            <!-- Title & Subtitle -->
            <div class="flex flex-col items-center text-center min-w-0">
              <div class="text-sm font-bold text-gray-900 leading-none truncate max-w-[220px]">
                {{ product.name }}
              </div>
              <span class="text-xs text-orange-600 font-semibold mt-1">
                {{ formatPrice(product.price) }}
              </span>
            </div>
          </header>

          <!-- Content (flex-1 overflow-y-auto) -->
          <main class="min-h-0 flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <!-- Product Image (centered) -->
              <div class="flex justify-center">
                <div class="size-40 sm:size-44 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 bg-gray-50 shrink-0">
                  <img
                    v-if="product.image"
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-gray-50 to-gray-100"
                  >
                    <UIcon name="i-lucide-utensils" class="size-10 text-gray-300" />
                  </div>
                </div>
              </div>

              <!-- Product Details -->
              <div class="text-center">
                <div class="mb-3 flex flex-wrap items-center justify-center gap-2">
                  <UBadge
                    v-if="product.category_name"
                    :label="product.category_name"
                    color="neutral"
                    variant="soft"
                    size="sm"
                    class="rounded-full font-bold"
                  />
                  <UBadge
                    :label="statusLabel"
                    :color="statusColor"
                    variant="soft"
                    size="sm"
                    class="rounded-full font-bold"
                  />
                </div>
                <div class="text-base font-bold text-gray-900 leading-snug">
                  {{ product.name }}
                </div>
                <p class="text-base font-bold text-orange-600 mt-1">
                  {{ formatPrice(product.price) }}
                </p>
                <p
                  v-if="product.description"
                  class="text-sm text-gray-500 font-normal leading-relaxed mt-2 max-w-sm mx-auto"
                >
                  {{ product.description }}
                </p>
              </div>

              <!-- Option groups -->
              <div v-if="product.variant_groups.length" class="mt-3 divide-y divide-gray-100">
                <OrdersOptionGroup
                  v-for="group in product.variant_groups"
                  :key="group.id"
                  :group="group"
                  :selected-ids="selectedIdsFor(group.id)"
                  @toggle="(variantId) => toggleVariant(group, variantId)"
                />
              </div>

              <!-- Note per item -->
              <div v-if="!readOnly" class="border-t border-gray-100 pt-5 mt-5">
                <label
                  class="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 px-1"
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
                  color="neutral"
                  variant="outline"
                  :ui="{
                    base: 'rounded-2xl border border-orange-200 bg-white ring-0 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 placeholder:text-slate-400 transition-all duration-200 px-4 py-3 text-sm min-h-[72px] shadow-xs resize-none'
                  }"
                />
              </div>
          </main>

          <!-- Footer (flex-none) -->
          <footer class="flex-none bg-white border-t border-gray-100 px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))] space-y-4">
            <template v-if="!readOnly">
              <!-- Validation error banner -->
              <div
                v-if="validationError || disabledReason"
                class="flex items-start gap-2.5 px-4 py-3 rounded-2xl border text-sm transition-all duration-200"
                :class="[
                  isUnavailable
                    ? 'bg-red-50/70 border-red-100 text-red-800'
                    : 'bg-amber-50/70 border-amber-100 text-amber-800'
                ]"
              >
                <UIcon
                  :name="isUnavailable ? 'i-lucide-alert-octagon' : 'i-lucide-info'"
                  class="size-5 shrink-0 mt-0.5"
                  :class="isUnavailable ? 'text-red-500' : 'text-amber-600'"
                />
                <span class="flex-1 font-semibold leading-relaxed">
                  {{ validationError || disabledReason }}
                </span>
              </div>

              <!-- Quantity -->
              <OrdersQuantityControl v-model="quantity" :min="1" />

              <!-- Add to cart CTA -->
              <OrdersStickyCartButton
                label="Tambah ke Keranjang"
                :total="previewTotal"
                :disabled="addDisabled"
                @click="handleAddToCart"
              />
            </template>
            <template v-else>
              <!-- Close CTA -->
              <UButton
                id="btn-close-product-detail"
                block
                color="neutral"
                variant="outline"
                label="Tutup"
                size="lg"
                :ui="{
                  base: 'rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold transition-all duration-200 cursor-pointer justify-center h-12 shadow-xs ring-0 focus:ring-2 focus:ring-slate-100'
                }"
                @click="emit('close')"
              />
            </template>
          </footer>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-up-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-leave-active {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
