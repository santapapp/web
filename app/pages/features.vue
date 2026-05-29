<template>
  <main ref="mainRef">

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
        src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1800&q=80&fit=crop"
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
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 py-20 md:py-28">
          
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
                v-for="feat in category.features"
                :key="feat.label"
                class="cmp-right-item flex flex-col items-start transition-opacity duration-200 hover:opacity-90"
              >
                <!-- Feature icon & badge header -->
                <div class="flex items-center gap-3 mb-4">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path :d="feat.icon" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>

                  <!-- Badges -->
                  <span
                    v-if="feat.core"
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.08em] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  >Inti</span>
                  <span
                    v-if="feat.soon"
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.08em] bg-[var(--color-bg-subtle)] text-[var(--color-text-tertiary)] border border-[var(--color-border)]"
                  >Segera</span>
                </div>

                <!-- Feature Title -->
                <h3
                  class="font-medium tracking-tight text-lg text-[var(--color-text-primary)] mb-2"
                >
                  {{ feat.label }}
                </h3>

                <!-- Feature Description -->
                <p
                  class="text-[13.5px] leading-[1.65] text-[var(--color-text-secondary)]"
                >
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
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Keandalan Platform"
    >
      <!-- Subtle background texture -->
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

        <!-- Header row -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-20 md:mb-28">
          <!-- Badge -->
          <div class="lg:col-span-4 flex items-start ftr-focus-badge">
            <div
              class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
              style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
            >
              <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
              <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Keandalan Sistem</span>
            </div>
          </div>

          <!-- Heading -->
          <div class="lg:col-span-8 ftr-focus-heading">
            <h2
              class="font-medium leading-[1.08] tracking-tight"
              style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF; max-width: 680px;"
            >
              Teknologi andalan untuk menyokong
              <span style="color: rgba(255,255,255,0.35);"> keberlangsungan bisnis F&amp;B Anda.</span>
            </h2>
          </div>
        </div>

        <!-- 3 Focus Items -->
        <div>
          <!-- Top border -->
          <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>

          <div
            v-for="(focus, i) in focuses"
            :key="focus.id"
            class="ftr-focus-row"
          >
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 py-12 md:py-16 items-start group">
              <!-- Number + Title (left) -->
              <div class="md:col-span-5 flex items-baseline gap-5">
                <span
                  class="flex-shrink-0 tabular-nums font-light"
                  style="font-size: 13px; color: rgba(255,255,255,0.25); letter-spacing: 0.04em;"
                >{{ focus.number }}</span>
                <h3
                  class="font-medium tracking-tight leading-[1.1]"
                  style="font-size: clamp(24px, 3vw, 38px); color: #FFFFFF;"
                >{{ focus.title }}</h3>
              </div>

              <!-- Description (right) -->
              <div class="md:col-span-7 md:pt-1.5">
                <p class="text-[14.5px] leading-[1.75] max-w-[560px]" style="color: rgba(255,255,255,0.55);">
                  {{ focus.desc }}
                </p>
                <!-- Feature tags -->
                <div class="flex flex-wrap gap-2 mt-6">
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
              <p class="text-[14.5px] leading-[1.75] max-w-sm mb-10" style="color: rgba(255,255,255,0.55);">
                Dengan semua fitur modern dalam satu platform yang mudah digunakan dan terpercaya.
              </p>

              <!-- Proof stat row skeleton -->
              <div class="flex items-center gap-6 mb-10">
                <div>
                  <div class="h-8 w-24 rounded bg-white/15 animate-pulse mb-2"></div>
                  <div class="h-3 w-32 rounded bg-white/15 animate-pulse"></div>
                </div>
                <div class="w-px self-stretch" style="background-color: rgba(255,255,255,0.1);"></div>
                <div>
                  <div class="h-8 w-20 rounded bg-white/15 animate-pulse mb-2"></div>
                  <div class="h-3 w-24 rounded bg-white/15 animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Contact info -->
            <div class="hidden lg:flex flex-col gap-5">
              <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>
              <div class="flex items-center gap-8">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style="color: rgba(255,255,255,0.35);">Email Kami</p>
                  <a href="mailto:halo@santap.id" class="text-[14px] font-medium text-white hover:text-[var(--color-primary)] transition-colors no-underline">
                    halo@santap.id
                  </a>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style="color: rgba(255,255,255,0.35);">WhatsApp</p>
                  <a href="https://wa.me/6281234567890" target="_blank" class="text-[14px] font-medium text-white hover:text-[var(--color-primary)] transition-colors no-underline">
                    +62 812-3456-7890
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
                
                <div class="flex-1 relative z-10">
                  <div class="flex items-center gap-2 mb-3">
                    <!-- Icon -->
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--color-primary);">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/>
                      </svg>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">Gratis 14 Hari</span>
                  </div>
                  <h3 class="text-[20px] font-medium text-white mb-2 leading-tight">Coba Santap Sekarang</h3>
                  <p class="text-[13.5px] leading-relaxed text-white/55">
                    Mulai digitalisasi kasir tanpa komitmen. Akses penuh ke semua fitur selama 2 minggu.
                  </p>
                </div>
                <NuxtLink
                  to="/#"
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
                  class="border rounded-2xl p-7 flex flex-col justify-between"
                  style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
                >
                  <div>
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style="background-color: rgba(255,255,255,0.08);">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-9a9 9 0 11-18 0 9 9 0 0118 0z" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Konsultasi</span>
                    </div>
                    <h3 class="text-[17px] font-medium text-white mb-2 leading-snug">Konsultasi Kebutuhan Anda</h3>
                    <p class="text-[13px] leading-relaxed text-white/50 mb-6">
                      Tim kami siap memahami kebutuhan spesifik bisnis kuliner Anda dan memberikan solusi terbaik.
                    </p>
                  </div>
                  <NuxtLink
                    to="/contact"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 text-white/60 hover:text-white"
                  >
                    Jadwalkan Konsultasi
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </NuxtLink>
                </div>

                <!-- Sub-card B: Hubungi Perwakilan -->
                <div
                  class="border rounded-2xl p-7 flex flex-col justify-between"
                  style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
                >
                  <div>
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style="background-color: rgba(255,255,255,0.08);">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Hubungi</span>
                    </div>
                    <h3 class="text-[17px] font-medium text-white mb-2 leading-snug">Hubungi Perwakilan Kami</h3>
                    <p class="text-[13px] leading-relaxed text-white/50 mb-6">
                      Terhubung langsung dengan tim sales kami melalui WhatsApp atau email untuk bantuan cepat.
                    </p>
                  </div>
                  <NuxtLink
                    to="https://wa.me/6281234567890"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 text-white/60 hover:text-white"
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

        if (badge) {
          gsap.set(badge, { opacity: 0, y: 14 })
          gsap.to(badge, {
            scrollTrigger: { trigger: focusSecRef.value, start: 'top 80%' },
            opacity: 1, y: 0,
            duration: 0.7,
            ease: 'power3.out',
          })
        }
        if (heading) {
          gsap.set(heading, { opacity: 0, y: 22 })
          gsap.to(heading, {
            scrollTrigger: { trigger: focusSecRef.value, start: 'top 78%' },
            opacity: 1, y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.1,
          })
        }
        if (rows.length) {
          gsap.set(rows, { opacity: 0, y: 20 })
          gsap.to(rows, {
            scrollTrigger: { trigger: focusSecRef.value, start: 'top 75%' },
            opacity: 1, y: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.12,
            delay: 0.2,
          })
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
})

onUnmounted(() => { ctx?.revert() })

useHead({
  title: 'Fitur — Santap',
  meta: [
    { name: 'description', content: 'Semua fitur yang dibutuhkan kasir modern: manajemen pesanan, laporan real-time, multi pembayaran, dan lebih banyak lagi.' }
  ]
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
