<template>
  <main ref="mainRef" class="overflow-x-clip w-full">

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
        src="https://res.cloudinary.com/drohf7ab1/image/upload/f_auto,q_auto/company-hero"
        alt="Barista sedang menyiapkan kopi di cafe modern"
        class="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
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

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
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
          <div class="flex flex-col gap-12">
            <div
              v-for="(val, i) in values"
              :key="i"
              class="cmp-right-item flex flex-col gap-4"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path :d="val.icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3 class="text-[20px] font-medium text-[var(--color-text-primary)]">{{ val.title }}</h3>
              </div>
              <p class="text-[14.5px] leading-relaxed text-[var(--color-text-secondary)]">
                {{ val.desc }}
              </p>
            </div>
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

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        <!-- Left Column: Heading -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Ekosistem & Kemitraan</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-8"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Tim Pengembang & Mitra Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-12 max-w-sm">
            Santap dikembangkan secara penuh oleh Sekeco Studio. Kami terus membangun teknologi POS cloud modern dan membuka peluang kemitraan dengan bisnis F&B Indonesia.
          </p>
        </div>

        <!-- Right Column: Sekeco Developer (Top) & Coming Soon Mitra (Bottom) -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Featured Developer Card: Sekeco Studio -->
          <div class="featured-cafe-card p-8 md:p-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden transition-all duration-300 hover:border-[var(--color-primary)]/40 hover:shadow-xl">
            <div class="flex-1 z-10 space-y-3">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[11px] font-bold uppercase tracking-wider">
                <span class="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                Tim Pengembang Utama
              </div>
              <h3 class="text-[24px] font-semibold text-[var(--color-text-primary)] tracking-tight">
                Sekeco Studio
              </h3>
              <p class="text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
                Sekeco adalah tim product engineer & digital studio di balik <strong>Santap POS</strong>. Berbasis di Sleman, Yogyakarta, kami merancang arsitektur cloud, antarmuka intuitif, dan stabilitas tinggi untuk operasional kasir bisnis kuliner Indonesia.
              </p>
              <div class="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="https://sekeco.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[var(--color-primary)] hover:underline"
                >
                  Kunjungi Sekeco
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                </a>
                <span class="text-xs text-[var(--color-text-tertiary)]">• Sleman, Yogyakarta</span>
              </div>
            </div>

            <!-- Logo Sekeco -->
            <div class="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-4 flex items-center justify-center flex-shrink-0 z-10 shadow-sm transition-transform duration-300 hover:scale-105">
              <img
                src="/images/sekeco.avif"
                alt="Sekeco Studio Logo"
                class="w-full h-full object-contain"
              />
            </div>
            <div class="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-br from-[var(--color-primary-light)] to-transparent opacity-40 rounded-full blur-2xl -mr-16 -mb-16 pointer-events-none"></div>
          </div>

          <!-- Bottom Section: Coming Soon — Masih Mencari Mitra -->
          <div class="p-8 rounded-2xl border border-dashed border-[var(--color-primary)]/30 bg-[var(--color-bg-surface)] relative overflow-hidden space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[10.5px] font-bold uppercase tracking-widest mb-2">
                  Coming Soon
                </div>
                <h4 class="text-[20px] font-semibold text-[var(--color-text-primary)]">
                  Terbuka untuk Mitra
                </h4>
                <p class="text-[13.5px] text-[var(--color-text-secondary)] mt-1 max-w-lg">
                  Kami aktif membuka peluang kolaborasi dengan merchant restoran perintis, mitra hardware kasir, dan penyedia integrasi pembayaran.
                </p>
              </div>
              <NuxtLink
                to="/contact"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] !text-white text-[12px] font-bold uppercase tracking-wider hover:opacity-90 transition-all flex-shrink-0 self-start sm:self-center no-underline"
              >
                Ajukan Kemitraan
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
            </div>

            <!-- Grid Coming Soon Slots -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div
                v-for="(slot, i) in comingSoonSlots"
                :key="i"
                class="partner-logo-card p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] flex flex-col justify-between min-h-[150px] relative overflow-hidden group hover:border-[var(--color-primary)]/40 transition-all"
              >
                <div class="z-10 flex flex-col items-start gap-1">
                  <span class="inline-block text-[9px] font-semibold uppercase px-2 py-0.5 rounded bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-0.5">
                    Coming Soon
                  </span>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    {{ slot.category }}
                  </span>
                </div>
                <div class="z-10 my-auto pt-1">
                  <p class="text-[13.5px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                    {{ slot.title }}
                  </p>
                  <p class="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
                    Slot Terbuka
                  </p>
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
                  <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Solusi Handal & Scalable</span>
                </div>
              </div>

              <h2
                class="font-medium leading-[1.05] tracking-tight mb-6"
                style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF;"
              >
                Solusi Kasir Cloud <span
                  style="
                    background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  "
                >Terpercaya & Handal.</span>
              </h2>
              <p class="text-[14.5px] leading-[1.75] max-w-sm" style="color: rgba(255,255,255,0.55);">
                Santap hadir dengan arsitektur cloud modern untuk memastikan transaksi bisnis F&B Anda berjalan cepat dan tanpa kendala.
              </p>

              <!-- Proof stat row -->
              <div class="flex items-center gap-6 mt-8">
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none" style="color: #ffffff;">100%</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255, 255, 255, 0.65);">Cloud Real-Time</p>
                </div>
                <div class="w-px self-stretch" style="background-color: rgba(255,255,255,0.15);"></div>
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none" style="color: #ffffff;">Up To Date</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255, 255, 255, 0.65);">Update Fitur Terbaru</p>
                </div>
                <div class="w-px self-stretch" style="background-color: rgba(255,255,255,0.15);"></div>
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none" style="color: #ffffff;">99.9%</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255, 255, 255, 0.65);">Uptime Sistem</p>
                </div>
              </div>
            </div>

            <!-- Contact info -->
            <div class="hidden lg:flex flex-col mt-8">
              <div class="h-px" style="background-color: rgba(255,255,255,0.1);"></div>
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
                
                <!-- Huge Faint Background Icon -->
                <div class="absolute -top-8 -right-8 w-36 h-36 text-[var(--color-primary)] opacity-[0.08] pointer-events-none select-none z-0">
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                
                <div class="flex-1 relative z-10">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">Mitra Merchant</span>
                  </div>
                  <h3 class="text-[20px] font-medium mb-2 leading-tight" style="color: #ffffff;">Daftarkan Restoran atau Cafe Anda</h3>
                  <p class="text-[13.5px] leading-relaxed" style="color: rgba(255, 255, 255, 0.75);">
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
                  class="border rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden"
                  style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
                >
                  <!-- Huge Faint Background Icon -->
                  <div class="absolute -top-6 -right-6 w-28 h-28 text-white opacity-[0.03] pointer-events-none select-none z-0">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M8 9l3 3-3 3M13 15h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>

                  <div class="relative z-10">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Mitra Integrasi</span>
                    </div>
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Sambungkan Sistem Anda via API</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Integrasikan e-wallet, delivery platform, atau sistem akuntansi dengan API terbuka Santap.
                    </p>
                  </div>
                  <NuxtLink
                    to="/contact"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 hover:!text-white relative z-10"
                    style="color: rgba(255, 255, 255, 0.75);"
                  >
                    Hubungi Tim API
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </NuxtLink>
                </div>
 
                <!-- Sub-card B: Kemitraan / Reseller -->
                <div
                  class="border rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden"
                  style="background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.08);"
                >
                  <!-- Huge Faint Background Icon -->
                  <div class="absolute -top-6 -right-6 w-28 h-28 text-white opacity-[0.03] pointer-events-none select-none z-0">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>

                  <div class="relative z-10">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Program Reseller</span>
                    </div>
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Jadi Mitra Reseller Santap</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Dapatkan komisi menarik dengan merekomendasikan Santap ke jaringan restoran dan cafe Anda.
                    </p>
                  </div>
                  <NuxtLink
                    to="/contact"
                    class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-all hover:gap-3 hover:!text-white relative z-10"
                    style="color: rgba(255, 255, 255, 0.75);"
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

  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 400)
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 800)
})

