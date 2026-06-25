<script setup lang="ts">
/**
 * OrgHeroSection.vue
 * Hero banner section showing restaurant branding, opening status, and contact info.
 */

import { computed } from 'vue'
import type { OpeningStatus, PublicOrg } from '~/types/org'

const props = defineProps<{
  org: PublicOrg
  openingStatus: OpeningStatus | null
  fullAddress?: string
}>()

const initials = computed(() =>
  props.org.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || 'S'
)

const statusColor = computed(() => {
  if (!props.openingStatus) return 'neutral'
  return props.openingStatus.open ? 'success' : 'error'
})
</script>

<template>
  <section class="relative overflow-hidden bg-white border-b border-stone-100">
    <!-- Banner Container with Warm Fallback Gradient -->
    <div class="relative h-32 sm:h-64 lg:h-72 overflow-hidden group">
      <img
        v-if="org.banner"
        :src="org.banner"
        :alt="`${org.name} banner`"
        class="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
      >
      <div 
        v-else 
        class="h-full w-full bg-gradient-to-br from-stone-200 via-amber-100 to-stone-300 transition-transform duration-1000 ease-out group-hover:scale-105" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </div>

    <!-- Info Section Container -->
    <div class="mx-auto max-w-5xl px-5 pb-6 sm:px-6 lg:px-8 animate-fade-in-up">
      <div class="-mt-7 flex flex-col gap-3 sm:-mt-14 sm:flex-row sm:items-end relative z-10 w-full">
        <!-- Avatar/Logo with high-end delicate shadow & warm border ring -->
        <UAvatar
          :src="org.logo || undefined"
          :text="org.logo ? undefined : initials"
          :alt="org.name"
          size="3xl"
          class="size-14 sm:size-28 rounded-xl sm:rounded-2xl bg-white shadow-xl ring-4 ring-amber-50/80 border border-amber-200/50 transition-transform duration-300 hover:scale-105 shrink-0"
          :ui="{ fallback: 'text-lg sm:text-2xl font-bold text-amber-800' }"
        />

        <!-- Title & Context -->
        <div class="pt-1 sm:pb-1 flex-1 min-w-0">
          <!-- Opening Status Badge with Pulsing Dot -->
          <UBadge
            v-if="openingStatus"
            :color="statusColor"
            variant="subtle"
            class="mb-1.5 font-bold rounded-full px-2 py-0.5 flex items-center gap-1 w-fit text-[10px] sm:text-xs"
          >
            <span
              class="size-1 sm:size-1.5 rounded-full shrink-0"
              :class="openingStatus.open ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"
            />
            {{ openingStatus.label }}
          </UBadge>

          <!-- Brand Typography -->
          <h1 class="font-serif text-lg sm:text-3xl lg:text-4xl font-extrabold sm:font-black text-stone-900 tracking-tight truncate">
            {{ org.name }}
          </h1>

          <!-- Description -->
          <p
            v-if="org.description"
            class="mt-1.5 max-w-2xl text-xs md:text-sm leading-relaxed text-stone-600 font-medium"
          >
            {{ org.description }}
          </p>

          <!-- Contact & Address Bar -->
          <div class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-stone-500 font-medium">
            <span v-if="fullAddress" class="flex items-center gap-1.5 max-w-full">
              <UIcon name="i-lucide-map-pin" class="size-3.5 text-amber-700 shrink-0" />
              <span class="truncate">{{ fullAddress }}</span>
            </span>
            
            <span v-if="fullAddress && (org.phone || org.email)" class="hidden md:inline text-stone-300">•</span>
            
            <div class="flex flex-wrap items-center gap-2.5">
              <a
                v-if="org.phone"
                :href="`tel:${org.phone}`"
                class="flex items-center gap-1.5 hover:text-amber-700 transition-colors duration-200"
              >
                <UIcon name="i-lucide-phone" class="size-3.5 text-amber-700 shrink-0" />
                <span>{{ org.phone }}</span>
              </a>
              
              <span v-if="org.phone && org.email" class="hidden sm:inline text-stone-300">•</span>
              
              <a
                v-if="org.email"
                :href="`mailto:${org.email}`"
                class="flex items-center gap-1.5 hover:text-amber-700 transition-colors duration-200"
              >
                <UIcon name="i-lucide-mail" class="size-3.5 text-amber-700 shrink-0" />
                <span>{{ org.email }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
