# 🎮 MLShop — Jual Beli Akun Mobile Legends

Platform jual beli akun Mobile Legends full stack:
**Frontend** → Vercel (gratis, subdomain `.vercel.app`)
**Backend**  → Railway (gratis $5/bulan credit)
**Database** → Railway PostgreSQL (gratis)
**Gambar**   → Cloudinary (gratis 25GB)

---

## 📁 Struktur File Lengkap

```
mlshop/
│
├── 📂 backend/                     ← Node.js + Express API
│   ├── src/
│   │   ├── index.js                ← Entry point server
│   │   ├── seed.js                 ← Data awal database
│   │   ├── routes/
│   │   │   ├── auth.js             ← Register, Login, Me
│   │   │   ├── accounts.js         ← CRUD akun ML
│   │   │   ├── orders.js           ← Buat & kelola order
│   │   │   ├── users.js            ← Profil, wishlist
│   │   │   ├── admin.js            ← Dashboard admin
│   │   │   └── upload.js           ← Upload gambar
│   │   └── middleware/
│   │       └── auth.js             ← JWT middleware
│   ├── prisma/
│   │   └── schema.prisma           ← Model database
│   ├── .env.example                ← Template environment variable
│   ├── railway.json                ← Konfigurasi Railway deploy
│   └── package.json
│
├── 📂 frontend/                    ← Next.js 14
│   ├── src/
│   │   ├── lib/
│   │   │   └── api.js              ← Helper axios ke backend
│   │   ├── pages/                  ← Buat file di sini:
│   │   │   ├── index.js            ← Halaman utama
│   │   │   ├── login.js
│   │   │   ├── register.js
│   │   │   ├── akun/[id].js        ← Detail akun
│   │   │   ├── keranjang.js
│   │   │   ├── post-akun.js
│   │   │   ├── profil.js
│   │   │   └── admin/
│   │   │       ├── index.js        ← Dashboard admin
│   │   │       ├── akun.js
│   │   │       └── orders.js
│   │   └── components/             ← Buat komponen UI di sini
│   ├── public/                     ← Gambar statis, favicon
│   ├── .env.local.example          ← Template env frontend
│   ├── vercel.json                 ← Konfigurasi Vercel
│   └── package.json
│
└── README.md                       ← File ini
```

---

## 🚀 Cara Deploy (Step by Step)

### STEP 1 — Persiapan Akun Gratis

| Platform    | Link Daftar                    | Fungsi        |
|-------------|-------------------------------|---------------|
| Vercel      | https://vercel.com            | Host frontend |
| Railway     | https://railway.app           | Host backend + DB |
| Cloudinary  | https://cloudinary.com        | Simpan gambar |
| GitHub      | https://github.com            | Simpan kode   |

---

### STEP 2 — Upload Kode ke GitHub

```bash
# Di terminal lokal
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/mlshop.git
git push -u origin main
```

---

### STEP 3 — Deploy Database di Railway

1. Buka https://railway.app → **New Project**
2. Klik **Add Service** → **Database** → **PostgreSQL**
3. Klik database → tab **Connect** → salin **DATABASE_URL**
4. Simpan URL ini, akan dipakai di Step 4

---

### STEP 4 — Deploy Backend di Railway

1. Di project Railway yang sama → **Add Service** → **GitHub Repo**
2. Pilih repo `mlshop`, set **Root Directory** = `backend`
3. Di tab **Variables**, tambahkan:

```
DATABASE_URL    = postgresql://... (dari Step 3)
JWT_SECRET      = (string random panjang, minimal 64 karakter)
FRONTEND_URL    = https://mlshop.vercel.app (isi setelah Step 5)
NODE_ENV        = production
PORT            = 5000
```

4. Railway otomatis deploy. Setelah selesai, salin **domain Railway**:
   contoh: `https://mlshop-backend.up.railway.app`

5. Jalankan seed data pertama kali lewat Railway Shell:
```bash
npm run db:seed
```

---

### STEP 5 — Deploy Frontend di Vercel

1. Buka https://vercel.com → **Add New Project**
2. Import repo GitHub `mlshop`
3. Set **Root Directory** = `frontend`
4. Di **Environment Variables**, tambahkan:

```
NEXT_PUBLIC_API_URL  = https://mlshop-backend.up.railway.app
NEXT_PUBLIC_SITE_NAME = MLShop
```

5. Klik **Deploy** → tunggu selesai
6. Domain gratis kamu: `https://mlshop.vercel.app`

---

### STEP 6 — Hubungkan Frontend ↔ Backend

Setelah dapat domain Vercel, kembali ke Railway:
- Update variable `FRONTEND_URL` = `https://mlshop.vercel.app`
- Railway otomatis redeploy

---

## 🔑 Login Default (Setelah Seed)

| Role   | Email                | Password   |
|--------|----------------------|------------|
| Admin  | admin@mlshop.id      | admin123   |
| Seller | seller@mlshop.id     | seller123  |

⚠️ **Ganti password segera setelah login pertama!**

---

## 📡 API Endpoints

| Method | Endpoint                        | Keterangan            |
|--------|--------------------------------|-----------------------|
| POST   | /api/auth/register              | Daftar akun baru      |
| POST   | /api/auth/login                 | Login                 |
| GET    | /api/auth/me                    | Data user login       |
| GET    | /api/accounts                   | List semua akun       |
| GET    | /api/accounts/popular           | Akun terpopuler       |
| GET    | /api/accounts/:id               | Detail akun           |
| POST   | /api/accounts                   | Post akun baru 🔐     |
| DELETE | /api/accounts/:id               | Hapus akun 🔐         |
| POST   | /api/accounts/:id/wishlist      | Like/unlike 🔐        |
| POST   | /api/orders                     | Buat order 🔐         |
| GET    | /api/orders                     | Riwayat order 🔐      |
| GET    | /api/admin/stats                | Statistik 🔐👑        |
| GET    | /api/admin/orders               | Semua order 🔐👑      |
| PATCH  | /api/admin/orders/:id           | Update status order 🔐👑 |

🔐 = Butuh login (Bearer Token)
👑 = Butuh role ADMIN

---

## 💰 Estimasi Biaya

| Layanan       | Gratis             | Berbayar           |
|--------------|--------------------|--------------------|
| Vercel        | ✅ Ya (subdomain)  | $20/bln (domain sendiri) |
| Railway       | ✅ $5 credit/bln   | $5/bln (biasanya cukup) |
| Cloudinary    | ✅ 25GB/bln        | $89/bln (kalau besar) |
| Domain .com   | ❌                 | ~Rp 150rb/tahun    |

**Total untuk mulai: GRATIS** 🎉

---

## 📞 Pengembangan Selanjutnya

- [ ] Integrasi Midtrans / Xendit (payment gateway)
- [ ] Notifikasi WhatsApp (Fonnte / Wablas)
- [ ] Live chat antara buyer & seller
- [ ] Sistem rating & review
- [ ] Admin dashboard dengan grafik
- [ ] Push notification
- [ ] Mobile app (React Native)
