// routes/laporanRoutes.js
import express from 'express';
import {
  getAllLaporan,
  getDashboardLaporan,
  getLaporanById,
  getJenisLaporan,
  getRecentArsip,
  createLaporan,
  updateLaporan,
  deleteLaporan,
  deleteFoto,
  tambahFotoLaporan,
  getTodayLaporan
} from '../controllers/laporanController.js';

import { uploadMultiple } from '../middleware/multerConfig.js';
import uploadSingle from '../middleware/uploadFoto.js'; // untuk single upload admin

const router = express.Router();


// 🟣 [Mobile] Dashboard Laporan Hari Ini
router.get('/dashboard/:id_user/:id_cabang', getDashboardLaporan);

// 🟣 [Admin] Laporan Hari Ini (Today)
router.get('/today', getTodayLaporan);

// 🟣 [Admin] Semua Laporan
router.get('/', getAllLaporan);

// 🟣 [Admin] Arsip + Filter + Jenis
router.get('/arsip', getRecentArsip);
router.get('/jenis-laporan', getJenisLaporan);

// 🟣 [Admin] Export (kalau ada)
router.get('/export', (req, res) => {
  // Placeholder, jika kamu punya laporanController.exportLaporan
  res.json({ message: 'Fitur export belum diimplementasi' });
});

// 🟣 [Admin + Mobile] Ambil Detail Laporan
router.get('/:id', getLaporanById);

// 🟣 [Mobile] Buat Laporan (upload multiple foto)
router.post('/', uploadMultiple, createLaporan);

// 🟣 [Admin] Tambah Foto ke laporan tertentu (upload single)
router.post('/:id/foto', uploadSingle.single('foto'), tambahFotoLaporan);

// 🟣 [Mobile] Tambah Foto (tanpa ID di param)
router.post('/foto', uploadMultiple, tambahFotoLaporan);

// 🟣 [Mobile] Update Laporan milik user
router.put('/:id', updateLaporan);

// 🟣 [Mobile] Hapus laporan jika milik user
router.delete('/:id_laporan/:id_user', deleteLaporan);

// 🟣 [Admin] Hapus laporan langsung (tanpa cek user)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteLaporan(id); // pakai model
    res.json({ message: 'Laporan berhasil dihapus (admin)' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hapus laporan', error: err.message });
  }
});

// 🟣 [Mobile] Hapus satu foto
router.delete('/foto/:id', deleteFoto);

export default router;
