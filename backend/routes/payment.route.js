import express from 'express';
import {
    createPayment,
    getAllPayments,
    getPaymentById,
} from '../controllers/payment.controller.js';
import { verifyAdministration, verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/',verifyToken,verifyAdministration, createPayment);
router.get('/',verifyToken, getAllPayments);
router.get('/:id',verifyToken, getPaymentById);
export default router;