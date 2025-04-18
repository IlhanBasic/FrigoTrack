import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  storeProductInColdRoom,
  deleteProduct,
  sellingProducts,
  buyingProducts,
} from "../controllers/product.controller.js";
import {
  verifyAdministration,
  verifyStock,
  verifyToken,
} from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/", verifyToken, createProduct);
router.post("/store", verifyToken, storeProductInColdRoom);
router.post("/sell", verifyToken, sellingProducts);
router.post("/buy", verifyToken, buyingProducts);
router.get("/", verifyToken, getAllProducts);
router.get("/:id", verifyToken, getProductById);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);
export default router;
