<template>
  <main ref="mainRef" class="overflow-x-clip w-full">

    <!-- ── HERO — Curtain Reveal ──────────────────────────── -->
    <AppPageHeroCurtain
      badge="Fitur Santap"
      line1="Semua Fitur"
      line2="Kasir Modern."
      aria-label="Fitur Santap"
      scroll-target="features-content"
    >
      Catat pesanan, proses pembayaran, pantau laporan. <span style="color: var(--color-text-primary); font-weight: 500;">Semuanya dalam satu aplikasi.</span>
    </AppPageHeroCurtain>

    <!-- ══════════════════════════════════════════════════════
         IMMERSIVE DARK SECTION — food image + large white text overlay
         ══════════════════════════════════════════════════════ -->
    <section
      id="features-content"
      class="relative mx-3 my-6 md:mx-5 rounded-2xl overflow-hidden"
      style="min-height: 55vh; display: flex; flex-direction: column; justify-content: center;"
      aria-label="Gambaran Platform"
    >
      <!-- Background image -->
      <img
        src="/images/pricing-hero.jpg"
        alt="Dapur restoran sibuk"
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
            <span class="text-[10px] font-bold uppercase tracking-[0.18em]" style="color: rgba(255,255,255,0.75);">Platform Overview</span>
          </div>
        </div>

        <!-- Large descriptive text -->
        <AppTextWordReveal
          class="font-medium leading-[1.12] tracking-tight max-w-[950px]"
          style="font-size: clamp(26px, 4vw, 52px); color: #FFFFFF;"
          text="Pencatatan pesanan, pembayaran multi-metode, dan laporan real-time dalam satu aplikasi. Kendali penuh atas operasional restoran Anda."
        />
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         FEATURE CATEGORIES — clean horizontal row layout
         ══════════════════════════════════════════════════════ -->
    <section
      ref="categoriesSecRef"
      class="bg-[var(--color-bg-page)] py-12 md:py-20"
      aria-label="Kategori Fitur"
    >
      <div
        v-for="(category, ci) in categories"
        :key="category.id"
        class="ftr-category-block px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto"
      >
        <!-- Section Divider -->
        <div class="h-px bg-[var(--color-border)]"></div>

        <!-- Category Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start py-20 md:py-28">
          
          <!-- Left: Category info (cols 1-4) -->
          <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
            <div class="flex items-baseline gap-4 mb-4">
              <span
                class="font-medium tabular-nums text-[13px]"
                style="color: var(--color-text-tertiary); letter-spacing: 0.04em;"
              >0{{ ci + 1 }}</span>
              <h2
                class="font-medium tracking-tight leading-[1.1]"
                style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
              >
                {{ category.name }}
              </h2>
            </div>
            
            <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-6 max-w-sm">
              {{ category.desc }}
            </p>
            
            <span
              class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]"
              style="background-color: var(--color-bg-surface); color: var(--color-text-tertiary); border: 1px solid var(--color-border);"
            >
              {{ category.features.length }} Fitur Utama
            </span>
          </div>

          <!-- Right: Features list (cols 5-12) -->
          <div class="lg:col-span-8">
            <div class="flex flex-col gap-12">
              <div
                v-for="(feat, fi) in category.features"
                :key="feat.label"
                class="cmp-right-item flex flex-col gap-4"
              >
                <!-- Icon + Title + Badges row -->
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path :d="feat.icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="text-[20px] font-medium text-[var(--color-text-primary)]">{{ feat.label }}</h3>
                  <span
                    v-if="feat.core"
                    class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.08em] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  >Inti</span>
                  <span
                    v-if="feat.soon"
                    class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.08em] bg-[var(--color-bg-subtle)] text-[var(--color-text-tertiary)] border border-[var(--color-border)]"
                  >Segera</span>
                </div>

                <!-- Feature Description -->
                <p class="text-[14.5px] leading-relaxed text-[var(--color-text-secondary)]">
                  {{ feat.desc }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CUSTOM FEATURE FOCUS SECTION — same design style as index, customized content
         ══════════════════════════════════════════════════════ -->
    <section
      ref="focusSecRef"
      class="relative"
      style="background-color: #111009;"
      aria-label="Keandalan Platform"
    >
      <!-- Subtle background texture -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <!-- Left: Sticky Header Column -->
          <div class="lg:col-span-5 lg:sticky lg:top-28 self-start flex flex-col gap-6">
            <!-- Badge -->
            <div class="ftr-focus-badge">
              <div
                class="inline-flex items-center gap-3 px-4 py-2 rounded-md border w-fit"
                style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
              >
                <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
                <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Keandalan Sistem</span>
              </div>
            </div>

            <!-- Heading -->
            <div class="ftr-focus-heading">
              <h2
                class="font-medium leading-[1.08] tracking-tight"
                style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF; max-width: 480px;"
              >
                Teknologi andalan untuk menyokong
                <span style="color: rgba(255,255,255,0.35);"> keberlangsungan bisnis F&amp;B Anda.</span>
              </h2>
            </div>
          </div>

          <!-- Right: List Column -->
          <div class="lg:col-span-7 flex flex-col">
            <!-- Top border -->
            <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>

            <div
              v-for="(focus, i) in focuses"
              :key="focus.id"
              class="ftr-focus-row"
            >
              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-16 items-center group">
                <!-- Col 1: Huge Number -->
                <div class="md:col-span-3 flex items-baseline justify-start">
                  <span
                    class="font-extrabold tracking-tighter leading-none select-none pointer-events-none tabular-nums"
                    style="font-size: clamp(56px, 6.5vw, 84px); color: rgba(255, 255, 255, 0.05); font-family: var(--font-body);"
                  >{{ focus.number }}</span>
                </div>

                <!-- Col 2: Title, Description & Tags -->
                <div class="md:col-span-9 flex flex-col items-start gap-4">
                  <div>
                    <h3
                      class="font-medium tracking-tight leading-[1.2] mb-3"
                      style="font-size: clamp(20px, 2.2vw, 26px); color: #FFFFFF;"
                    >{{ focus.title }}</h3>
                    <p class="text-[14px] leading-relaxed" style="color: rgba(255,255,255,0.55);">
                      {{ focus.desc }}
                    </p>
                  </div>

                  <!-- Feature tags -->
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span
                      v-for="tag in focus.tags"
                      :key="tag"
                      class="px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.1em]"
                      style="background-color: rgba(255,255,255,0.06); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.08);"
                    >{{ tag }}</span>
                  </div>
                </div>
              </div>
              <!-- Divider -->
              <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CTA SECTION — Dark theme with rich design
         ══════════════════════════════════════════════════════ -->
    <section
      id="features-cta"
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Bergabung bersama Santap"
    >
      <!-- Subtle background texture (glow) -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          class="absolute"
          style="width: 60%; height: 60%; top: -20%; left: -10%; background: radial-gradient(circle, rgba(232,119,34,0.07) 0%, transparent 70%); border-radius: 50%;"
        ></div>
        <div
          class="absolute"
          style="width: 50%; height: 50%; bottom: -15%; right: -5%; background: radial-gradient(circle, rgba(232,119,34,0.04) 0%, transparent 70%); border-radius: 50%;"
        ></div>
      </div>

      <div class="relative z-10 px-5 md:px-10 lg:px-16 py-24 md:py-32 max-w-[1400px] mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          <!-- Left Column: Heading & Info -->
          <div class="lg:col-span-5 flex flex-col justify-between">
            <div>
              <!-- Badge -->
              <div class="mb-8">
                <div
                  class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
                  style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
                >
                  <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
                  <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Mulai Perjalanan</span>
                </div>
              </div>

              <h2
                class="font-medium leading-[1.05] tracking-tight mb-6"
                style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF;"
              >
                Transformasi operasional <span
                  style="
                    background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  "
                >restoran Anda.</span>
              </h2>
              <p class="text-[14.5px] leading-[1.75] max-w-sm" style="color: rgba(255,255,255,0.55);">
                Dengan semua fitur modern dalam satu platform yang mudah digunakan dan terpercaya.
              </p>

              <!-- Proof stat row -->
              <div class="flex items-center gap-6 mt-8">
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none" style="color: #ffffff;">10.000+</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255, 255, 255, 0.65);">Merchant Aktif</p>
                </div>
                <div class="w-px self-stretch" style="background-color: rgba(255,255,255,0.15);"></div>
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none" style="color: #ffffff;">50+</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255, 255, 255, 0.65);">Kota di Indonesia</p>
                </div>
                <div class="w-px self-stretch" style="background-color: rgba(255,255,255,0.15);"></div>
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none" style="color: #ffffff;">99.9%</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255, 255, 255, 0.65);">Uptime</p>
                </div>
              </div>
            </div>

            <!-- Contact info -->
            <div class="hidden lg:flex flex-col mt-8">
              <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>
              <div class="flex items-center gap-8 pt-8">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style="color: rgba(255, 255, 255, 0.5);">Email Kami</p>
                  <a href="mailto:info@sekeco.id" class="text-[14px] font-medium hover:text-[var(--color-primary)] transition-colors no-underline" style="color: #ffffff;">
                    info@sekeco.id
                  </a>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style="color: rgba(255, 255, 255, 0.5);">WhatsApp</p>
                  <a href="https://wa.me/628986606000?text=Halo%20Santap!%20Saya%20ingin%20konsultasi%20%26%20demo%20produk%20untuk%20restoran%2Fcafe%20saya.%20Terima%20kasih." target="_blank" class="text-[14px] font-medium hover:text-[var(--color-primary)] transition-colors no-underline" style="color: #ffffff;">
                    +62 898-6606-000
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: CTA Cards -->
          <div class="lg:col-span-7">
            <div class="flex flex-col gap-5">
              
              <!-- Card 1: Mulai Uji Coba — featured -->
              <div
                class="border rounded-2xl p-8 md:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden"
                style="background-color: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.12);"
              >
                <!-- Glow accent -->
                <div class="absolute top-0 right-0 w-48 h-48 pointer-events-none" style="background: radial-gradient(circle at top right, rgba(232,119,34,0.12) 0%, transparent 70%);"></div>
                
                <!-- Huge Faint Background Icon -->
                <div class="absolute -top-8 -right-8 w-36 h-36 text-[var(--color-primary)] opacity-[0.08] pointer-events-none select-none z-0">
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>

                <div class="flex-1 relative z-10">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">Gratis 14 Hari</span>
                  </div>
                  <h3 class="text-[20px] font-medium mb-2 leading-tight" style="color: #ffffff;">Coba Santap Sekarang</h3>
                  <p class="text-[13.5px] leading-relaxed" style="color: rgba(255, 255, 255, 0.75);">
                    Mulai digitalisasi kasir tanpa komitmen. Akses penuh ke semua fitur selama 2 minggu.
                  </p>
                </div>
                <NuxtLink
                  to="https://play.google.com/store/apps/details?id=com.santap.pos"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] no-underline transition-all hover:-translate-y-px flex-shrink-0 relative z-10 bg-white text-[#111009] hover:bg-white/95"
                >
                  Mulai Gratis
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </NuxtLink>
              </div>

              <!-- Card 2: Sub-cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <!-- Sub-card A: Konsultasi Gratis -->
                <div
                  class="border rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden"
                  style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
                >
                  <!-- Huge Faint Background Icon -->
                  <div class="absolute -top-6 -right-6 w-28 h-28 text-white opacity-[0.03] pointer-events-none select-none z-0">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>

                  <div class="relative z-10">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Konsultasi</span>
                    </div>
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Konsultasi Kebutuhan Anda</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Tim kami siap memahami kebutuhan spesifik bisnis kuliner Anda dan memberikan solusi terbaik.
                    </p>
                  </div>
                  <NuxtLink
                    to="/contact"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 hover:!text-white relative z-10"
                    style="color: rgba(255, 255, 255, 0.75);"
                  >
                    Jadwalkan Konsultasi
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </NuxtLink>
                </div>

                <!-- Sub-card B: Hubungi Perwakilan -->
                <div
                  class="border rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden"
                  style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
                >
                  <!-- Huge Faint Background Icon -->
                  <div class="absolute -top-6 -right-6 w-28 h-28 text-white opacity-[0.03] pointer-events-none select-none z-0">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>

                  <div class="relative z-10">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Hubungi</span>
                    </div>
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Hubungi Perwakilan Kami</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Terhubung langsung dengan tim sales kami melalui WhatsApp or email untuk bantuan cepat.
                    </p>
                  </div>
                  <NuxtLink
                    to="https://wa.me/628986606000?text=Halo%20Santap!%20Saya%20ingin%20konsultasi%20%26%20demo%20produk%20untuk%20restoran%2Fcafe%20saya.%20Terima%20kasih."
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 hover:!text-white relative z-10"
                    style="color: rgba(255, 255, 255, 0.75);"
                  >
                    Chat WhatsApp
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </NuxtLink>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Feature {
  label: string
  desc: string
  icon: string
  iconBg: string
  iconColor: string
  core?: boolean
  soon?: boolean
  featured?: boolean
}

interface Category {
  id: string
  name: string
  desc: string
  features: Feature[]
}

const mainRef          = ref<HTMLElement | null>(null)
const categoriesSecRef = ref<HTMLElement | null>(null)
const focusSecRef      = ref<HTMLElement | null>(null)
let ctx: any = null

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // ─── Helper: animate sticky-left + staggered-right pattern ─────
      const animateLeftRight = (
        secEl: HTMLElement | null,
        leftSel = '.cmp-left',
        rightSel = '.cmp-right-item'
      ) => {
        if (!secEl) return
        const leftCol    = secEl.querySelector<HTMLElement>(leftSel)
        const rightItems = secEl.querySelectorAll<HTMLElement>(rightSel)

        if (leftCol) {
          gsap.set(leftCol, { opacity: 0, y: 24 })
          gsap.to(leftCol, {
            scrollTrigger: { trigger: leftCol, start: 'top 78%' },
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
          })
        }

        if (rightItems.length) {
          gsap.set(rightItems, { opacity: 0, y: 18 })
          gsap.to(rightItems, {
            scrollTrigger: { trigger: secEl, start: 'top 82%' },
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
          })
        }
      }

      // ── Categories — animate per-block with left-right pattern ─
      if (categoriesSecRef.value) {
        const blocks = categoriesSecRef.value.querySelectorAll<HTMLElement>('.ftr-category-block')
        blocks.forEach(block => {
          const leftCol = block.querySelector<HTMLElement>('.cmp-left')
          const rightItems = block.querySelectorAll<HTMLElement>('.cmp-right-item')

          if (leftCol) {
            gsap.set(leftCol, { opacity: 0, y: 32 })
            gsap.to(leftCol, {
              scrollTrigger: { trigger: leftCol, start: 'top 72%' },
              opacity: 1,
              y: 0,
              duration: 1.4,
              ease: 'power3.out',
            })
          }

          if (rightItems.length) {
            gsap.set(rightItems, { opacity: 0, x: 50 })
            gsap.to(rightItems, {
              scrollTrigger: { trigger: block, start: 'top 82%' },
              opacity: 1,
              x: 0,
              duration: 1.1,
              ease: 'power3.out',
              stagger: 0.14,
            })
          }
        })
      }

      // ── New CTA section: left heading + right cards ──────────────
      const ctaSec = mainRef.value?.querySelector('[aria-label="Bergabung bersama Santap"]')
      if (ctaSec) {
        const leftCol = ctaSec.parentElement?.querySelector('.lg\\:col-span-5')
        const rightCards = ctaSec.parentElement?.querySelectorAll('.lg\\:col-span-7 > div > div')

        if (leftCol) {
          gsap.set(leftCol, { opacity: 0, y: 32 })
          gsap.to(leftCol, {
            scrollTrigger: { trigger: leftCol, start: 'top 72%' },
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
          })
        }

        if (rightCards) {
          const cardsArray = Array.from(rightCards)
          gsap.set(cardsArray, { opacity: 0, x: 50 })
          gsap.to(cardsArray, {
            scrollTrigger: { trigger: ctaSec, start: 'top 82%' },
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.14,
          })
        }
      }

      // ── Dark focus section: badge + heading + rows ─────────────
      if (focusSecRef.value) {
        const badge   = focusSecRef.value.querySelector<HTMLElement>('.ftr-focus-badge')
        const heading = focusSecRef.value.querySelector<HTMLElement>('.ftr-focus-heading')
        const rows    = focusSecRef.value.querySelectorAll<HTMLElement>('.ftr-focus-row')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: focusSecRef.value,
            start: 'top bottom',
            once: true,
            invalidateOnRefresh: true,
          }
        })

        if (badge) {
          gsap.set(badge, { opacity: 0, y: 14 })
          tl.to(badge, {
            opacity: 1, y: 0,
            duration: 0.5,
            ease: 'power3.out',
          }, 0)
        }
        if (heading) {
          gsap.set(heading, { opacity: 0, y: 22 })
          tl.to(heading, {
            opacity: 1, y: 0,
            duration: 0.75,
            ease: 'power3.out',
          }, 0)
        }
        if (rows.length) {
          gsap.set(rows, { opacity: 0, y: 20 })
          tl.to(rows, {
            opacity: 1, y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.08,
          }, 0)
        }
      }
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(
        mainRef.value?.querySelectorAll(
          '.cmp-left, .cmp-right-item, .ftr-cta-heading, .ftr-cta-actions, .ftr-focus-badge, .ftr-focus-heading, .ftr-focus-row'
        ) ?? [],
        { opacity: 1, x: 0, y: 0, clearProps: 'all' }
      )
    })
  }, mainRef.value ?? undefined)

  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 400)
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 800)

  // Refresh once all assets (hero/section images) finish loading — prevents
  // stale trigger positions on bottom sections from late layout shift.
  if (document.readyState === 'complete') {
    ScrollTrigger.refresh()
  } else {
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  }
})

