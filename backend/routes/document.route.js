import express from 'express';
import {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} from '../controllers/document.controller.js';
import { verifyAdministration, verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/',verifyToken,verifyAdministration, createDocument);
router.get('/',verifyToken, getAllDocuments);
router.get('/:id',verifyToken, getDocumentById);
router.put('/:id',verifyToken,verifyAdministration, updateDocument);
router.delete('/:id',verifyToken,verifyAdministration, deleteDocument);
export default router;