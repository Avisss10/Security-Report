# Admin Panel - SECURITY REPORT

Panel admin untuk aplikasi pelaporan keamanan dan kebersihan. Dibangun dengan React + Vite.

## Fitur Utama

- **Dashboard:** Ringkasan laporan harian dari seluruh cabang.
- **Manajemen User Security:** Tambah, edit, hapus akun security.
- **Manajemen Cabang:** Tambah, edit, hapus data cabang.
- **Arsip Laporan:** Lihat, filter, dan hapus laporan yang sudah masuk.
- **Logout:** Keluar dari sistem admin.

## Struktur Folder

```
admin/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── archive/
│   │   ├── cabang/
│   │   ├── dashboard/
│   │   ├── security/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Cara Menjalankan

1. Masuk ke folder `admin/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Jalankan aplikasi:
   ```sh
   npm run dev
   ```
4. Buka di browser: [http://localhost:5173](http://localhost:5173)

> **Pastikan backend sudah berjalan sebelum membuka admin panel.**

## Konfigurasi

- Endpoint backend diatur pada file utilitas axios (lihat `src/utils/axiosInstance.js`).
- Untuk mengubah port, edit file `vite.config.js` atau gunakan flag saat menjalankan.

## Catatan

- Hanya admin yang dapat mengakses panel ini.
- Jangan lupa untuk logout setelah selesai menggunakan aplikasi.