<script setup lang="ts">
/**
 * ProductDetailSheet — Bottom sheet / slideover untuk detail product & pilih variant.
 *
 * Alur:
 * 1. Tampilkan info product (image, nama, harga dasar, deskripsi)
 * 2. Untuk setiap variant_group, tampilkan pilihan:
 *    - max_select = 1 → radio (URadioGroup)
 *    - max_select > 1 → checkbox (UCheckbox)
 * 3. Validasi is_required + min_select sebelum submit
 * 4. Emit 'add-to-cart' dengan payload mentah (product, qty, note, selected_variants)
 *    — Cart store yang bertanggung jawab membuat CartItem dan cart key
 *
 * Tidak menyimpan CartItem final — hanya emit pilihan user.
 */

import type { MenuProduct, MenuVariantGroup, MenuVariant } from '~/types/customer-menu'
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

const isSelected = (groupId: number, variantId: number): boolean =>
  selections.value[groupId]?.has(variantId) ?? false

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
      <div v-if="product" class="bg-white rounded-t-2xl flex flex-col w-full h-full max-h-[92dvh] outline-none">
        
        <!-- Handle (mobile) -->
        <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div class="w-10 h-1.5 rounded-full bg-gray-200" />
        </div>

        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto">

          <!-- Image -->
          <div class="relative aspect-video bg-gray-100">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-5xl">
              🍽️
            </div>
          </div>

          <!-- Info -->
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 mb-1">{{ product.name }}</h2>
            <p v-if="product.description" class="text-sm text-gray-500 leading-relaxed mb-2">
              {{ product.description }}
            </p>
            <p class="text-lg font-bold text-primary">{{ formatPrice(product.price) }}</p>
          </div>

          <!-- Variant Groups -->
          <div
            v-for="group in product.variant_groups"
            :key="group.id"
            class="px-5 py-4 border-b border-gray-100"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-gray-900">{{ group.name }}</span>
              <div class="flex gap-1.5">
                <UBadge
                  v-if="group.is_required"
                  label="Wajib"
                  color="error"
                  variant="soft"
                  size="sm"
                />
                <UBadge
                  v-if="group.max_select > 1"
                  :label="`Max ${group.max_select}`"
                  color="neutral"
                  variant="soft"
                  size="sm"
                />
              </div>
            </div>

            <!-- Variants -->
            <div class="space-y-2">
              <button
                v-for="variant in group.variants"
                :key="variant.id"
                type="button"
                class="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-150 text-left"
                :class="[
                  isSelected(group.id, variant.id)
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-gray-200 bg-white hover:border-gray-300',
                  !variant.is_available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                ]"
                :disabled="!variant.is_available"
                @click="toggleVariant(group, variant.id)"
              >
                <div class="flex items-center gap-3">
                  <!-- Radio / Checkbox indicator -->
                  <span
                    class="size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                    :class="[
                      group.max_select === 1 ? 'rounded-full' : 'rounded-md',
                      isSelected(group.id, variant.id)
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    ]"
                  >
                    <UIcon
                      v-if="isSelected(group.id, variant.id)"
                      :name="group.max_select === 1 ? 'i-lucide-circle' : 'i-lucide-check'"
                      class="size-3 text-white"
                    />
                  </span>
                  <span class="text-sm font-medium text-gray-800">{{ variant.name }}</span>
                </div>
                <span v-if="variant.price > 0" class="text-sm font-semibold text-primary">
                  +{{ formatPrice(variant.price) }}
                </span>
              </button>
            </div>
          </div>

          <!-- Note per item -->
          <div class="px-5 py-4 border-b border-gray-100">
            <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2" for="product-note">
              Catatan (opsional)
            </label>
            <UTextarea
              id="product-note"
              v-model="note"
              placeholder="Contoh: Tidak pedas, tanpa bawang"
              :rows="2"
              :maxlength="150"
              resize
            />
          </div>

        </div>

        <!-- Sticky Footer -->
        <div class="flex-shrink-0 border-t border-gray-100 bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">

          <!-- Validation error -->
          <UAlert
            v-if="validationError"
            icon="i-lucide-alert-circle"
            color="error"
            variant="soft"
            :description="validationError"
            class="mb-3"
          />

          <div class="flex items-center gap-3">
            <!-- Qty stepper -->
            <div class="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
              <UButton
                icon="i-lucide-minus"
                size="xs"
                color="neutral"
                variant="ghost"
                :disabled="quantity <= 1"
                aria-label="Kurangi"
                @click="quantity = Math.max(1, quantity - 1)"
              />
              <span class="text-sm font-bold text-gray-900 w-6 text-center tabular-nums">
                {{ quantity }}
              </span>
              <UButton
                icon="i-lucide-plus"
                size="xs"
                color="neutral"
                variant="ghost"
                aria-label="Tambah"
                @click="quantity++"
              />
            </div>

            <!-- Add to cart CTA -->
            <UButton
              block
              size="lg"
              color="primary"
              :label="`Tambah — ${formatPrice(previewTotal)}`"
              icon="i-lucide-shopping-bag"
              class="flex-1"
              @click="handleAddToCart"
            />
          </div>
        </div>

      </div>
    </template>
  </UDrawer>
</template>
