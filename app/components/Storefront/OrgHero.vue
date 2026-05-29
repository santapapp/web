<script setup lang="ts">
import { computed } from 'vue'

export interface OpeningStatus {
  open: boolean
  label: string
  color: string
}

export interface OrgPublicData {
  id: number
  name: string
  slug: string
  is_active: boolean
  logo: string | null
  banner: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  province: string | null
  timezone: string | null
  currency: string
  tax_enabled: boolean
  tax_rate: number
  service_charge_enabled: boolean
  service_charge_rate: number
  opening_hours: any
}

const props = defineProps<{
  org: OrgPublicData
  openingStatus: OpeningStatus | null
}>()

const orgInitials = computed(() =>
  (props.org.name || 'S').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
)

const fullAddress = computed(() =>
  [props.org.address, props.org.city, props.org.province].filter(Boolean).join(', ')
)

const hasInfoChips = computed(() =>
  !!(props.org.currency || props.org.tax_enabled || props.org.service_charge_enabled)
)
</script>

<template>
  <div class="relative bg-white lg:rounded-3xl lg:shadow-sm lg:border lg:border-gray-100 overflow-hidden">
    <!-- Banner / Header background -->
    <div class="h-32 sm:h-48 lg:h-56 bg-primary/10 relative">
      <img
        v-if="org.banner"
        :src="org.banner"
        :alt="`${org.name} banner`"
        class="w-full h-full object-cover"
      />
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>

    <div class="px-4 sm:px-6 lg:px-10 pb-8 lg:pb-10 relative">
      <div class="flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-8 -mt-12 sm:-mt-16 lg:-mt-20">
        
        <!-- Avatar -->
        <div class="relative inline-block self-start lg:self-auto">
          <UAvatar
            :src="org.logo || undefined"
            :alt="org.name"
            :text="!org.logo ? orgInitials : undefined"
            :ui="{ 
              root: 'ring-4 ring-white shadow-md bg-white rounded-2xl',
              fallback: 'text-3xl lg:text-4xl font-bold text-primary' 
            }"
            class="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
          />
          <!-- Status indicator badge -->
          <div
            v-if="openingStatus"
            class="absolute -bottom-2 -right-2 lg:bottom-2 lg:-right-4 px-3 py-1 rounded-full shadow-sm text-xs font-bold border-2 border-white flex items-center gap-1.5"
            :class="openingStatus.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
          >
            <span class="size-2 rounded-full" :style="{ backgroundColor: openingStatus.color }"></span>
            {{ openingStatus.open ? 'Buka' : 'Tutup' }}
          </div>
        </div>

        <!-- Info Header -->
        <div class="flex-1 lg:pb-4 pt-2">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-none mb-3">
            {{ org.name }}
          </h1>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 text-sm">
            <p v-if="fullAddress" class="flex items-start sm:items-center gap-1.5 line-clamp-2 sm:line-clamp-1">
              <UIcon name="i-lucide-map-pin" class="size-4 flex-shrink-0 text-primary mt-0.5 sm:mt-0" />
              <span>{{ fullAddress }}</span>
            </p>
            <span class="hidden sm:block text-gray-300" v-if="fullAddress && (org.phone || org.email)">•</span>
            <div class="flex items-center gap-4">
              <a v-if="org.phone" :href="`tel:${org.phone}`" class="flex items-center gap-1.5 hover:text-primary transition-colors">
                <UIcon name="i-lucide-phone" class="size-4 text-primary" />
                {{ org.phone }}
              </a>
              <a v-if="org.email" :href="`mailto:${org.email}`" class="flex items-center gap-1.5 hover:text-primary transition-colors">
                <UIcon name="i-lucide-mail" class="size-4 text-primary" />
                {{ org.email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Action / CTA Desktop -->
        <div class="hidden lg:flex lg:pb-4 items-center">
          <UButton
            to="#menu-section"
            size="xl"
            color="primary"
            variant="solid"
            icon="i-lucide-utensils"
            label="Lihat Menu"
            class="rounded-xl"
          />
        </div>
      </div>

      <!-- Info Chips -->
      <div v-if="hasInfoChips" class="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <UCard v-if="org.currency" class="h-full rounded-xl shadow-sm ring-1 ring-gray-100 hover:ring-primary/20 transition-all" :ui="{ body: 'p-4 flex items-center gap-3' }">
          <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-wallet" class="size-5 text-primary" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Mata Uang</p>
            <p class="text-sm font-bold text-gray-900">{{ org.currency }}</p>
          </div>
        </UCard>
        
        <UCard v-if="org.tax_enabled" class="h-full rounded-xl shadow-sm ring-1 ring-gray-100 hover:ring-primary/20 transition-all" :ui="{ body: 'p-4 flex items-center gap-3' }">
          <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-receipt" class="size-5 text-primary" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Pajak</p>
            <p class="text-sm font-bold text-gray-900">{{ org.tax_rate }}%</p>
          </div>
        </UCard>

        <UCard v-if="org.service_charge_enabled" class="h-full rounded-xl shadow-sm ring-1 ring-gray-100 hover:ring-primary/20 transition-all" :ui="{ body: 'p-4 flex items-center gap-3' }">
          <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Biaya Servis</p>
            <p class="text-sm font-bold text-gray-900">{{ org.service_charge_rate }}%</p>
          </div>
        </UCard>
      </div>

    </div>
  </div>
</template>
