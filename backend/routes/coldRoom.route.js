import express from 'express';
import {
    createColdRoom,
    getAllColdRooms,
    getColdRoomById,
    updateColdRoom,
    deleteColdRoom
} from '../controllers/coldRoom.controller.js';
import { verifyStock, verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/', verifyToken, verifyStock, createColdRoom);
router.get('/', verifyToken, getAllColdRooms);
router.get('/:id', verifyToken, getColdRoomById);
router.put('/:id', verifyToken, verifyStock, updateColdRoom);
router.delete('/:id', verifyToken, verifyStock, deleteColdRoom);

export default router;