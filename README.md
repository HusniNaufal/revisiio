# revisi.io

Platform manajemen konten dan approval profesional untuk tim kreatif. Dibangun dengan Next.js dan Supabase.

## ✨ Fitur Utama

- **Multi-Role Login** — Super Admin, Creative Lead, Lead Designer, Video Editor, Client, dan Reviewer dengan hak akses berbeda
- **Pipeline Workflow** — Alur status konten: Draft → Review → Revisi → Approved
- **Auto Versioning** — Versi konten otomatis naik saat revisi disetujui (v1.0 → v1.1 → v2.0)
- **Sistem Komentar** — Feedback per versi konten dari Client/Reviewer
- **Manajemen Tim** — Super Admin dapat menambah, mengedit, dan menghapus pengguna
- **Alokasi Tim Klien** — Super Admin dapat menugaskan Creative team kepada masing-masing klien (multi-client architecture)
- **Dashboard Analytics** — Statistik progress konten secara real-time
- **Archive** — Riwayat seluruh konten yang sudah diproses
- **Responsive** — Tampilan mobile-friendly dengan sidebar collapsible

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend & Backend | [Next.js 15](https://nextjs.org/) (App Router + Turbopack) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Deployment | [Vercel](https://vercel.com/) |

## 🚀 Cara Menjalankan Secara Lokal

### 1. Clone repository

```bash
git clone https://github.com/HusniNaufal/revisiio.git
cd revisiio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Dapatkan nilai di atas dari **Supabase Dashboard → Settings → API Keys**

### 4. Setup database

- Buka **Supabase Dashboard → SQL Editor**
- Copy dan jalankan isi file `schema_supabase.sql` (schema awal)
- Jika melakukan upgrade dari versi lama, jalankan juga `migration_v2.sql`
- Schema akan membuat tabel dan data awal secara otomatis

### 5. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

> Dev server menggunakan **Turbopack** untuk hot reload yang lebih cepat.

## 🗄️ Struktur Database

```
users            → Data pengguna & kredensial login
projects         → Data konten/project
project_versions → Riwayat versi per project
comments         → Feedback/komentar per versi
client_teams     → Mapping penugasan CC ke klien (multi-client)
```

## 👤 Akun Default (Setelah Menjalankan Schema)

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Super Admin |
| `akmal` | `akmal123` | Creative Lead |
| `radith` | `radith123` | Lead Designer |
| `dafa` | `dafa123` | Lead Designer |
| `vicky` | `vicky123` | Video Editor |
| `husni` | `husni123` | Client / Reviewer |
| `febri` | `febri123` | Client / Reviewer |

> ⚠️ Ganti password akun setelah pertama kali masuk (melalui halaman Pengaturan)

## 📁 Struktur Project

```
revisiio/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.jsx        # Root layout (termasuk Google Fonts)
│   │   ├── page.jsx          # Halaman utama (state & logic)
│   │   └── globals.css       # Global CSS
│   ├── components/           # Komponen reusable
│   ├── views/                # Halaman: Dashboard, Workflow, Archive, Teams, Settings, Login
│   ├── modals/               # Modal: Create Project, Detail, Create User
│   ├── lib/
│   │   ├── supabase.js       # Inisialisasi Supabase client
│   │   └── supabaseHelpers.js # Fungsi CRUD ke Supabase
│   └── data/
│       └── constants.js      # Data dummy (tidak aktif)
├── schema_supabase.sql        # Script SQL setup database awal
├── migration_v2.sql           # Script SQL untuk upgrade ke versi 2 (tambah tabel client_teams)
├── next.config.mjs
└── tailwind.config.js
```

## 🌐 Deploy

Project ini di-deploy menggunakan **Vercel**. Setiap push ke branch `main` akan otomatis trigger deployment baru.

Pastikan menambahkan Environment Variables di **Vercel Dashboard → Project → Settings → Environment Variables**.

## 📄 Lisensi

Dibuat untuk keperluan mata kuliah **IMPAL** — Semester 4.

