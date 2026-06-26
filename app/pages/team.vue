<template>
  <main ref="mainRef">

    <!-- ── HERO — Curtain Reveal ──────────────────────────── -->
    <AppPageHeroCurtain
      badge="Tim Kami"
      line1="Dibangun Oleh"
      line2="Sekeco Studio."
      aria-label="Tim Santap"
      scroll-target="team-overview"
    >
      Dari tim product engineers, designers, dan hospitality experts. <span style="color: var(--color-text-primary); font-weight: 500;">Semua punya satu fokus: membuat POS yang sederhana dan cepat untuk restoran Indonesia.</span>
    </AppPageHeroCurtain>

    <!-- ══════════════════════════════════════════════════════
         OVERVIEW SECTION — warm kitchen visual + large white text overlay
         ══════════════════════════════════════════════════════ -->
    <section
      id="team-overview"
      class="relative mx-3 my-6 md:mx-5 rounded-2xl overflow-hidden"
      style="min-height: 55vh; display: flex; flex-direction: column; justify-content: center;"
      aria-label="Tentang Sekeco"
    >
      <!-- Background image -->
      <img
        src="/images/team-hero.jpg"
        alt="Tim Sekeco bekerja di kantor"
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
            <span class="text-[10px] font-bold uppercase tracking-[0.18em]" style="color: rgba(255,255,255,0.75);">Tentang Kami</span>
          </div>
        </div>

        <!-- Large descriptive text -->
        <AppTextWordReveal
          class="font-medium leading-[1.12] tracking-tight max-w-[950px]"
          style="font-size: clamp(26px, 4vw, 52px); color: #FFFFFF;"
          text="Sekeco adalah digital product studio Indonesia yang membangun Santap untuk menyederhanakan operasional restoran lokal."
        />
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         BACKGROUND SECTION — Who is Sekeco
         ══════════════════════════════════════════════════════ -->
    <section
      id="team-background"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Latar Belakang Sekeco"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        <!-- Left Column: Heading -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Tentang Sekeco</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-8"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Studio Product Indonesia
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-12 max-w-sm">
            Sejak 2015, kami membangun produk digital yang elegant, functional, dan sustainable untuk pasar Southeast Asia.
          </p>
        </div>

        <!-- Right Column: Content -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-12">
            <div class="cmp-right-item">
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">Digital Product Studio</h3>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)] mb-4">
                Sekeco adalah tim kecil yang passionate tentang membangun produk digital yang elegant, functional, dan meaningful untuk Indonesia.
              </p>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
                Filosofi kami: minimalist dalam approach, maksimal dalam impact. Setiap produk adalah kesempatan untuk solve real problems dengan baik.
              </p>
            </div>

            <div class="cmp-right-item">
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">Fokus pada Quality</h3>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)] mb-4">
                Tim kecil Sekeco fokus pada: product engineering yang solid, design yang thoughtful, dan support yang responsif. Kami tidak chase growth aggressively. Kami build untuk sustainability.
              </p>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
                Setiap produk adalah reflection dari expertise dan care kami. Santap adalah bukti dari philosophy ini.
              </p>
            </div>

            <div class="cmp-right-item">
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">Santap: Produk Unggulan</h3>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)] mb-4">
                Santap adalah hasil dari expertise Sekeco dalam membangun produk yang reliable, simple, dan user-loved. Kami apply best practices: scalable architecture, user-centric design, operational excellence.
              </p>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
                Tim Santap dedicated untuk membuat POS yang benar-benar memecahkan masalah operasional restoran Indonesia.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         TEAM COMPOSITION SECTION
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Komposisi Tim"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <!-- Left title -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Tim</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-6"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Interdisciplinary
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Tim kami bukan hanya engineers. Kami combine expertise dari berbagai disiplin untuk solve problems holistically.
          </p>
        </div>

        <!-- Right: Team roles -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-12">
            <div v-for="role in teamRoles" :key="role.title" class="cmp-right-item flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path :d="role.icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3 class="text-[20px] font-medium text-[var(--color-text-primary)]">{{ role.title }}</h3>
              </div>
              <p class="text-[14.5px] leading-relaxed text-[var(--color-text-secondary)]">
                {{ role.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CULTURE & VALUES SECTION
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Kultur Sekeco"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <!-- Left title -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Cara Kerja</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-6"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Kultur & Prinsip
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Bagaimana kami bekerja, think, dan make decisions di Sekeco.
          </p>
        </div>

        <!-- Right: Culture items -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-12">
            <div v-for="culture in cultureItems" :key="culture.title" class="cmp-right-item flex flex-col gap-4">
              <h3 class="text-[20px] font-medium text-[var(--color-text-primary)]">{{ culture.title }}</h3>
              <p class="text-[14.5px] leading-relaxed text-[var(--color-text-secondary)]">
                {{ culture.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         PARENT COMPANY SECTION
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="PT Sarwa Kalyana Cara"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <!-- Left title -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Struktur</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-6"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            PT Sarwa Kalyana
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Parent company yang provide stability, resources, dan strategic support untuk Santap grow sustainably.
          </p>
        </div>

        <!-- Right: Parent company info -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-12">

          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         LOCATION & CONTACT SECTION
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Lokasi Kantor"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <!-- Left title -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Lokasi</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-6"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Dimana Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Based di Sleman, Yogyakarta dengan tim yang solid dan kolaboratif.
          </p>
        </div>

        <!-- Right: Location info -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-12">
            <div class="cmp-right-item">
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">🏢 Lokasi</h3>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
                Based di Sleman, Yogyakarta, Indonesia. Tim Sekeco di satu lokasi untuk kolaborasi yang tight dan fast iteration.
              </p>
            </div>

            <div class="cmp-right-item">
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">👥 Tim Santap</h3>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)] mb-4">
                5-8 professionals (product engineers, designers, product manager, hospitality consultant)
              </p>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
                Tim kecil tapi mighty. Setiap person focused pada building Santap yang benar-benar solve problems merchant.
              </p>
            </div>

            <div class="cmp-right-item">
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">🤝 Hubungi Kami</h3>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
                Email: halo@santap.id | WhatsApp: +62 898-6606-000
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CTA SECTION — Dark theme above footer
         ══════════════════════════════════════════════════════ -->
    <section
      id="team-cta"
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Bergabung dengan Santap"
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
                  <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Mulai Menggunakan</span>
                </div>
              </div>

              <h2
                class="font-medium leading-[1.05] tracking-tight mb-6"
                style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF;"
              >
                Dibalik <span
                  style="
                    background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  "
                >Santap</span> adalah team yang care.
              </h2>
              <p class="text-[14.5px] leading-[1.75] max-w-sm mb-10" style="color: rgba(255,255,255,0.55);">
                Tim yang passionate tentang membuat operasional restoran lebih sederhana, lebih cepat, dan lebih menguntungkan.
              </p>

              <!-- Proof stat row -->
              <div class="flex items-center gap-6 mb-10">
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
            <div class="hidden lg:flex flex-col gap-5">
              <div class="h-px" style="background-color: rgba(255,255,255,0.08);"></div>
              <div class="flex items-center gap-8">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style="color: rgba(255, 255, 255, 0.5);">Email Kami</p>
                  <a href="mailto:halo@santap.id" class="text-[14px] font-medium hover:text-[var(--color-primary)] transition-colors no-underline" style="color: #ffffff;">
                    halo@santap.id
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
              
              <!-- Card 1: Mulai Trial -->
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
                  <h3 class="text-[20px] font-medium mb-2 leading-tight" style="color: #ffffff;">Coba Santap Sekarang</h3>
                  <p class="text-[13.5px] leading-relaxed" style="color: rgba(255, 255, 255, 0.75);">
                    Mulai digitalisasi kasir tanpa komitmen. Dibangun oleh tim yang understand operasional restoran Indonesia.
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

                <!-- Sub-card A: Konsultasi -->
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
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Hubungi Tim Kami</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Tanya tentang Santap, workflow Anda, atau butuh bantuan setup khusus.
                    </p>
                  </div>
                  <NuxtLink
                    to="/contact"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 hover:!text-white"
                    style="color: rgba(255, 255, 255, 0.75);"
                  >
                    Hubungi Kami
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </NuxtLink>
                </div>

                <!-- Sub-card B: Learn More -->
                <div
                  class="border rounded-2xl p-7 flex flex-col justify-between"
                  style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
                >
                  <div>
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style="background-color: rgba(255,255,255,0.08);">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Learn</span>
                    </div>
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Tentang Santap</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Pelajari fitur, pricing, dan bagaimana Santap membantu ribuan merchant.
                    </p>
                  </div>
                  <NuxtLink
                    to="/features"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 hover:!text-white"
                    style="color: rgba(255, 255, 255, 0.75);"
                  >
                    Explore Features
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

useHead({
  title: 'Tim Kami — Santap',
  meta: [
    { name: 'description', content: 'Kenali tim Sekeco di balik Santap: product engineers, designers, dan hospitality experts yang membangun POS terbaik untuk restoran Indonesia.' }
  ]
})

const mainRef = ref<HTMLElement | null>(null)
let ctx: any = null

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // ─── Helper: animate satu section ─────────────────────────────────────
      const animateSection = (secEl: HTMLElement | null) => {
        if (!secEl) return

        const leftCol    = secEl.querySelector<HTMLElement>('.cmp-left')
        const rightItems = secEl.querySelectorAll<HTMLElement>('.cmp-right-item')

        // LEFT: fade in + slide dari bawah
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
          })
        }
      }

      // Animate all sections
      const sections = mainRef.value?.querySelectorAll('section[aria-label]')
      sections?.forEach(sec => animateSection(sec as HTMLElement))

      // ─── CTA Section: left heading + right cards ──────────────────────────────
      const ctaSec = mainRef.value?.querySelector('[aria-label="Bergabung dengan Santap"]')
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
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(
        mainRef.value?.querySelectorAll('.cmp-left, .cmp-right-item') ?? [],
        { opacity: 1, x: 0, y: 0, clearProps: 'all' }
      )
    })
  }, mainRef.value ?? undefined)
})