const comingSoonSlots = [
  { category: 'Mitra Restoran', title: 'Merchant F&B Perintis' },
  { category: 'Hardware POS', title: 'Integrasi Kasir & Printer' },
  { category: 'Rekan Pemasaran', title: 'Affiliate & Promoter' },
]

onUnmounted(() => { ctx?.revert() })
useSeoMeta({
  title: 'Mitra & Perusahaan Santap — Solusi POS Merchant F&B oleh Sekeco',
  description: 'Kenali visi, komitmen, dan pilar kerja Santap dalam memberdayakan merchant F&B di seluruh Indonesia lewat teknologi POS cloud modern.',
  ogTitle: 'Mitra & Perusahaan — Santap',
  ogDescription: 'Solusi POS cloud terpercaya & handal untuk F&B Indonesia oleh Sekeco Studio.',
  ogImage: '/images/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Mitra & Perusahaan — Santap',
  twitterDescription: 'Solusi POS cloud terpercaya & handal untuk F&B Indonesia oleh Sekeco Studio.',
})

// Breadcrumb JSON-LD — jejak navigasi untuk rich result + konteks AI crawler.
usePageSeo({
  breadcrumbs: [
    { name: 'Beranda', item: '/' },
    { name: 'Perusahaan', item: '/company' },
  ],
})
const values = [
  {
    title: 'Inovasi Terus Menerus',
    desc: 'Kami terus update POS cloud agar selaras dengan tren F&B terkini dan kebutuhan merchant.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  },
  {
    title: 'Ketulusan Melayani',
    desc: 'Support WhatsApp kami siap 24/7 karena restoran tidak pernah tutup.',
    icon: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'
  },
  {
    title: 'Kemitraan Adil',
    desc: 'Tanpa biaya tersembunyi. Harga transparan untuk keberlanjutan bisnis kita bersama.',
    icon: 'M12 3v18M3 7l9-4 9 4M7 7l-2.5 5.5a2.5 2.5 0 005 0L7 7zm10 0l-2.5 5.5a2.5 2.5 0 005 0L17 7z'
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
