<script setup lang="ts">
const emit = defineEmits<{
  scan: [token: string]
  close: []
}>()
</script>

<template>
  <OrdersQrScanner
    @scanned="emit('scan', $event.qr)"
    @cancel="emit('close')"
  />
</template>