onUnmounted(() => { ctx?.revert() })

useSeoMeta({
  title: 'Fitur Aplikasi Kasir Santap — POS, QRIS & Laporan',
  description: 'Semua fitur yang dibutuhkan kasir modern: manajemen pesanan, laporan real-time, multi pembayaran, dan lebih banyak lagi.',
  ogTitle: 'Fitur Lengkap Santap — Aplikasi POS Cloud untuk Restoran',
  ogDescription: 'Manajemen pesanan, KDS, multi pembayaran (QRIS, tunai, transfer), dashboard real-time, dan stok otomatis dalam satu aplikasi.',
  ogImage: '/images/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Fitur Lengkap Santap — Aplikasi POS Cloud',
  twitterDescription: 'Manajemen pesanan, KDS, multi pembayaran, dashboard real-time, dan stok otomatis dalam satu aplikasi.',
})

// Breadcrumb JSON-LD — jejak navigasi untuk rich result + konteks AI crawler.
usePageSeo({
  breadcrumbs: [
    { name: 'Beranda', item: '/' },
    { name: 'Fitur', item: '/features' },
  ],
})
const focuses = [
  {
    id: 'reliability',
    number: '01',
    title: 'Keandalan POS',
    desc: 'Sistem kasir modern yang dirancang untuk terus bekerja dengan mulus bahkan saat koneksi internet terputus. Data transaksi otomatis disinkronisasi ketika online kembali.',
    tags: ['Mode Offline', 'Keamanan Data', 'Auto-Sync'],
  },
  {
    id: 'workflow',
    number: '02',
    title: 'Efisiensi Dapur',
    desc: 'Hilangkan resiko salah catat atau pesanan terlambat. Integrasi dengan Kitchen Display System (KDS) mengalirkan order langsung ke dapur secara real-time.',
    tags: ['KDS Integrasi', 'Tanpa Kertas', 'Respons Kilat'],
  },
  {
    id: 'insights',
    number: '03',
    title: 'Analitik Real-Time',
    desc: 'Pantau profit margin, menu terlaris, dan kinerja staf cabang dari satu portal pemilik restoran. Data akurat membantu pengambilan keputusan strategis Anda.',
    tags: ['Owner Portal', 'Margin Kontrol', 'Ekspor Excel'],
  },
]

