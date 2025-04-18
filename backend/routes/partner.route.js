import express from 'express';
import {
    createPartner,
    getAllPartners,
    getPartnerById,
    updatePartner,
    deletePartner
} from '../controllers/partner.controller.js';
import { verifyAdministration, verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/',verifyToken, createPartner);
router.get('/',verifyToken, getAllPartners);
router.get('/:id',verifyToken, getPartnerById);
router.put('/:id',verifyToken, updatePartner);
router.delete('/:id',verifyToken, deletePartner);
export default router;