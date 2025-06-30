# Security/Mobile - SECURITY REPORT

Aplikasi frontend untuk petugas security melakukan pelaporan harian. Dibangun dengan React + Vite + Tailwind CSS.

## Fitur Utama

- **Login:** Autentikasi user security (NIP & password).
- **Dashboard:** Melihat daftar laporan harian dari cabang user dan laporan yang sudah dibuat.
- **Buat Laporan:** Input laporan harian, upload foto (maksimal 5), dan review sebelum submit.
- **Edit & Hapus Laporan:** Edit atau hapus laporan sendiri sebelum diverifikasi admin.
- **Profile:** Melihat profil user security dan cabang.
- **Logout:** Keluar dari aplikasi.

## Struktur Folder

```
security/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Cara Menjalankan

1. Masuk ke folder `security/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Jalankan aplikasi:
   ```sh
   npm run dev
   ```
4. Buka di browser: [http://localhost:5174](http://localhost:5174)

> **Pastikan backend sudah berjalan sebelum membuka aplikasi security.**

## Konfigurasi

- Endpoint backend diatur pada file [`src/utils/axiosInstance.js`](src/utils/axiosInstance.js).
- Untuk mengubah port, edit file `vite.config.js` atau gunakan flag saat menjalankan.

## Catatan

- Hanya user security (level 2) yang dapat login ke aplikasi ini.
- Maksimal upload 5 foto per laporan.
- Jika sesi login habis, user akan otomatis logout.
- Jangan lupa logout setelah selesai menggunakan aplikasi.