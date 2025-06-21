
import express from 'express';
import { getDashboardLaporan,
     createLaporan,
     deleteLaporan,
     getLaporanById,
     updateLaporan,
     deleteFoto,
     tambahFotoLaporan } 
     from '../controllers/laporanController.js';
import { uploadMultiple } from '../middleware/multerConfig.js';
const router = express.Router();

router.get('/dashboard/:id_user/:id_cabang', getDashboardLaporan);
router.delete('/foto/:id', deleteFoto);
router.delete('/:id_laporan/:id_user', deleteLaporan);
router.post('/', uploadMultiple, createLaporan);
router.get('/:id', getLaporanById);
router.put('/:id', updateLaporan);
router.post('/foto', uploadMultiple, tambahFotoLaporan);

export default router;