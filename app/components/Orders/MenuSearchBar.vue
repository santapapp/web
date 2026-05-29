<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="relative">
    <UInput
      v-model="model"
      icon="i-lucide-search"
      placeholder="Cari menu di sini..."
      size="lg"
      aria-label="Cari menu"
      class="w-full"
      :ui="{ trailing: 'pe-2' }"
    >
      <template v-if="model" #trailing>
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          aria-label="Hapus pencarian"
          @click="model = ''"
        />
      </template>
    </UInput>
  </div>
</template>
