import express from 'express';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    storeProductInColdRoom,
    deleteProduct,
    sellingProducts,
    buyingProducts
} from '../controllers/product.controller.js';
const router = express.Router();
router.post('/', createProduct);
router.post('/store', storeProductInColdRoom);
router.post('/sell', sellingProducts);
router.post('/buy', buyingProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
export default router;