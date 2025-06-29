import express from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken } from '../middleware/authJwt.js';

const router = express.Router();

// Proteksi endpoint user
router.use(verifyToken);

// CRUD User
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
