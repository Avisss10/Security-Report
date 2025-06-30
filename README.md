# SECURITY REPORT

Aplikasi pelaporan keamanan dan kebersihan berbasis web, terdiri dari tiga bagian utama:
- **Admin Panel** (`admin/`): Untuk manajemen laporan, user, cabang, dan arsip.
- **Backend API** (`backend/`): REST API berbasis Node.js/Express, mengelola data dan autentikasi.
- **Security/Mobile** (`security/`): Frontend untuk petugas security melakukan pelaporan harian.

---

## Struktur Project

```
SECURITY REPORT/
│
├── admin/      # Frontend Admin (React + Vite)
├── backend/    # Backend API (Node.js + Express + MySQL)
├── security/   # Frontend Security/Mobile (React + Vite + Tailwind CSS)
```

---

## Fitur Utama

- **Admin**
  - Dashboard laporan harian
  - Manajemen user security
  - Manajemen cabang
  - Arsip & filter laporan
  - Hapus/edit laporan

- **Security/Mobile**
  - Login petugas security
  - Dashboard laporan harian
  - Input laporan harian (dengan foto)
  - Edit & hapus laporan sendiri

- **Backend**
  - REST API untuk semua fitur di atas
  - Autentikasi JWT
  - Upload & serve foto laporan

---

## Cara Menjalankan

### 1. Backend

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

### 2. Admin Panel

1. Masuk ke folder `admin/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Jalankan frontend:
   ```sh
   npm run dev
   ```
   Akses di `http://localhost:5173`

### 3. Security/Mobile

1. Masuk ke folder `security/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Jalankan frontend:
   ```sh
   npm run dev
   ```
   Akses di `http://localhost:5174`

---

## Database

- Gunakan MySQL/MariaDB.
- Struktur tabel: `user`, `laporan`, `cabang`, `foto_laporan`, dll.
- Pastikan konfigurasi koneksi database di `backend/config/db.js` sudah benar.

---

## Catatan

- Untuk upload foto, folder `backend/uploads/` harus writable.
- Pastikan backend berjalan sebelum frontend.
- Token JWT digunakan untuk autentikasi API.

---
