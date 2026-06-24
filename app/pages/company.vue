<template>
  <main ref="mainRef" class="overflow-x-hidden w-full">

    <!-- ── HERO — Curtain Reveal ──────────────────────────── -->
    <AppPageHeroCurtain
      badge="Mitra & Perusahaan"
      line1="Kemitraan Kokoh."
      line2="Tumbuh Bersama."
      aria-label="Mitra & Perusahaan"
      scroll-target="company-overview"
      title-size="clamp(52px, 11vw, 150px)"
    >
      Ekosistem F&B Indonesia yang lebih tangguh. <span style="color: var(--color-text-primary); font-weight: 500;">Santap adalah partner teknologi</span> yang terpercaya merchant.
    </AppPageHeroCurtain>
    
    <!-- ══════════════════════════════════════════════════════
         IMMERSIVE DARK SECTION — coffee shop / restaurant scene + large white text overlay
         ══════════════════════════════════════════════════════ -->
    <section
      id="company-overview"
      class="relative mx-3 my-6 md:mx-5 rounded-2xl overflow-hidden"
      style="min-height: 55vh; display: flex; flex-direction: column; justify-content: center;"
      aria-label="Visi Misi"
    >
      <!-- Background image -->
      <img
        src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1800&q=80&fit=crop"
        alt="Barista sedang menyiapkan kopi di cafe modern"
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
            <span class="text-[10px] font-bold uppercase tracking-[0.18em]" style="color: rgba(255,255,255,0.75);">Misi Kami</span>
          </div>
        </div>

        <!-- Large descriptive text -->
        <AppTextWordReveal
          class="font-medium leading-[1.12] tracking-tight max-w-[950px]"
          style="font-size: clamp(26px, 4vw, 52px); color: #FFFFFF;"
          text="Kami berkomitmen memberdayakan bisnis kuliner Indonesia melalui teknologi POS cloud yang modern, andal, dan terjangkau untuk semua."
        />
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CORE VALUES SECTION — premium split layout
         ══════════════════════════════════════════════════════ -->
    <section
      id="company-content"
      ref="valsSecRef"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Nilai Kami"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        <!-- Left Column: Heading -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Nilai & Komitmen</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-8"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Pilar Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-12 max-w-sm">
            Nilai-nilai yang memandu setiap keputusan produk dan layanan yang kami buat untuk merchant.
          </p>
        </div>

        <!-- Right Column: Values List -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-8">
            <div class="h-px bg-[var(--color-border)]"></div>

            <div 
              v-for="(val, i) in values" 
              :key="i"
              class="cmp-right-item flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-6"
            >
              <div class="flex items-start gap-4">
                <span class="text-[12px] font-medium tabular-nums text-[var(--color-text-tertiary)] mt-1">0{{ i + 1 }}.</span>
                <div>
                  <h3 class="text-[18px] font-medium text-[var(--color-text-primary)] mb-1">{{ val.title }}</h3>
                  <p class="text-[14.5px] text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                    {{ val.desc }}
                  </p>
                </div>
              </div>
            </div>

            <div class="h-px bg-[var(--color-border)]"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- ═════════════════════════════════════════════════════════════════════════════════════
         PARTNER MERCHANT SECTION — Cafe & Restaurant Partners
         ═════════════════════════════════════════════════════════════════════════════════════ -->
    <section
      id="company-partners"
      ref="partnersSecRef"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Mitra Restoran"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        <!-- Left Column: Heading -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Ekosistem Kuliner</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-8"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Tumbuh Bersama Mitra Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-12 max-w-sm">
            Dari kedai kopi lokal hingga jaringan resto multi-cabang, kami bangga menjadi bagian dari perjalanan sukses mereka.
          </p>
        </div>

        <!-- Right Column: Cards & Grid -->
        <div class="lg:col-span-8">
          <!-- Featured Skeleton Card -->
          <div class="featured-cafe-card p-8 md:p-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div class="flex-1 z-10 space-y-4">
              <div class="h-4 w-32 rounded bg-[var(--color-bg-subtle)] animate-pulse"></div>
              <div class="h-8 w-48 rounded bg-[var(--color-bg-subtle)] animate-pulse"></div>
              <div class="space-y-2">
                <div class="h-4 w-full rounded bg-[var(--color-bg-subtle)] animate-pulse"></div>
                <div class="h-4 w-5/6 rounded bg-[var(--color-bg-subtle)] animate-pulse"></div>
              </div>
              <div class="h-4 w-40 rounded bg-[var(--color-bg-subtle)] animate-pulse mt-6"></div>
            </div>
            <!-- Featured Logo Skeleton -->
            <div class="w-28 h-28 rounded-xl bg-[var(--color-bg-subtle)] flex-shrink-0 z-10 transition-transform duration-300 hover:scale-105 animate-pulse"></div>
            <div class="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-[var(--color-primary-light)] to-transparent opacity-40 rounded-full blur-2xl -mr-16 -mb-16 pointer-events-none"></div>
          </div>

          <!-- Logo Grid Skeleton -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              v-for="i in 6"
              :key="i"
              class="partner-logo-card"
            >
              <!-- Glowing effect on hover -->
              <div class="card-glow"></div>
              
              <!-- Border corners -->
              <div class="corner-line top-left"></div>
              <div class="corner-line top-right"></div>
              <div class="corner-line bottom-left"></div>
              <div class="corner-line bottom-right"></div>
 
              <div class="card-content">
                <div class="logo-wrapper">
                  <div class="w-full h-full bg-[var(--color-bg-subtle)] rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CTA SECTION — Dark theme above footer
         ══════════════════════════════════════════════════════ -->
    <section
      id="company-cta"
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Kemitraan Baru"
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
          
          <!-- Left Column: Heading -->
          <div class="lg:col-span-5 flex flex-col justify-between">
            <div>
              <!-- Badge -->
              <div class="mb-8">
                <div
                  class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
                  style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
                >
                  <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
                  <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Bergabung Bersama Kami</span>
                </div>
              </div>

              <h2
                class="font-medium leading-[1.05] tracking-tight mb-6"
                style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF;"
              >
                Bergabunglah dengan <span
                  style="
                    background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  "
                >10.000+ merchant.</span>
              </h2>
              <p class="text-[14.5px] leading-[1.75] max-w-sm mb-10" style="color: rgba(255,255,255,0.55);">
                Ratusan restoran dan kafe telah mempercayai Santap untuk operasional kasir harian mereka.
              </p>

              <!-- Proof stat row -->
              <div class="flex items-center gap-6 mb-10">
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none">10.000+</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255,255,255,0.4);">Merchant Aktif</p>
                </div>
                <div class="w-px self-stretch" style="background-color: rgba(255,255,255,0.1);"></div>
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none">50+</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255,255,255,0.4);">Kota di Indonesia</p>
                </div>
                <div class="w-px self-stretch" style="background-color: rgba(255,255,255,0.1);"></div>
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none">99.9%</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255,255,255,0.4);">Uptime</p>
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

          <!-- Right Column: Partnerships CTA Cards -->
          <div class="lg:col-span-7">
            <div class="flex flex-col gap-5">
              
              <!-- Card 1: Mitra Merchant — featured -->
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
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">Mitra Merchant</span>
                  </div>
                  <h3 class="text-[20px] font-medium text-white mb-2 leading-tight">Daftarkan Restoran atau Cafe Anda</h3>
                  <p class="text-[13.5px] leading-relaxed text-white/55">
                    Mulai perjalanan digitalisasi kasir Anda — gratis 14 hari, tanpa kartu kredit, tanpa kontrak mengikat.
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

              <!-- Card 2: Mitra Integrasi -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <!-- Sub-card A: API / Integrasi -->
                <div
                  class="border rounded-2xl p-7 flex flex-col justify-between"
                  style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
                >
                  <div>
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style="background-color: rgba(255,255,255,0.08);">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M8 9l3 3-3 3M13 15h3" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Mitra Integrasi</span>
                    </div>
                    <h3 class="text-[17px] font-medium text-white mb-2 leading-snug">Sambungkan Sistem Anda via API</h3>
                    <p class="text-[13px] leading-relaxed text-white/50 mb-6">
                      Integrasikan e-wallet, delivery platform, atau sistem akuntansi dengan API terbuka Santap.
                    </p>
                  </div>
                  <NuxtLink
                    to="/contact"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 text-white/60 hover:text-white"
                  >
                    Hubungi Tim API
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </NuxtLink>
                </div>

                <!-- Sub-card B: Kemitraan / Reseller -->
                <div
                  class="border rounded-2xl p-7 flex flex-col justify-between"
                  style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
                >
                  <div>
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style="background-color: rgba(255,255,255,0.08);">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Program Reseller</span>
                    </div>
                    <h3 class="text-[17px] font-medium text-white mb-2 leading-snug">Jadi Mitra Reseller Santap</h3>
                    <p class="text-[13px] leading-relaxed text-white/50 mb-6">
                      Dapatkan komisi menarik dengan merekomendasikan Santap ke jaringan restoran dan cafe Anda.
                    </p>
                  </div>
                  <NuxtLink
                    to="/contact"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 text-white/60 hover:text-white"
                  >
                    Daftar Reseller
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

