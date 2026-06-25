<script setup lang="ts">
/**
 * OptionGroup.vue
 * Menampilkan satu variant_group (variant / addon / topping) dalam detail item.
 *
 * - Hanya presentational: tidak menyimpan state, tidak validasi.
 * - max_select === 1 → kontrol radio (single select).
 * - max_select  >  1 → kontrol checkbox (multi select).
 * - Selection state & toggle logic tetap dipegang parent (ProductDetailSheet).
 */

import type { MenuVariantGroup } from '~/types/customer-menu'

const props = defineProps<{
  group: MenuVariantGroup
  /** Daftar variant_id yang sedang terpilih untuk group ini */
  selectedIds: number[]
}>()

const emit = defineEmits<{
  toggle: [variantId: number]
}>()

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)

const isRadio = computed(() => props.group.max_select === 1)

const isSelected = (variantId: number) => props.selectedIds.includes(variantId)
</script>

<template>
  <section class="py-4">
    <!-- Group header -->
    <div class="flex items-center justify-between gap-2 mb-2.5 px-1">
      <div class="text-xs font-extrabold uppercase tracking-wide text-gray-700">
        {{ group.name }}
        <span v-if="group.is_required" class="text-orange-500 align-super text-sm">*</span>
      </div>

      <div class="flex shrink-0 items-center gap-1.5">
        <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
          {{ group.type === 'addon_group' ? 'Add-on' : 'Variant' }}
        </span>
        <span
          class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          :class="group.is_required ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'"
        >
          {{ group.is_required ? 'Wajib' : 'Opsional' }}
        </span>
        <span
          v-if="group.max_select > 1"
          class="text-[10px] font-bold uppercase tracking-wide text-gray-400"
        >
          Maks {{ group.max_select }}
        </span>
      </div>
    </div>

    <!-- Options -->
    <ul class="space-y-2">
      <li v-for="variant in group.variants" :key="variant.id">
        <button
          type="button"
          class="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left border transition-all duration-150"
          :class="[
            variant.is_available
              ? (isSelected(variant.id)
                  ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold shadow-xs'
                  : 'border-stone-200 bg-white text-stone-700 font-medium hover:bg-stone-50')
              : 'opacity-40 cursor-not-allowed border-stone-100 bg-stone-50'
          ]"
          :disabled="!variant.is_available"
          @click="variant.is_available && emit('toggle', variant.id)"
        >
          <!-- Left: name -->
          <span class="text-sm truncate">
            {{ variant.name }}
          </span>

          <!-- Right: price -->
          <div class="flex items-center gap-2 shrink-0">
            <span
              v-if="variant.price > 0"
              class="text-xs font-bold"
              :class="isSelected(variant.id) ? 'text-orange-600' : 'text-stone-500'"
            >
              + {{ formatPrice(variant.price) }}
            </span>
            <UIcon
              v-if="isSelected(variant.id)"
              name="i-lucide-check"
              class="size-4 text-orange-600"
            />
          </div>
        </button>
      </li>
    </ul>
  </section>
</template>
