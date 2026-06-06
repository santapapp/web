<script setup lang="ts">
/**
 * SessionBanner.vue
 * Compact active session badge.
 */

import { computed } from 'vue'
import { useCustomerSession } from '~/composables/useCustomerSession'

const session = useCustomerSession()

const props = defineProps<{
  tableLabel?: string | null
  isOpenBill?: boolean
}>()

const displayTableLabel = computed(() => {
  const label = props.tableLabel || session.sessionLabel.value || ''
  if (!label) return ''
  if (label.toLowerCase().startsWith('meja')) {
    return label
  }
  return `Meja ${label}`
})
</script>

<template>
  <div v-if="session.hasSession.value" class="animate-fade-in">
    <UBadge
      color="primary"
      variant="soft"
      class="rounded-full font-extrabold px-3 py-1 text-[11px] border border-orange-200/40 flex items-center gap-1.5 shadow-none"
    >
      <template v-if="session.sessionMode.value === 'table'">
        <UIcon name="i-lucide-armchair" class="size-3.5 text-orange-600 shrink-0" />
        <span>{{ displayTableLabel }}</span>
      </template>
      <template v-else>
        <UIcon name="i-lucide-receipt" class="size-3.5 text-orange-600 shrink-0" />
        <span>Open Bill</span>
      </template>
    </UBadge>
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