const mainRef         = ref<HTMLElement | null>(null)
const valsSecRef      = ref<HTMLElement | null>(null)
const partnersSecRef  = ref<HTMLElement | null>(null)
let ctx: any = null

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // ─── Helper: animate satu section ─────────────────────────────────────
      const animateSection = (secEl: HTMLElement | null, rightDelay = 0) => {
        if (!secEl) return

        const leftCol    = secEl.querySelector<HTMLElement>('.cmp-left')
        const rightItems = secEl.querySelectorAll<HTMLElement>('.cmp-right-item')

        // LEFT: fade in + slide dari bawah, trigger lebih lambat (butuh lebih banyak scroll)
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

        // RIGHT ITEMS: swipe masuk dari kanan, stagger per item
        if (rightItems.length) {
          gsap.set(rightItems, { opacity: 0, x: 50 })
          gsap.to(rightItems, {
            scrollTrigger: { trigger: secEl, start: 'top 82%' },
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.14,
            delay: rightDelay,
          })
        }
      }

      animateSection(valsSecRef.value)

      // Partners: featured card dulu, lalu logo grid
      if (partnersSecRef.value) {
        const leftCol     = partnersSecRef.value.querySelector<HTMLElement>('.cmp-left')
        const featuredCard = partnersSecRef.value.querySelector<HTMLElement>('.featured-cafe-card')
        const logoCards    = partnersSecRef.value.querySelectorAll<HTMLElement>('.partner-logo-card')

        if (leftCol) {
          gsap.set(leftCol, { opacity: 0, y: 32 })
          gsap.to(leftCol, {
            scrollTrigger: { trigger: leftCol, start: 'top 72%' },
            opacity: 1, y: 0,
            duration: 1.4,
            ease: 'power3.out',
          })
        }

        if (featuredCard) {
          gsap.set(featuredCard, { opacity: 0, x: 50 })
          gsap.to(featuredCard, {
            scrollTrigger: { trigger: partnersSecRef.value, start: 'top 82%' },
            opacity: 1, x: 0,
            duration: 1.2,
            ease: 'power3.out',
          })
        }

        if (logoCards.length) {
          gsap.set(logoCards, { opacity: 0, x: 40 })
          gsap.to(logoCards, {
            scrollTrigger: { trigger: partnersSecRef.value, start: 'top 75%' },
            opacity: 1, x: 0,
            duration: 1.0,
            ease: 'power3.out',
            stagger: 0.08,
            delay: 0.3,
          })
        }
      }
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(
        mainRef.value?.querySelectorAll('.cmp-left, .cmp-right-item, .featured-cafe-card, .partner-logo-card') ?? [],
        { opacity: 1, x: 0, y: 0, clearProps: 'all' }
      )
    })
  }, mainRef.value ?? undefined)
})

