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
      <h3 class="text-xs font-extrabold uppercase tracking-wide text-stone-800">
        {{ group.name }}
        <span v-if="group.is_required" class="text-amber-600 align-super text-sm">*</span>
      </h3>

      <span
        v-if="group.max_select > 1"
        class="text-[10px] font-bold uppercase tracking-wide text-stone-400"
      >
        Maks {{ group.max_select }}
      </span>
    </div>

    <!-- Options -->
    <ul class="space-y-0.5">
      <li v-for="variant in group.variants" :key="variant.id">
        <button
          type="button"
          class="w-full flex items-center justify-between gap-3 px-1 py-2 rounded-lg text-left transition-colors duration-150"
          :class="[
            variant.is_available
              ? 'hover:bg-amber-50/60 cursor-pointer'
              : 'opacity-40 cursor-not-allowed'
          ]"
          :disabled="!variant.is_available"
          @click="variant.is_available && emit('toggle', variant.id)"
        >
          <!-- Left: bullet + name + extra price -->
          <span class="flex items-baseline gap-2 min-w-0">
            <span
              class="text-stone-300 leading-none"
              :class="isSelected(variant.id) ? 'text-amber-500' : ''"
            >•</span>
            <span
              class="text-sm truncate"
              :class="isSelected(variant.id) ? 'font-semibold text-stone-900' : 'font-medium text-stone-600'"
            >
              {{ variant.name }}
            </span>
            <span
              v-if="variant.price > 0"
              class="text-xs font-bold text-amber-700 whitespace-nowrap"
            >
              + {{ formatPrice(variant.price) }}
            </span>
          </span>

          <!-- Right: circular radio / checkbox indicator -->
          <span
            class="flex-shrink-0 size-5 flex items-center justify-center border-2 transition-all duration-150"
            :class="[
              isRadio ? 'rounded-full' : 'rounded-md',
              isSelected(variant.id)
                ? 'border-amber-600'
                : 'border-stone-300'
            ]"
          >
            <span
              v-if="isSelected(variant.id)"
              class="bg-amber-600"
              :class="isRadio ? 'size-2.5 rounded-full' : 'size-3 rounded-sm'"
            />
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>
