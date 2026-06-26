<template>
  <div class="fixed bottom-6 right-6 z-50 pointer-events-auto select-none">
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="group relative flex items-center justify-center bg-[#1A1714] text-white
             border border-white/10 shadow-[var(--shadow-3)] transition-all duration-300 ease-[var(--ease-premium)]
             hover:border-[var(--color-primary)] hover:shadow-[0_8px_32px_rgba(232,119,34,0.25)]
             h-12 md:h-14 rounded-full overflow-hidden"
      :class="isExpanded ? 'w-[185px]' : 'w-12 md:w-14'"
      @mouseenter="isExpanded = true"
      @mouseleave="isExpanded = false"
      aria-label="Hubungi kami melalui WhatsApp"
    >

      <!-- Inner Flex Container -->
      <div class="flex items-center justify-center px-1">
        <!-- WhatsApp SVG Icon -->
        <svg
          viewBox="0 0 24 24"
          class="w-5 h-5 md:w-6 md:h-6 text-[#25D366] shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.908.533 3.69 1.463 5.217l-1.42 5.185 5.305-1.392A9.957 9.957 0 0 0 12.004 22c5.52 0 10-4.48 10-10.004C22.004 6.48 17.524 2 12.004 2zm-.004 18.337a8.31 8.31 0 0 1-4.246-1.161l-.304-.18-3.15.827.842-3.076-.2-.317a8.307 8.307 0 0 1-1.277-4.432c0-4.587 3.73-8.317 8.317-8.317 4.587 0 8.317 3.73 8.317 8.317 0 4.587-3.73 8.317-8.317 8.317zm4.56-6.223c-.25-.124-1.477-.73-1.705-.812-.228-.083-.393-.124-.559.124-.166.249-.643.812-.788.979-.145.166-.29.186-.54.062-.25-.125-1.054-.388-2.008-1.24-.743-.663-1.245-1.48-1.39-1.73-.146-.249-.016-.384.109-.508.112-.112.25-.29.374-.436.124-.145.166-.25.25-.415.083-.166.04-.311-.02-.436-.063-.125-.56-1.352-.767-1.85-.202-.488-.408-.42-.559-.428-.145-.008-.31-.008-.477-.008-.166 0-.436.062-.664.311-.228.249-.871.852-.871 2.077 0 1.224.892 2.408.99 2.541.1.133 1.755 2.68 4.253 3.757 2.498 1.077 2.498.718 2.955.676.457-.042 1.477-.603 1.685-1.185.207-.581.207-1.079.145-1.183-.062-.104-.228-.166-.477-.29z"/>
        </svg>

        <!-- Expanding Label Text (Transitions opacity, max-width, and margin) -->
        <span
          class="text-[12px] font-bold tracking-[0.06em] uppercase text-white whitespace-nowrap transition-all duration-300 ease-out"
          :class="isExpanded ? 'opacity-100 max-w-[120px] ml-2.5' : 'opacity-0 max-w-0 ml-0 overflow-hidden'"
        >
          Hubungi Kami
        </span>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)

// WhatsApp configuration with prefilled message
const whatsappNumber = '6281234567890'
const message = 'Halo Santap, saya tertarik untuk bertanya tentang solusi sistem POS restoran Anda.'
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
</script>

<style scoped>
/* Ensure smooth transition for all properties */
a {
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.3s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}
</style>
