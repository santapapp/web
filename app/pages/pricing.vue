<template>
  <main ref="mainRef" class="overflow-x-clip w-full">

    <!-- ── HERO — Curtain Reveal ──────────────────────────── -->
    <AppPageHeroCurtain
      badge="Harga Paket"
      line1="Harga Jujur."
      line2="Tanpa Kejutan."
      aria-label="Harga Santap"
      scroll-target="pricing-overview"
    >
      Mulai dari Rp 99rb/bulan per outlet. <span style="color: var(--color-text-primary); font-weight: 500;">Gratis 14 hari.</span>
    </AppPageHeroCurtain>

    <!-- ══════════════════════════════════════════════════════
         IMMERSIVE DARK SECTION — food image + large white text overlay
         (Matching features page design layout exactly)
         ══════════════════════════════════════════════════════ -->
    <section
      id="pricing-overview"
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
         PRICING GRID SECTION — clean and spacious
         ══════════════════════════════════════════════════════ -->
    <section
      id="pricing-content"
      ref="plansSecRef"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Pilihan Paket"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <!-- Billing Toggle Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16 prc-billing-row">
        <div>
          <h2 class="text-2xl md:text-3xl font-medium tracking-tight text-[var(--color-text-primary)]">
            Pilih Paket Anda
          </h2>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">
            Upgrade atau turun kapan saja. Gratis 14 hari trial semua paket.
          </p>
        </div>

        <!-- Toggle Pill Switch -->
        <div class="inline-flex items-center gap-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-1 rounded-full self-start sm:self-auto">
          <button
            @click="isAnnual = false"
            class="px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.06em] transition-all cursor-pointer"
            :class="!isAnnual ? 'bg-[var(--color-text-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
          >
            Bulanan
          </button>
          <button
            @click="isAnnual = true"
            class="px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.06em] transition-all cursor-pointer flex items-center gap-1.5"
            :class="isAnnual ? 'bg-[var(--color-text-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
          >
            Tahunan
            <span
              class="px-1.5 py-0.5 rounded text-[9px] font-extrabold normal-case tracking-normal"
              :class="isAnnual ? 'bg-white/20 text-white' : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'"
            >
              Hemat 20%
            </span>
          </button>
        </div>
      </div>

      <!-- Pricing Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="prc-plan-card flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300"
          :class="plan.featured
            ? 'bg-[var(--color-bg-surface)] border-[var(--color-primary)] shadow-[0_8px_32px_rgba(0,0,0,0.04)] lg:scale-105 z-10'
            : 'bg-transparent border-[var(--color-border)] hover:border-[var(--color-border-strong)]'"
        >
          <!-- Top section -->
          <div>
            <!-- Badge for featured -->
            <div class="flex justify-between items-center mb-6">
              <span
                class="text-[10px] font-bold uppercase tracking-[0.15em]"
                :style="`color: ${plan.featured ? 'var(--color-primary)' : 'var(--color-text-tertiary)'};`"
              >
                {{ plan.badge }}
              </span>
              <span
                v-if="plan.featured"
                class="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.06em] bg-[var(--color-primary)] text-white"
              >
                Paling Populer
              </span>
            </div>

            <!-- Title & Desc -->
            <h3 class="text-2xl font-medium tracking-tight text-[var(--color-text-primary)] mb-2">
              {{ plan.name }}
            </h3>
            <p class="text-[13.5px] leading-relaxed text-[var(--color-text-secondary)] mb-6">
              {{ plan.desc }}
            </p>

            <!-- Price -->
            <div class="flex items-baseline gap-1 mb-8 border-b pb-8 border-[var(--color-border)]">
              <span class="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {{ isAnnual ? plan.priceAnnual : plan.priceMonthly }}
              </span>
              <span v-if="plan.showPeriod" class="text-xs text-[var(--color-text-tertiary)]">
                / outlet / bln
              </span>
            </div>

            <!-- Features list -->
            <p class="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-primary)] mb-4">
              Fitur yang Termasuk:
            </p>
            <ul class="flex flex-col gap-3.5 mb-8">
              <li
                v-for="feat in plan.features"
                :key="feat"
                class="flex items-start gap-3"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-[var(--color-primary)] mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-[13.5px] text-[var(--color-text-secondary)] leading-none">{{ feat }}</span>
              </li>
            </ul>
          </div>

          <!-- Bottom Button -->
          <NuxtLink
            :to="plan.ctaLink"
            class="inline-flex items-center justify-center py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] no-underline transition-all hover:-translate-y-px"
            :style="plan.featured
              ? 'background-color: var(--color-text-primary); color: #FFFFFF;'
              : 'background-color: transparent; color: var(--color-text-primary); border: 1px solid var(--color-border);'"
          >
            {{ plan.ctaLabel }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         FAQ SECTION — clean accordion row list
         ══════════════════════════════════════════════════════ -->
    <section
      ref="faqSecRef"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Tanya Jawab"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <!-- Left: header -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start cmp-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">FAQ</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-5"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Tanya Jawab
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Jawaban umum tentang berlangganan, pembatalan, dan pembayaran.
          </p>
        </div>

        <!-- Right: Accordion rows -->
        <div class="lg:col-span-8">
          <div class="h-px bg-[var(--color-border)]"></div>

          <div v-for="(item, i) in faqItems" :key="i" class="cmp-right-item">
            <button
              class="accordion-trigger w-full flex items-center justify-between gap-6 bg-transparent border-none cursor-pointer text-left transition-all duration-250"
              :class="[
                openFaq !== null && openFaq !== i
                  ? 'opacity-35 hover:opacity-60'
                  : 'opacity-100',
                openFaq === i ? 'pt-12 md:pt-16 pb-8 md:pb-10' : 'py-10 md:py-14'
              ]"
              @click="toggleFaq(i)"
              :aria-expanded="openFaq === i"
              :aria-controls="`faq-panel-${i}`"
            >
              <!-- Number + Title — allow full wrap, no truncate -->
              <div class="flex items-start gap-5 md:gap-10 min-w-0 flex-1">
                <span
                  class="flex-shrink-0 font-medium tabular-nums leading-tight mt-1"
                  style="font-size: clamp(18px, 2.2vw, 28px); color: var(--color-text-tertiary);"
                >0{{ i + 1 }}.</span>
                <span
                  class="font-medium tracking-[-0.025em] leading-[1.08]"
                  style="font-size: clamp(28px, 4.5vw, 58px); color: var(--color-text-primary); white-space: normal; word-break: normal;"
                >
                  {{ item.question }}
                </span>
              </div>

              <!-- Icon -->
              <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 transition-all duration-200"
                   style="color: var(--color-text-tertiary);">
                <template v-if="openFaq === i">
                  <!-- minus — -->
                  <svg width="22" height="2" viewBox="0 0 22 2" fill="none" aria-hidden="true">
                    <path d="M1 1h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </template>
                <template v-else>
                  <!-- plus + -->
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 1v18M1 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </template>
              </div>
            </button>

            <!-- Slide down content wrapper -->
            <div
              :id="`faq-panel-${i}`"
              class="accordion-panel"
              :class="openFaq === i ? 'panel-open' : ''"
              role="region"
            >
              <div class="accordion-inner">
                <div class="pb-12 md:pb-16 pl-[calc(clamp(18px,2.2vw,28px)+1.25rem)] md:pl-[calc(clamp(18px,2.2vw,28px)+2.5rem)]">
                  <p class="text-[15px] leading-[1.75] text-[var(--color-text-secondary)] max-w-[680px]">
                    {{ item.answer }}
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
         CUSTOM PRICING TRUST SECTION — same design style as index, customized content
         ══════════════════════════════════════════════════════ -->
    <section
      ref="trustSecRef"
      class="relative"
      style="background-color: #111009;"
      aria-label="Transparansi & Jaminan"
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
            <div
              class="prc-trust-badge inline-flex items-center gap-3 px-4 py-2 rounded-md border w-fit"
              style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
            >
              <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
              <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Jaminan Kami</span>
            </div>

            <!-- Heading -->
            <div class="prc-trust-heading">
              <h2
                class="font-medium leading-[1.08] tracking-tight"
                style="font-size: clamp(30px, 4.5vw, 56px); color: #FFFFFF;"
              >
                Komitmen kami pada <span
                  style="
                    background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  "
                >transparansi & keadilan.</span>
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
              class="prc-trust-row"
            >
              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-16 items-center group">
                
                <!-- Col 1: Huge Number -->
                <div class="md:col-span-3 flex items-baseline justify-start">
                  <span
                    class="font-extrabold tracking-tighter leading-none select-none pointer-events-none tabular-nums"
                    style="font-size: clamp(56px, 6.5vw, 84px); color: rgba(255, 255, 255, 0.05); font-family: var(--font-body);"
                  >{{ focus.number }}</span>
                </div>

                <!-- Col 2: Title & Description & Tags -->
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
      id="pricing-cta"
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
                Harga yang adil untuk <span
                  style="
                    background: linear-gradient(100deg, #FFFFFF 0%, var(--color-primary) 55%, #FFA550 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  "
                >kesuksesan Anda.</span>
              </h2>
              <p class="text-[14.5px] leading-[1.75] max-w-sm" style="color: rgba(255,255,255,0.55);">
                Tanpa biaya tersembunyi, tanpa komitmen jangka panjang. Coba gratis selama 14 hari.
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
                  <h3 class="text-[20px] font-medium mb-2 leading-tight" style="color: #ffffff;">Coba Semua Paket</h3>
                  <p class="text-[13.5px] leading-relaxed" style="color: rgba(255, 255, 255, 0.75);">
                    Akses penuh ke semua fitur tanpa komitmen. Batalkan kapan saja tanpa pertanyaan.
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
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Konsultasi Paket</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Butuh paket custom? Tim sales kami siap membantu menemukan solusi terbaik untuk bisnis Anda.
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
                    <h3 class="text-[17px] font-medium mb-2 leading-snug" style="color: #ffffff;">Hubungi Tim Sales</h3>
                    <p class="text-[13px] leading-relaxed mb-6" style="color: rgba(255, 255, 255, 0.65);">
                      Ada pertanyaan tentang harga atau fitur? Chat langsung dengan tim kami via WhatsApp.
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

useHead({
  title: 'Harga Langganan — Santap',
  meta: [
    { name: 'description', content: 'Pilihan paket berlangganan aplikasi kasir mobile Santap. Dapatkan paket Starter, Pro, atau Enterprise sesuai kebutuhan restoran Anda.' }
  ]
})
const isAnnual = ref(false)

const openFaq = ref<number | null>(0)
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

// ── Refs for scroll animations ───────────────────────────
const mainRef     = ref<HTMLElement | null>(null)
const plansSecRef = ref<HTMLElement | null>(null)
const faqSecRef   = ref<HTMLElement | null>(null)
const trustSecRef = ref<HTMLElement | null>(null)
let ctx: any = null

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // ── Plans section: billing row + plan cards ──────────────
      if (plansSecRef.value) {
        const billingRow = plansSecRef.value.querySelector<HTMLElement>('.prc-billing-row')
        const planCards  = plansSecRef.value.querySelectorAll<HTMLElement>('.prc-plan-card')

        if (billingRow) {
          gsap.set(billingRow, { opacity: 0, y: 18 })
          gsap.to(billingRow, {
            scrollTrigger: { trigger: plansSecRef.value, start: 'top 80%' },
            opacity: 1, y: 0,
            duration: 0.85,
            ease: 'power3.out',
          })
        }

        if (planCards.length) {
          gsap.set(planCards, { opacity: 0, y: 24 })
          gsap.to(planCards, {
            scrollTrigger: { trigger: plansSecRef.value, start: 'top 75%' },
            opacity: 1, y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            delay: 0.15,
          })
        }
      }

      // ── FAQ: sticky-left + staggered rows ───────────────────
      if (faqSecRef.value) {
        const leftCol = faqSecRef.value.querySelector<HTMLElement>('.cmp-left')
        const rows    = faqSecRef.value.querySelectorAll<HTMLElement>('.cmp-right-item')

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

        if (rows.length) {
          gsap.set(rows, { opacity: 0, x: 50 })
          gsap.to(rows, {
            scrollTrigger: { trigger: faqSecRef.value, start: 'top 82%' },
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.14,
          })
        }
      }

      // ── Trust dark section: badge + heading + rows ──────────
      if (trustSecRef.value) {
        const badge   = trustSecRef.value.querySelector<HTMLElement>('.prc-trust-badge')
        const heading = trustSecRef.value.querySelector<HTMLElement>('.prc-trust-heading')
        const rows    = trustSecRef.value.querySelectorAll<HTMLElement>('.prc-trust-row')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: trustSecRef.value,
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
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(
        mainRef.value?.querySelectorAll(
          '.prc-billing-row, .prc-plan-card, .cmp-left, .prc-faq-row, .prc-trust-badge, .prc-trust-heading, .prc-trust-row'
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

const plans = [
  {
    name: 'Starter',
    badge: 'Kios & Kedai Kecil',
    desc: 'Fitur operasional esensial untuk memulai digitalisasi kasir.',
    priceMonthly: 'Rp 89.000',
    priceAnnual: 'Rp 71.200',
    showPeriod: true,
    featured: false,
    ctaLabel: 'Mulai Uji Coba',
    ctaLink: '/#',
    features: [
      'Kasir Mobile (1 akun)',
      'Kitchen Display System',
      'Tunai & QRIS',
      'Laporan Penjualan Dasar',
      'Support via WhatsApp'
    ]
  },
  {
    name: 'Pro',
    badge: 'Cafe & Restoran',
    desc: 'Untuk bisnis berkembang dengan stok dan manajemen staf terpadu.',
    priceMonthly: 'Rp 149.000',
    priceAnnual: 'Rp 119.200',
    showPeriod: true,
    featured: true,
    ctaLabel: 'Coba Pro 14 Hari',
    ctaLink: '/#',
    features: [
      'Multi Kasir & Pelayan',
      'Manajemen Stok & Bahan Baku',
      'Split Bill & Diskon',
      'Dashboard Owner Real-Time',
      'Semua Metode Pembayaran',
      'Prioritas Support 24/7'
    ]
  },
  {
    name: 'Enterprise',
    badge: 'Multi-Outlet & Franchise',
    desc: 'Untuk jaringan franchise dengan laporan konsolidasi tersentralisasi.',
    priceMonthly: 'Hubungi Kami',
    priceAnnual: 'Hubungi Kami',
    showPeriod: false,
    featured: false,
    ctaLabel: 'Hubungi Sales',
    ctaLink: '/contact',
    features: [
      'Unlimited Cabang/Outlet',
      'Stok Terpusat Multi-Lokasi',
      'Menu Konsolider & API',
      'Account Success Manager',
      'SLA Uptime 99.9%',
      'Kustomisasi Spesifik'
    ]
  }
]

const faqItems = [
  {
    question: 'Apakah ada kontrak minimum?',
    answer: 'Tidak ada. Langganan bulanan tanpa komitmen dan dapat dibatalkan kapan saja tanpa penalti.'
  },
  {
    question: 'Berapa biaya per outlet?',
    answer: 'Biaya flat per outlet per bulan. Contoh: 3 outlet paket Pro = 3 x Rp 119.200/bulan.'
  },
  {
    question: 'Apakah ada biaya komisi QRIS?',
    answer: 'Tidak. Santap tidak mengambil komisi penjualan. Biaya QRIS murni dari provider sesuai regulasi Bank Indonesia.'
  },
  {
    question: 'Bisa upgrade atau downgrade kapan saja?',
    answer: 'Ya, bebas upgrade/downgrade. Tagihan disesuaikan otomatis dengan periode sisa bulan aktif.'
  }
]

const focuses = [
  {
    id: 'hidden-fees',
    number: '01',
    title: 'Tanpa Biaya Tersembunyi',
    desc: 'Harga yang tertera adalah harga akhir. Tidak ada komisi penjualan, biaya administrasi, atau biaya aktivasi awal.',
    tags: ['0% Komisi', 'Flat Rate', 'Transparan'],
  },
  {
    id: 'guarantee',
    number: '02',
    title: 'Garansi 14 Hari',
    desc: 'Jika dalam 14 hari tidak puas dengan layanan, kami kembalikan biaya langganan penuh tanpa pertanyaan.',
    tags: ['14 Hari', 'Tanpa Risiko', 'Refund Instant'],
  },
  {
    id: 'onboarding',
    number: '03',
    title: 'Setup & Pelatihan Gratis',
    desc: 'Tim kami memandu setup menu, stok, dan pelatihan kasir secara virtual gratis tanpa biaya tambahan.',
    tags: ['Virtual Setup', 'Training Gratis', 'WhatsApp Support'],
  },
]
</script>

<style scoped>
.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.42s cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-inner {
  overflow: hidden;
  min-height: 0;
}

.panel-open {
  grid-template-rows: 1fr;
}

.accordion-trigger {
  font-family: inherit;
}
</style>
