import express from 'express';
import {
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js';
import {verifyAdmin,verifyToken} from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/',verifyToken,verifyAdmin, getAllUsers);
router.get('/:id',verifyToken, getUserById);
router.put('/:id',verifyToken, updateUser);
router.delete('/:id',verifyToken,verifyAdmin, deleteUser);
export default router;