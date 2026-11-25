# Little Dental World

> *A little universe made just for Caca*

Aplikasi web personal untuk mendukung perjalanan belajar kedokteran gigi, menjaga keseimbangan diri, dan menyimpan momen-momen kecil yang berarti.

## Stack Teknologi
- **Frontend**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS dengan palet Blush Pink (`#F4C8D9`), Soft Pink (`#FBE8EF`), Rose (`#C56F91`), Lavender (`#DCD4F4`), Cream (`#FFFAF4`), Soft Mint (`#E4F1EA`), dan Ink (`#514657`)
- **Backend & Storage (Opsional / Produksi)**: Supabase (Postgres + Auth + Row Level Security + Private Storage)
- **Musik**: Spotify Embed

## Menjalankan Secara Lokal
```bash
npm install
npm run dev
```
Buka `http://localhost:3000`. Tanpa konfigurasi `.env.local`, aplikasi berjalan pada **Mode Demo Lokal** (menggunakan `localStorage` browser dengan data contoh kedokteran gigi).

## Mengaktifkan Supabase (Produksi & Sinkronisasi Lintas Perangkat)
1. Salin `.env.example` menjadi `.env.local` dan isi `NEXT_PUBLIC_SUPABASE_URL` serta `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Jalankan SQL dari `supabase/schema.sql` di SQL Editor proyek Supabase Anda untuk membuat seluruh tabel, kebijakan **Row Level Security (RLS)**, serta bucket privat `private-files`.
3. Jangan pernah menempatkan `SUPABASE_SERVICE_ROLE_KEY` pada kode frontend.
