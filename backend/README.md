# Backend - SECURITY REPORT

Backend API untuk aplikasi pelaporan keamanan dan kebersihan. Dibangun dengan Node.js, Express, dan MySQL.

## Fitur Utama

- **Autentikasi JWT:** Login untuk admin & security.
- **Manajemen User:** CRUD user (admin & security).
- **Manajemen Cabang:** CRUD cabang.
- **Manajemen Laporan:** CRUD laporan harian, filter, arsip, dan dashboard.
- **Upload Foto:** Upload dan hapus foto laporan (dengan Multer).
- **Proteksi Endpoint:** Middleware JWT untuk semua endpoint.

## Struktur Folder

```
backend/
├── app.js
├── config/
│   └── db.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── package.json
├── .env
```

## Cara Menjalankan

1. Masuk ke folder `backend/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Jalankan server:
   ```sh
   npm start
   ```
   Server berjalan di `http://localhost:5000`

## Konfigurasi

- **Database:** Pastikan MySQL/MariaDB sudah berjalan dan database sudah dibuat.
- **Koneksi DB:** Atur koneksi di `config/db.js`.
- **JWT:** Atur secret di file `.env`.
- **Upload:** Folder `uploads/` harus writable.

## Endpoint Utama

- `POST /api/auth/login` — Login admin/security
- `GET /api/laporan` — Semua laporan (admin)
- `POST /api/laporan` — Tambah laporan (security)
- `POST /api/laporan/:id/foto` — Upload foto ke laporan (admin)
- `DELETE /api/laporan/:id` — Hapus laporan (admin)
- `DELETE /api/laporan/:id_laporan/:id_user` — Hapus laporan sendiri (security)
- `GET /api/laporan/arsip` — Arsip & filter laporan
- `GET /api/laporan/dashboard/:id_user/:id_cabang` — Dashboard laporan harian (security)
- `GET /api/user` — Manajemen user (admin)
- `GET /api/cabang` — Manajemen cabang (admin)

## Testing API

Gunakan file `test-api.rest` untuk mencoba endpoint dengan REST Client di VS Code.

## Catatan

- Pastikan backend berjalan sebelum frontend.
- Token JWT wajib untuk akses endpoint yang diproteksi.