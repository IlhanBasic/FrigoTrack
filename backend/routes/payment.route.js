import express from 'express';
import {
    createPayment,
    getAllPayments,
    getPaymentById,
    // updatePayment,
    // deletePayment
} from '../controllers/payment.controller.js';
import { verifyAdministration, verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/',verifyToken, createPayment);
router.get('/',verifyToken, getAllPayments);
router.get('/:id',verifyToken, getPaymentById);
export default router;