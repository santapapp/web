<template>
  <main ref="mainRef">

    <!-- ── HERO — Curtain Reveal ──────────────────────────── -->
    <AppPageHeroCurtain
      badge="Tentang Kami"
      line1="Restoran Anda,"
      line2="Semestinya Lebih Mudah."
      aria-label="Tentang Kami"
      scroll-target="about-overview"
    >
      Kami membangun teknologi untuk bisnis kuliner Indonesia. <span style="color: var(--color-text-primary); font-weight: 500;">Bukan kompleks. Bukan mahal. Bukan lemot.</span> Hanya operasi yang sederhana dan cepat.
    </AppPageHeroCurtain>

    <!-- ══════════════════════════════════════════════════════
         IMMERSIVE DARK SECTION — warm kitchen visual + large white text overlay
         ══════════════════════════════════════════════════════ -->
    <section
      id="about-overview"
      class="relative mx-3 my-6 md:mx-5 rounded-2xl overflow-hidden"
      style="min-height: 55vh; display: flex; flex-direction: column; justify-content: center;"
      aria-label="Visi Santap"
    >
      <!-- Background image -->
      <img
        src="https://res.cloudinary.com/drohf7ab1/image/upload/f_auto,q_auto/about-hero"
        alt="Interior restoran yang hangat dan nyaman"
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
            <span class="text-[10px] font-bold uppercase tracking-[0.18em]" style="color: rgba(255,255,255,0.75);">Filosofi Produk</span>
          </div>
        </div>

        <!-- Large descriptive text -->
        <AppTextWordReveal
          class="font-medium leading-[1.12] tracking-tight max-w-[950px]"
          style="font-size: clamp(26px, 4vw, 52px); color: #FFFFFF;"
          text="Santap lahir dari apa yang benar-benar dibutuhkan oleh kasir, koki, dan pemilik restoran lokal di Indonesia."
        />
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         STORY & VISION SECTION — premium split layout
         ══════════════════════════════════════════════════════ -->
    <section
      id="about-content"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Visi Misi & Sejarah"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        <!-- Left Column: Heading -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Kilas Balik</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-8"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Mengapa Santap Ada
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-12 max-w-sm">
            Dari observasi mendalam terhadap masalah operasional restoran Indonesia, kami membangun solusi yang benar-benar mudah digunakan.
          </p>
        </div>

        <!-- Right Column: Story Narration -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-12">
            <div class="cmp-right-item">
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">Inovasi Produk Baru 2026</h3>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)] mb-4">
                Santap lahir di tahun 2026 dari program riset & pengembangan tim magang di Sekeco Studio. Kami melihat langsung tantangan nyata operasional kasir UMKM F&B: alur pesan manual yang lambat, kerumitan pencatatan, dan sistem lama yang kaku.
              </p>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
                Dari temuan riset tersebut, Sekeco memutuskan untuk membangun produk POS mobile berbasis cloud yang dirancang khusus dari nol untuk bisnis kuliner Indonesia — ringan, cepat, dan mudah digunakan.
              </p>
            </div>

            <div class="cmp-right-item">
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">Hari Ini: Siap Memberdayakan Bisnis F&B</h3>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)] mb-4">
                Santap hadir dan dirancang khusus untuk membantu restoran, kafe, dan UMKM F&B di Indonesia agar dapat mengelola operasional kasir secara modern, cepat, dan efisien sejak hari pertama.
              </p>
              <p class="text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
                Dan yang paling penting? Kami tetap simple. Tetap cepat. Tetap dapat diandalkan. Semua karena fokus kami tetap sama: bagaimana bikin operasi restoran Anda menjadi jauh lebih mudah.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CORE PILLARS SECTION — 3 Columns Grid
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Pilar Utama"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <!-- Left title -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Prinsip Kerja</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-6"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Pilar Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Nilai-nilai yang memandu setiap keputusan produk dan layanan yang kami buat.
          </p>
        </div>

        <!-- Right: Pillars list -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-12">
            <div v-for="pillar in pillars" :key="pillar.title" class="cmp-right-item flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path :d="pillar.icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3 class="text-[20px] font-medium text-[var(--color-text-primary)]">{{ pillar.title }}</h3>
              </div>
              <p class="text-[14.5px] leading-relaxed text-[var(--color-text-secondary)]">
                {{ pillar.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         MILESTONES TIMELINE SECTION — premium interactive timeline
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Milestone Perusahaan"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <!-- Left: description -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Perjalanan</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-6"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Milestone Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Perjalanan riset dan pengembangan Santap hingga siap digunakan oleh perintis F&B di seluruh Indonesia.
          </p>
        </div>

        <!-- Right: Milestones timeline -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-12">
            <div 
              v-for="(milestone, i) in milestones" 
              :key="i"
              class="cmp-right-item flex flex-col gap-3"
            >
              <span class="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-[var(--color-primary-light)] text-[var(--color-primary)] tracking-wide w-fit">
                {{ milestone.year }}
              </span>
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)]">{{ milestone.title }}</h3>
              <p class="text-[14.5px] leading-relaxed text-[var(--color-text-secondary)]">
                {{ milestone.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         OFFICE LOCATION SECTION
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Lokasi Kantor"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <!-- Left: description -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Lokasi</p>
          <h2
            class="font-medium tracking-tight leading-[1.1]"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary); margin-bottom: 1.5rem;"
          >
            Lokasi Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm" style="margin-bottom: 1.5rem;">
            Kami berbasis di Sleman, Daerah Istimewa Yogyakarta. Silakan lihat peta lokasi kantor kami di samping.
          </p>
          <p class="text-[14px] text-[var(--color-text-primary)] font-semibold leading-relaxed">
            PT Sarwa Kalyana Cara (Sekeco)<br>
            Sleman, D.I. Yogyakarta, Indonesia
          </p>
        </div>

        <!-- Right: Map iframe -->
        <div class="lg:col-span-8">
          <div class="cmp-right-item">
            <div
              class="relative w-full overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-1)]"
              style="height: clamp(280px, 45vh, 480px);"
            >
              <iframe
                src="https://maps.google.com/maps?q=Kabupaten%20Sleman%2C%20Daerah%20Istimewa%20Yogyakarta%2C%20Indonesia&z=12&output=embed"
                class="absolute inset-0 w-full h-full"
                style="border: 0; filter: grayscale(0.1) contrast(1.02);"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Lokasi Santap — Kabupaten Sleman, Daerah Istimewa Yogyakarta"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CTA SECTION — Dark theme above footer
         ══════════════════════════════════════════════════════ -->
    <section
      id="about-cta"
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Bergabung bersama Santap"
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
                  <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Mulai Perjalanan</span>
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
                >Terpercaya & Handal.</span>
              </h2>
              <p class="text-[14.5px] leading-[1.75] max-w-sm" style="color: rgba(255,255,255,0.55);">
                Santap bukan hanya kasir, tapi sistem complete untuk manage outlets, staff, inventory, dan decision-making berbasis data real-time.
              </p>

              <!-- Proof stat row -->
              <div class="flex items-center gap-6 mt-8">
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none" style="color: #ffffff;">100%</p>
                  <p class="text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style="color: rgba(255, 255, 255, 0.65);">Cloud Real-Time</p>
                </div>
                <div class="w-px self-stretch" style="background-color: rgba(255,255,255,0.15);"></div>
                <div>
                  <p class="text-[28px] font-bold tracking-tight text-white leading-none" style="color: #ffffff;">Up to Date</p>
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
                  <h3 class="text-[20px] font-medium mb-2 leading-tight" style="color: #ffffff;">Gratis 14 Hari Trial</h3>
                  <p class="text-[13.5px] leading-relaxed" style="color: rgba(255, 255, 255, 0.75);">
                    Mulai digitalisasi kasir tanpa komitmen. Akses penuh ke semua fitur core: order management, KDS, payment, laporan. Tidak ada kartu kredit diperlukan.
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
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Konsultasi Kebutuhan</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Tim kami siap memahami workflow spesifik bisnis Anda dan recommend setup yang tepat. Gratis, no obligation.
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
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Chat dengan Tim Kami</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Ada pertanyaan? Hubungi kami via WhatsApp. Real humans, not chatbot. Response dalam 2 jam (jam kerja).
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

useSeoMeta({
  title: 'Tentang Santap — POS Cloud untuk Kuliner Indonesia',
  description: 'Kenali kisah berdirinya, misi utama, dan perjalanan tim Santap dalam menghadirkan solusi teknologi POS cloud untuk ekosistem kuliner di Indonesia.',
  ogTitle: 'Tentang Kami — Santap',
  ogDescription: 'Kenali kisah, visi, dan milestone perjalanan Santap membangun solusi POS cloud untuk bisnis kuliner Indonesia.',
  ogImage: '/images/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Tentang Kami — Santap',
  twitterDescription: 'Kisah, visi, dan milestone perjalanan Santap membangun solusi POS cloud untuk bisnis kuliner Indonesia.',
})

// Breadcrumb JSON-LD — jejak navigasi untuk rich result + konteks AI crawler.
usePageSeo({
  breadcrumbs: [
    { name: 'Beranda', item: '/' },
    { name: 'Tentang Kami', item: '/about-us' },
  ],
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

      // Animate story section
      const aboutContent = mainRef.value?.querySelector<HTMLElement>('[aria-label="Visi Misi & Sejarah"]')
      if (aboutContent) animateSection(aboutContent)

      // Animate pillars section
      const pilarsSec = mainRef.value?.querySelector<HTMLElement>('[aria-label="Pilar Utama"]')
      if (pilarsSec) animateSection(pilarsSec)

      // Animate milestones section
      const milestonesSec = mainRef.value?.querySelector<HTMLElement>('[aria-label="Milestone Perusahaan"]')
      if (milestonesSec) animateSection(milestonesSec)

      // ─── CTA Section: left heading + right cards ──────────────────────────────
      const ctaSec = mainRef.value?.querySelector<HTMLElement>('[aria-label="Bergabung bersama Santap"]')
      if (ctaSec) {
        const leftCol = ctaSec.querySelector<HTMLElement>('.lg\\:col-span-5')
        const rightCards = ctaSec.querySelectorAll<HTMLElement>('.lg\\:col-span-7 > div > div')

        if (leftCol) {
          gsap.set(leftCol, { opacity: 0, y: 32 })
          gsap.to(leftCol, {
            scrollTrigger: { trigger: leftCol, start: 'top 80%' },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
          })
        }

        if (rightCards.length) {
          const cardsArray = Array.from(rightCards)
          gsap.set(cardsArray, { opacity: 0, x: 30 })
          gsap.to(cardsArray, {
            scrollTrigger: { trigger: ctaSec, start: 'top 80%' },
            opacity: 1,
            x: 0,
            duration: 1.0,
            ease: 'power3.out',
            stagger: 0.12,
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

  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 400)
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 800)
})

onUnmounted(() => { ctx?.revert() })
const pillars = [
  {
    title: 'Simplicity Wins',
    desc: 'Setiap fitur harus benar-benar memecahkan masalah. Interface bersih, training cepat, adoption tinggi. Tidak ada fitur jarang dipakai.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    title: 'Speed is a Feature',
    desc: 'Response time <100ms, order ke KDS <500ms. Peak hours tetap smooth. Restoran tidak bisa tunggu—sistem lambat = chaos operasional.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    title: 'Built for Indonesia',
    desc: 'Bukan port dari sistem luar. Kami understand PBF regulasi, multi-currency, local payment methods, multi-outlet chains, dan mobile-first mentality.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    title: 'No Surprises',
    desc: 'Transparan tentang biaya, uptime, dan limitations. Tidak ada fee tersembunyi. Jika ada masalah, kami beritahu langsung.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    title: 'People Over Process',
    desc: 'Kami invest di user research, support responsif, dan documentation actionable. Teknologi bagus hanya jika orang bisa gunakan.',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    title: 'Long-term Partnership',
    desc: 'Kami tidak agresif upsell atau pakai pricing sneaky. Long-term trust > short-term revenue. Anda sukses = Kami sukses.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
  }
]

const milestones = [
  {
    year: 'Awal 2026',
    title: 'Riset Tim Magang Sekeco',
    desc: 'Inisiasi produk Santap oleh tim magang di Sekeco Studio melalui observasi langsung terhadap kebutuhan dan masalah operasional kasir F&B.'
  },
  {
    year: 'Mid 2026',
    title: 'Pengembangan & Iterasi',
    desc: 'Pengembangan arsitektur POS cloud, desain antarmuka intuitif, integrasi KDS, dan pengujian alur QRIS secara intensif.'
  },
  {
    year: '2026',
    title: 'Peluncuran Resmi Santap',
    desc: 'Peluncuran resmi platform Santap POS di Play Store sebagai solusi kasir digital modern untuk bisnis kuliner Indonesia.'
  },
  {
    year: 'Masa Depan',
    title: 'Pengembangan Berkelanjutan',
    desc: 'Terus menghadirkan fitur-fitur baru dan menyempurnakan ekosistem Santap berdasarkan masukan langsung dari para merchant.'
  }
]
</script>
