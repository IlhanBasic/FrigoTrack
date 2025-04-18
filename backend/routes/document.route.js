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
router.post('/',verifyToken, createDocument);
router.get('/',verifyToken, getAllDocuments);
router.get('/:id',verifyToken, getDocumentById);
router.put('/:id',verifyToken, updateDocument);
router.delete('/:id',verifyToken, deleteDocument);
export default router;