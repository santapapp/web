<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="relative">
    <!-- Wrapper: rounded-full, bg-gray-100, no outline border -->
    <div class="relative flex items-center w-full rounded-full bg-gray-100 px-4 py-2.5 gap-3 focus-within:ring-2 focus-within:ring-orange-300 focus-within:bg-white transition-all duration-200">
      <!-- Search icon -->
      <svg
        class="size-4 text-gray-400 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      <input
        v-model="model"
        type="text"
        placeholder="Cari menu di sini..."
        aria-label="Cari menu"
        class="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 font-medium"
      />

      <!-- Clear button -->
      <button
        v-if="model"
        type="button"
        aria-label="Hapus pencarian"
        class="size-5 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors cursor-pointer flex-shrink-0"
        @click="model = ''"
      >
        <svg class="size-3 text-gray-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