onUnmounted(() => { ctx?.revert() })
useHead({
  title: 'Mitra & Perusahaan — Santap',
  meta: [
    { name: 'description', content: 'Kenali visi, komitmen, dan pilar kerja Santap dalam memberdayakan jutaan merchant F&B di seluruh Indonesia lewat teknologi POS POS modern.' }
  ]
})
const values = [
  {
    title: 'Inovasi Terus Menerus',
    desc: 'Kami terus update POS cloud agar selaras dengan tren F&B terkini dan kebutuhan merchant.'
  },
  {
    title: 'Ketulusan Melayani',
    desc: 'Support WhatsApp kami siap 24/7 karena restoran tidak pernah tutup.'
  },
  {
    title: 'Kemitraan Adil',
    desc: 'Tanpa biaya tersembunyi. Harga transparan untuk keberlanjutan bisnis kita bersama.'
  }
]

const stats = [
  {
    value: '10,000+',
    label: 'Merchant Aktif',
    desc: 'Dari kedai kopi hingga franchise besar.'
  },
  {
    value: '99.99%',
    label: 'Uptime POS',
    desc: 'Tanpa khawatir kehilangan data transaksi.'
  },
  {
    value: '50+',
    label: 'Kota di Indonesia',
    desc: 'Sabang sampai Merauke, kami siap.'
  },
  {
    value: 'Rp 1.2T+',
    label: 'Volume Transaksi',
    desc: 'Jutaan transaksi F&B per tahun.'
  }
]

