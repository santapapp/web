# Santap Web

Santap Web adalah aplikasi Nuxt 4 untuk landing page Santap, halaman publik restoran, customer ordering tanpa login, payment order meja, dan entry point open bill dari cashier.

## Setup

Install dependency dengan package manager yang dipakai project:

```bash
bun install
```

Salin env contoh:

```bash
cp .env.example .env
```

Untuk development tanpa `santap-api`, biarkan mock aktif:

```env
NUXT_PUBLIC_USE_MOCK_API=true
```

Jika ingin memakai backend sungguhan:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
NUXT_PUBLIC_USE_MOCK_API=false
```

> Default production (tanpa env) menunjuk ke `https://api.santap.app`. Set `NUXT_PUBLIC_API_BASE_URL` hanya untuk dev lokal / staging.

## Development

```bash
bun run dev
```

Dev server default berjalan di `http://localhost:3000`.

## Quality Gate

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

Catatan: untuk sementara `lint` diarahkan ke `nuxt typecheck` sampai konfigurasi ESLint final ditambahkan.

## Dokumentasi

- [Santap Web routing dan flow](docs/santap_web/README.md)
- [Roadmap implementasi](docs/roadmap.md)