onUnmounted(() => { ctx?.revert() })

const teamRoles = [
  {
    title: 'Product Engineers',
    desc: 'Full-stack, infrastructure, mobile. Mereka build architecture yang scalable, secure, dan performant untuk Santap handle millions of transactions.',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100 4m0-4a2 2 0 110 4m0 0a2 2 0 110 4m0-4a2 2 0 100 4'
  },
  {
    title: 'Designers',
    desc: 'UX, UI, visual. Mereka ensure interface Santap simple, intuitive, dan beautiful. Focus pada user experience yang frictionless.',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
  },
  {
    title: 'Product Managers',
    desc: 'Strategy, user research, roadmap. Mereka understand market, user needs, dan business goals. Guide team untuk build products yang meaningful.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    title: 'Hospitality Consultants',
    desc: 'Bukan pure tech people. Mereka understand operasional restoran, workflow kasir, pain points di dapur. Bridge antara tech dan real-world needs.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]

const cultureItems = [
  {
    title: 'Open & Transparent',
    desc: 'Kami transparent tentang roadmap, challenges, decisions. Bukan hidden agendas. Semua orang understand why kami build apa yang kami build.'
  },
  {
    title: 'Product-Oriented',
    desc: 'Kami tidak service agency yang execute brief. Kami product team yang own outcome. Care tentang long-term viability dan user satisfaction.'
  },
  {
    title: 'Sustainable Pace',
    desc: 'Kami respect work-life balance. No crunch culture. Talented people deliver best work ketika mereka fresh, tidak burned out.'
  },
  {
    title: 'Learning & Mastery',
    desc: 'Invest dalam skill development. Budget untuk courses, conferences, dan learning. Continuous improvement adalah culture kami.'
  },
  {
    title: 'Diversity & Inclusion',
    desc: '40% tim adalah women. Team dari 10+ backgrounds. Diversity dalam thinking adalah competitive advantage kami.'
  },
  {
    title: 'User-Centric',
    desc: 'Regular user research, feedback loops, beta programs. Keputusan based pada data dan user insights, bukan hunches.'
  }
]
</script>
