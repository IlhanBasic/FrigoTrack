import express from 'express';
import {
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js';
const router = express.Router();
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;