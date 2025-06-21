import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// CRUD User
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
