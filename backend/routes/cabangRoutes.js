import express from 'express';
import * as cabangController from '../controllers/cabangController.js';
import { verifyToken } from '../middleware/authJwt.js';

const router = express.Router();

// Proteksi endpoint cabang
router.use(verifyToken);

// CRUD Cabang
router.get('/', cabangController.getAllCabang);
router.get('/:id', cabangController.getCabangById);
router.post('/', cabangController.createCabang);
router.put('/:id', cabangController.updateCabang);
router.delete('/:id', cabangController.deleteCabang);

export default router;
