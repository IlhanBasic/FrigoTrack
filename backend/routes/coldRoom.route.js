import express from 'express';
import {
    createColdRoom,
    getAllColdRooms,
    getColdRoomById,
    updateColdRoom,
    deleteColdRoom
} from '../controllers/coldRoom.controller.js';
const router = express.Router();
router.post('/', createColdRoom);
router.get('/', getAllColdRooms);
router.get('/:id', getColdRoomById);
router.put('/:id', updateColdRoom);
router.delete('/:id', deleteColdRoom);
export default router;