const categories: Category[] = [
  {
    id: 'ordering',
    name: 'Manajemen Pesanan',
    desc: 'Alur pesanan terintegrasi dari meja ke dapur hingga ke kasir — real-time, tanpa kertas, tanpa kesalahan.',
    features: [
      {
        label: 'Kasir Mobile',
        desc: 'Catat pesanan, proses transaksi, dan terima pembayaran langsung dari smartphone tanpa perangkat kasir mahal.',
        icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
        iconBg: 'var(--color-primary-light)',
        iconColor: 'var(--color-primary)',
        core: true,
        featured: true,
      },
      {
        label: 'Multi-tipe Pesanan',
        desc: 'Dine-in, takeaway, dan delivery dikelola dari satu layar tanpa berpindah aplikasi.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        iconBg: '#E8F5EF',
        iconColor: '#2D8A4E',
        featured: false,
      },
      {
        label: 'Kitchen Display',
        desc: 'Pesanan tersinkronisasi ke layar dapur secara real-time — tidak ada yang terlewat.',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        iconBg: '#EEF2FF',
        iconColor: '#4F46E5',
        featured: false,
      },
    ],
  },
  {
    id: 'payment',
    name: 'Pembayaran',
    desc: 'Terima semua metode pembayaran modern dalam satu sistem terpadu — tanpa perangkat tambahan.',
    features: [
      {
        label: 'Multi Pembayaran',
        desc: 'Tunai, QRIS, transfer bank, kartu debit/kredit, dan dompet digital semuanya diterima.',
        icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        iconBg: '#FFF4E0',
        iconColor: '#B97B0A',
        core: true,
        featured: false,
      },
      {
        label: 'Split Bill',
        desc: 'Bagi tagihan ke beberapa pelanggan atau terapkan diskon per item maupun total transaksi.',
        icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
        iconBg: 'var(--color-primary-light)',
        iconColor: 'var(--color-primary)',
        featured: false,
      },
      {
        label: 'Rekonsiliasi Otomatis',
        desc: 'Selisih kas terdeteksi otomatis di akhir shift — audit harian menjadi cepat dan akurat.',
        icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
        iconBg: '#E8F5EF',
        iconColor: '#2D8A4E',
        featured: false,
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Laporan & Analitik',
    desc: 'Data penjualan aktual yang membantu Anda mengambil keputusan bisnis tanpa tebak-tebakan.',
    features: [
      {
        label: 'Dashboard Real-time',
        desc: 'Pantau omzet, jumlah transaksi, dan rata-rata per meja hari ini langsung dari smartphone.',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        iconBg: 'var(--color-primary-light)',
        iconColor: 'var(--color-primary)',
        core: true,
        featured: true,
      },
      {
        label: 'Produk Terlaris',
        desc: 'Temukan menu yang paling diminati dan kapan puncak penjualannya terjadi.',
        icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
        iconBg: '#FFF4E0',
        iconColor: '#B97B0A',
        featured: false,
      },
      {
        label: 'Ekspor Laporan',
        desc: 'Unduh laporan dalam format PDF atau Excel — siap untuk keperluan akunting dan audit.',
        icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        iconBg: '#EEF2FF',
        iconColor: '#4F46E5',
        featured: false,
      },
    ],
  },
  {
    id: 'operations',
    name: 'Operasional',
    desc: 'Kelola inventaris, menu, dan multi-outlet dari satu platform terpadu yang mudah dioperasikan.',
    features: [
      {
        label: 'Manajemen Stok',
        desc: 'Pantau bahan baku dan produk secara otomatis. Notifikasi dikirim sebelum stok habis.',
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        iconBg: '#E8F5EF',
        iconColor: '#2D8A4E',
        featured: false,
      },
      {
        label: 'Menu Digital',
        desc: 'Kelola menu, harga, dan kategori kapan saja. Perubahan langsung tersinkron ke semua perangkat.',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        iconBg: 'var(--color-primary-light)',
        iconColor: 'var(--color-primary)',
        featured: false,
      },
      {
        label: 'Multi Outlet',
        desc: 'Kelola beberapa cabang restoran dari satu akun dengan laporan konsolidasi yang lengkap.',
        icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
        iconBg: '#EEF2FF',
        iconColor: '#4F46E5',
        soon: true,
        featured: false,
      },
    ],
  },
]
</script>
