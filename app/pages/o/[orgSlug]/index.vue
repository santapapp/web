<script setup lang="ts">
definePageMeta({
  layout: 'org',
  middleware: ['org-exists']
})

/**
 * Halaman publik restoran — hanya info statis.
 * Tanpa real menu data (butuh session dari QR meja).
 * User diarahkan scan QR untuk melihat menu dan order.
 */

const route = useRoute()
const config = useRuntimeConfig()
const orgSlug = computed(() => String(route.params.orgSlug || ''))

// Mengambil data organisasi dari database via API
const { data: response, error } = await useFetch<any>(
  `/api/v1/customer/organization/${orgSlug.value}`,
  {
    baseURL: config.public.apiBaseUrl
  }
)

// Validasi jika organisasi tidak ditemukan
if (error.value || !response.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Restoran tidak ditemukan.',
    fatal: true
  })
}

const org = computed(() => response.value?.data)
</script>

<template>
  <section class="page-section">
    <div class="container stack">
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Santap — Pesan Digital</p>
          <div class="org-header">
            <img v-if="org?.logo" :src="org.logo" :alt="org?.name" class="org-logo" />
            <h1>{{ org?.name || orgSlug }}</h1>
          </div>
          <p>
            Scan QR meja Anda untuk melihat menu dan mulai memesan secara digital —
            tanpa perlu memanggil pelayan.
          </p>

          <div class="button-row">
            <NuxtLink class="btn-primary" :to="`/o/${orgSlug}/orders`">
              Lihat Halaman Order
            </NuxtLink>
          </div>
        </div>

        <aside class="content-card stack">
          <span class="badge">Petunjuk Pemesanan</span>
          <h3>Cara Memesan</h3>
          <ol class="steps">
            <li>Scan QR Code di meja Anda</li>
            <li>Pilih menu yang diinginkan</li>
            <li>Klik "Pesan Sekarang"</li>
            <li>Bayar via QRIS</li>
          </ol>
          <p class="muted">QR Code tersedia di setiap meja.</p>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.org-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.org-logo {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.steps {
  padding-left: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.steps li {
  font-size: 15px;
  color: var(--color-text, #1a1714);
  line-height: 1.4;
}
</style>
