<script setup lang="ts">
/**
 * SessionBanner.vue
 * Elegant active session details card rendered at the top of the menu grid.
 */

import { computed } from 'vue'
import { useCustomerSession } from '~/composables/useCustomerSession'

const session = useCustomerSession()

defineProps<{
  tableLabel?: string | null
  isOpenBill?: boolean
}>()

const modeLabel = computed(() => {
  if (session.sessionMode.value === 'open_bill') return 'Open Bill'
  return 'Pesanan Meja'
})

const modeIcon = computed(() => {
  if (session.sessionMode.value === 'open_bill') return 'i-lucide-receipt'
  return 'i-lucide-armchair'
})
</script>

<template>
  <div v-if="session.hasSession.value" class="rounded-2xl border border-amber-200/50 bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20 p-4 shadow-sm flex items-center justify-between gap-4 animate-fade-in">
    <div class="flex items-center gap-3 min-w-0">
      <!-- Icon Container -->
      <div class="size-9 rounded-xl bg-amber-50 border border-amber-100/60 flex items-center justify-center text-amber-700 shrink-0">
        <UIcon :name="modeIcon" class="size-4.5" />
      </div>
      <!-- Info Context -->
      <div class="min-w-0">
        <p class="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 leading-none mb-1">
          <template v-if="session.sessionMode.value === 'table'">Meja Aktif</template>
          <template v-else>Sesi Aktif • {{ modeLabel }}</template>
        </p>
        <p class="text-xs sm:text-sm font-bold text-stone-900 leading-normal truncate">
          <span v-if="session.sessionMode.value === 'table'">Anda sedang memesan untuk <strong>Meja {{ tableLabel }}</strong></span>
          <span v-else>Anda sedang menambahkan pesanan ke <strong>Open Bill {{ tableLabel }}</strong></span>
        </p>
      </div>
    </div>
    
    <UBadge
      v-if="session.sessionMode.value === 'open_bill'"
      label="Sesi Aktif"
      color="success"
      variant="soft"
      class="shrink-0 font-bold px-2 py-0.5 rounded-full text-[10px]"
    />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
