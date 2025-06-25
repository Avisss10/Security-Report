import express from 'express';
import * as cabangController from '../controllers/cabangController.js';

const router = express.Router();

router.get('/', cabangController.getAllCabang);
router.get('/:id', cabangController.getCabangById);
router.post('/', cabangController.createCabang);
router.put('/:id', cabangController.updateCabang);
router.delete('/:id', cabangController.deleteCabang);

export default router;