const cafes = [
  {
    name: 'Kopi Janji Jiwa',
    type: 'Espresso & Toast',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Janji_Jiwa_Logo.svg'
  },
  {
    name: 'Starbucks',
    type: 'Coffeehouse Chain',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg'
  },
  {
    name: 'Chatime',
    type: 'Fresh Tea & Boba',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Chatime_logo.svg'
  },
  {
    name: 'Costa Coffee',
    type: 'Specialty Coffee',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Costa_Coffee.svg'
  },
  {
    name: 'McCafé',
    type: 'Coffee & Dessert',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/McCaf%C3%A9_logo.svg'
  },
  {
    name: 'Subway',
    type: 'Sandwich & Salad',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg'
  }
]
</script>

<style scoped>
/* Scoped styles for glow background and premium transitions */
.partner-logo-card {
  position: relative;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all var(--duration-normal) var(--ease-default);
  cursor: pointer;
  overflow: hidden;
}

.partner-logo-card:hover {
  border-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-1);
}

/* Card Glow */
.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(232, 119, 34, 0.04) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-default);
  pointer-events: none;
}

.partner-logo-card:hover .card-glow {
  opacity: 1;
}

/* Corner Lines style */
.corner-line {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: var(--color-primary);
  border-style: solid;
  opacity: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}

.top-left {
  top: 12px;
  left: 12px;
  border-width: 1.5px 0 0 1.5px;
  transform: translate(4px, 4px);
}
.top-right {
  top: 12px;
  right: 12px;
  border-width: 1.5px 1.5px 0 0;
  transform: translate(-4px, 4px);
}
.bottom-left {
  bottom: 12px;
  left: 12px;
  border-width: 0 0 1.5px 1.5px;
  transform: translate(4px, -4px);
}
.bottom-right {
  bottom: 12px;
  right: 12px;
  border-width: 0 1.5px 1.5px 0;
  transform: translate(-4px, -4px);
}

.partner-logo-card:hover .corner-line {
  opacity: 1;
  transform: translate(0, 0);
}

/* Card Content */
.card-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-wrapper {
  height: 44px;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.partner-img-logo {
  height: 100%;
  max-width: 130px;
  object-fit: contain;
  opacity: 0.55;
  filter: grayscale(1) contrast(1.1);
  transition: all var(--duration-normal) var(--ease-default);
}

.partner-logo-card:hover .partner-img-logo {
  opacity: 1;
  filter: grayscale(0) contrast(1);
}

.cafe-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.cafe-type {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
}
</style>
