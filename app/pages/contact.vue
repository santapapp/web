<template>
  <main>

    <!-- ══════════════════════════════════════════════════════
         HERO — IntegratedBio style:
         Large 2-line title (bold + muted), scroll arrow, subtitle bottom-right
         ══════════════════════════════════════════════════════ -->
    <section
      class="relative bg-[var(--color-bg-page)]"
      style="min-height: 85svh; display: flex; flex-direction: column;"
      aria-label="Hubungi Santap"
    >
      <div
        class="flex-1 px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto w-full
               flex flex-col justify-between pt-32 pb-16 md:pt-40 md:pb-20"
      >
        <!-- ── Overline badge ──────────────────────────────── -->
        <div class="mb-8 md:mb-12">
          <div class="inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]">
            <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
            <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Hubungi Kami</span>
          </div>
        </div>

        <!-- ── Main title — 2 lines ──────────────────────────── -->
        <div class="flex-1 flex items-center">
          <h1 class="font-medium tracking-[-0.03em] leading-[0.95]" style="font-size: clamp(56px, 12vw, 160px);">
            <span class="block" style="color: var(--color-text-primary);">Koneksi Dekat.</span>
            <span class="block" style="color: var(--color-text-tertiary);">Solusi Cepat.</span>
          </h1>
        </div>

        <!-- ── Bottom row: scroll arrow (left) + subtitle (right) ── -->
        <div class="flex items-end justify-between border-t pt-10 border-[var(--color-border)] mt-12">
          <!-- Scroll-down arrow -->
          <button
            @click="scrollToContent"
            class="flex items-center justify-center rounded-xl border border-[var(--color-border)] transition-all duration-200 hover:border-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] group"
            style="width: 44px; height: 44px; color: var(--color-text-primary);"
            aria-label="Gulir ke bawah"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="transition-colors duration-200 group-hover:text-white" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Subtitle text — bottom right -->
          <p
            class="text-right text-[14.5px] leading-[1.7] max-w-[300px] md:max-w-[380px]"
            style="color: var(--color-text-secondary);"
          >
            Ada pertanyaan tentang paket, kemitraan, atau integrasi?
            <span style="color: var(--color-text-primary); font-weight: 500;">Tim customer support & sales kami</span> siap membantu operasional bisnis kuliner Anda tumbuh maksimal.
          </p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         IMMERSIVE DARK SECTION — warm customer service visual + large white text overlay
         ══════════════════════════════════════════════════════ -->
    <section
      id="contact-overview"
      class="relative mx-3 my-6 md:mx-5 rounded-2xl overflow-hidden"
      style="min-height: 55vh; display: flex; flex-direction: column; justify-content: center;"
      aria-label="Komitmen Layanan"
    >
      <!-- Background image -->
      <img
        src="https://images.unsplash.com/photo-1552581230-c013b1e4c987?w=1800&q=80&fit=crop"
        alt="Kolaborasi tim support"
        class="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />
      <!-- Dark overlay -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to bottom right, rgba(8,6,4,0.72) 0%, rgba(8,6,4,0.55) 50%, rgba(8,6,4,0.80) 100%);"
      ></div>

      <!-- Content -->
      <div class="relative z-10 px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto py-20 md:py-28 w-full">
        <!-- Badge -->
        <div class="mb-10">
          <div
            class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
            style="background-color: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15);"
          >
            <div class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background-color: var(--color-primary);"></div>
            <span class="text-[10px] font-bold uppercase tracking-[0.18em]" style="color: rgba(255,255,255,0.75);">Customer Care</span>
          </div>
        </div>

        <!-- Large descriptive text -->
        <p
          class="font-medium leading-[1.12] tracking-tight max-w-[950px]"
          style="font-size: clamp(26px, 4vw, 52px); color: #FFFFFF;"
        >
          Kami percaya layanan yang baik adalah kunci dari kelancaran bisnis. Kami tidak hanya menjual aplikasi kasir, melainkan hadir sebagai mitra operasional harian Anda.
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CONTACT CHANNELS SECTION — premium split layout
         ══════════════════════════════════════════════════════ -->
    <section
      id="contact-content"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Saluran Kontak"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        <!-- Left Column: Heading -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Hubungi Langsung</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-8"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Ada Pertanyaan?
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-12 max-w-sm">
            Tim kami siap menyambut pertanyaan Anda dan mendiskusikan bagaimana Santap dapat menyederhanakan kasir restoran Anda.
          </p>
        </div>

        <!-- Right Column: Channels List -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-8">
            <div class="h-px bg-[var(--color-border)]"></div>

            <!-- WhatsApp channel -->
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 no-underline transition-opacity duration-200 hover:opacity-85"
            >
              <div class="flex items-start gap-4">
                <span class="text-[12px] font-medium tabular-nums text-[var(--color-text-tertiary)] mt-1">01.</span>
                <div>
                  <h3 class="text-[18px] font-medium text-[var(--color-text-primary)] mb-1">WhatsApp Support</h3>
                  <p class="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                    Respon cepat (&lt; 15 menit) untuk kendala operasional kasir harian.
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 text-[var(--color-primary)] font-bold text-[11px] uppercase tracking-[0.1em] self-start sm:self-auto pl-7 sm:pl-0">
                <span>Hubungi WA</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </a>

            <div class="h-px bg-[var(--color-border)]"></div>

            <!-- Email channel -->
            <a 
              href="mailto:halo@santap.id" 
              class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 no-underline transition-opacity duration-200 hover:opacity-85"
            >
              <div class="flex items-start gap-4">
                <span class="text-[12px] font-medium tabular-nums text-[var(--color-text-tertiary)] mt-1">02.</span>
                <div>
                  <h3 class="text-[18px] font-medium text-[var(--color-text-primary)] mb-1">Kemitraan & Penjualan</h3>
                  <p class="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                    Hubungi sales kami di halo@santap.id untuk penawaran skala franchise/multi-outlet.
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 text-[var(--color-primary)] font-bold text-[11px] uppercase tracking-[0.1em] self-start sm:self-auto pl-7 sm:pl-0">
                <span>Kirim Email</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </a>

            <div class="h-px bg-[var(--color-border)]"></div>

            <!-- Office address -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-4">
               <div class="flex items-start gap-4">
                 <span class="text-[12px] font-medium tabular-nums text-[var(--color-text-tertiary)] mt-1">03.</span>
                 <div>
                   <h3 class="text-[18px] font-medium text-[var(--color-text-primary)] mb-1">Lokasi Kantor</h3>
                   <p class="text-[14px] text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                     PT Santap Teknologi Indonesia<br>
                     Gedung Graha Kuliner, Lantai 4<br>
                     Kuningan, Jakarta Selatan 12940
                   </p>
                 </div>
               </div>
            </div>
            
            <div class="h-px bg-[var(--color-border)]"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         FORM SECTION — Dark theme above footer
         ══════════════════════════════════════════════════════ -->
    <section
      id="contact-form-section"
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Formulir Kontak"
    >
      <!-- Subtle background texture (glow) -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          class="absolute"
          style="width: 60%; height: 60%; top: -20%; left: -10%; background: radial-gradient(circle, rgba(232,119,34,0.06) 0%, transparent 70%); border-radius: 50%;"
        ></div>
        <div
          class="absolute"
          style="width: 50%; height: 50%; bottom: -15%; right: -5%; background: radial-gradient(circle, rgba(232,119,34,0.04) 0%, transparent 70%); border-radius: 50%;"
        ></div>
      </div>

      <div class="relative z-10 px-5 md:px-10 lg:px-16 py-24 md:py-32 max-w-[1400px] mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          <!-- Left Column: Heading and info -->
          <div class="lg:col-span-4 flex flex-col justify-between">
            <div>
              <!-- Badge -->
              <div class="mb-8">
                <div
                  class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
                  style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
                >
                  <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
                  <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Kirim Pesan</span>
                </div>
              </div>

              <h2
                class="font-medium leading-[1.08] tracking-tight mb-6"
                style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF;"
              >
                Punya rencana
                <span style="color: rgba(255,255,255,0.35);"> untuk F&B Anda?</span>
              </h2>
              <p class="text-[14.5px] leading-[1.75] max-w-sm mb-12" style="color: rgba(255,255,255,0.55);">
                Ceritakan kebutuhan operasional bisnis Anda. Tim perwakilan kami siap mendampingi perjalanan digitalisasi restoran Anda.
              </p>
            </div>

            <!-- Quick Contacts -->
            <div class="hidden lg:flex flex-col gap-6">
              <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style="color: rgba(255,255,255,0.35);">Email Penjualan</p>
                <a href="mailto:halo@santap.id" class="text-[15px] font-medium text-white hover:text-[var(--color-primary)] transition-colors no-underline">
                  halo@santap.id
                </a>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style="color: rgba(255,255,255,0.35);">WhatsApp Support</p>
                <a href="https://wa.me/6281234567890" target="_blank" class="text-[15px] font-medium text-white hover:text-[var(--color-primary)] transition-colors no-underline">
                  +62 812-3456-7890
                </a>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Form -->
          <div class="lg:col-span-8">
            <div
              class="border rounded-2xl p-6 md:p-10 lg:p-12"
              style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
            >
              <h3 class="text-xl md:text-2xl font-medium tracking-tight text-white mb-2">
                Kirim Pesan
              </h3>
              <p class="text-sm mb-8" style="color: rgba(255,255,255,0.55);">
                Isi formulir berikut dan tim kami akan segera menghubungi Anda.
              </p>

              <form v-if="!isSubmitted" @submit.prevent="submitForm" class="flex flex-col gap-6">
                
                <!-- Row 1: Nama Lengkap + Nama Bisnis -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Nama -->
                  <div class="flex flex-col gap-2">
                    <label for="name" class="text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                      Nama Lengkap <span class="text-[var(--color-danger)]">*</span>
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      class="form-input-dark"
                      :class="{ 'border-danger-dark': errors.name }"
                      @input="clearError('name')"
                    />
                    <span v-if="errors.name" class="text-xs text-[var(--color-danger)]">{{ errors.name }}</span>
                  </div>

                  <!-- Nama Bisnis -->
                  <div class="flex flex-col gap-2">
                    <label for="businessName" class="text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                      Nama Restoran / Cafe <span class="text-[var(--color-danger)]">*</span>
                    </label>
                    <input
                      id="businessName"
                      v-model="form.businessName"
                      type="text"
                      required
                      placeholder="Contoh: Kopi Cantik"
                      class="form-input-dark"
                      :class="{ 'border-danger-dark': errors.businessName }"
                      @input="clearError('businessName')"
                    />
                    <span v-if="errors.businessName" class="text-xs text-[var(--color-danger)]">{{ errors.businessName }}</span>
                  </div>
                </div>

                <!-- Row 2: Email + WhatsApp -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Email -->
                  <div class="flex flex-col gap-2">
                    <label for="email" class="text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                      Alamat Email <span class="text-[var(--color-danger)]">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="nama@email.com"
                      class="form-input-dark"
                      :class="{ 'border-danger-dark': errors.email }"
                      @input="clearError('email')"
                    />
                    <span v-if="errors.email" class="text-xs text-[var(--color-danger)]">{{ errors.email }}</span>
                  </div>

                  <!-- No WhatsApp -->
                  <div class="flex flex-col gap-2">
                    <label for="phone" class="text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                      No. WhatsApp <span class="text-[var(--color-danger)]">*</span>
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      class="form-input-dark"
                      :class="{ 'border-danger-dark': errors.phone }"
                      @input="clearError('phone')"
                    />
                    <span v-if="errors.phone" class="text-xs text-[var(--color-danger)]">{{ errors.phone }}</span>
                  </div>
                </div>

                <!-- Dropdown: Paket Diminati -->
                <div class="flex flex-col gap-2">
                  <label for="interest" class="text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                    Paket yang Diminati
                  </label>
                  <div class="relative">
                    <select
                      id="interest"
                      v-model="form.interest"
                      class="form-select-dark"
                    >
                      <option value="starter">Starter (Kios / Kedai Kecil)</option>
                      <option value="pro">Pro (Cafe / Restoran)</option>
                      <option value="enterprise">Enterprise (Multi-Outlet & Jaringan Franchise)</option>
                      <option value="partnership">Kemitraan Lain / General Support</option>
                    </select>
                    <!-- Custom arrow icon -->
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Textarea: Pesan -->
                <div class="flex flex-col gap-2">
                  <label for="message" class="text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                    Pesan Anda <span class="text-[var(--color-danger)]">*</span>
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    required
                    rows="5"
                    placeholder="Ceritakan tentang kebutuhan bisnis kuliner Anda..."
                    class="form-textarea-dark"
                    :class="{ 'border-danger-dark': errors.message }"
                    @input="clearError('message')"
                  ></textarea>
                  <span v-if="errors.message" class="text-xs text-[var(--color-danger)]">{{ errors.message }}</span>
                </div>

                <!-- Submit Button -->
                <div class="mt-4 flex items-center justify-between gap-6 flex-wrap">
                  <span class="text-xs leading-relaxed text-white/40 max-w-sm">
                    Dengan mengirimkan pesan, Anda menyetujui <NuxtLink to="/privacy-policy" class="underline text-white/80 hover:text-white transition-colors">Kebijakan Privasi</NuxtLink> kami.
                  </span>

                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] text-[#111009] bg-white hover:bg-white/95 hover:-translate-y-px transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span v-if="isLoading">Mengirim...</span>
                    <span v-else>Kirim Pesan</span>
                    <svg v-if="!isLoading" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>

              </form>

              <!-- Success State -->
              <div v-else class="py-12 flex flex-col items-center text-center gap-6 animate-[fadeIn_0.5s_ease-out]">
                <div class="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-2xl font-medium tracking-tight text-white mb-2">
                    Terima Kasih, {{ form.name }}!
                  </h4>
                  <p class="text-[14.5px] leading-relaxed max-w-md mx-auto text-white/60">
                    Pesan Anda telah berhasil kami terima. Tim representative kami akan segera menghubungi Anda melalui WhatsApp atau Email dalam 1x24 jam kerja.
                  </p>
                </div>
                <button
                  @click="resetForm"
                  class="mt-4 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] border border-white/20 text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                >
                  Kirim Pesan Lain
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

useHead({
  title: 'Hubungi Kami — Santap',
  meta: [
    { name: 'description', content: 'Hubungi tim aplikasi kasir mobile Santap. Dapatkan konsultasi gratis, demo produk, atau ajukan pertanyaan seputar kemitraan dan integrasi POS restoran.' }
  ]
})

const scrollToContent = () => {
  document.getElementById('contact-overview')?.scrollIntoView({ behavior: 'smooth' })
}

const form = reactive({
  name: '',
  businessName: '',
  email: '',
  phone: '',
  interest: 'pro',
  message: ''
})

const errors = reactive({
  name: '',
  businessName: '',
  email: '',
  phone: '',
  message: ''
})

const isLoading = ref(false)
const isSubmitted = ref(false)

const clearError = (field: keyof typeof errors) => {
  errors[field] = ''
}

const validateForm = () => {
  let isValid = true
  
  if (!form.name.trim()) {
    errors.name = 'Nama lengkap wajib diisi'
    isValid = false
  }
  
  if (!form.businessName.trim()) {
    errors.businessName = 'Nama restoran/cafe wajib diisi'
    isValid = false
  }
  
  if (!form.email.trim()) {
    errors.email = 'Alamat email wajib diisi'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid'
    isValid = false
  }
  
  if (!form.phone.trim()) {
    errors.phone = 'Nomor WhatsApp wajib diisi'
    isValid = false
  } else if (!/^[0-9+() \-]{8,20}$/.test(form.phone)) {
    errors.phone = 'Nomor WhatsApp tidak valid'
    isValid = false
  }
  
  if (!form.message.trim()) {
    errors.message = 'Pesan tidak boleh kosong'
    isValid = false
  }
  
  return isValid
}

const submitForm = () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  // Simulate API post call
  setTimeout(() => {
    isLoading.value = false
    isSubmitted.value = true
  }, 1200)
}

const resetForm = () => {
  form.name = ''
  form.businessName = ''
  form.email = ''
  form.phone = ''
  form.interest = 'pro'
  form.message = ''
  
  isSubmitted.value = false
}
</script>

<style scoped>
.form-input-dark,
.form-textarea-dark {
  width: 100%;
  padding: 14px 16px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  color: #FFFFFF;
  font-size: 14.5px;
  transition: all var(--duration-fast) var(--ease-default);
  outline: none;
}

.form-select-dark {
  width: 100%;
  padding: 14px 16px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  color: #FFFFFF;
  font-size: 14.5px;
  transition: all var(--duration-fast) var(--ease-default);
  outline: none;
  appearance: none; /* Hide default browser arrow */
  cursor: pointer;
}

.form-select-dark option {
  background-color: #1a1913;
  color: #FFFFFF;
}

.form-input-dark:focus,
.form-select-dark:focus,
.form-textarea-dark:focus {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.form-input-dark::placeholder,
.form-textarea-dark::placeholder {
  color: rgba(255, 255, 255, 0.3);
  opacity: 0.8;
}

.border-danger-dark {
  border-color: var(--color-danger) !important;
}

.border-danger-dark:focus {
  border-color: var(--color-danger) !important;
  box-shadow: 0 0 0 1px var(--color-danger) !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
