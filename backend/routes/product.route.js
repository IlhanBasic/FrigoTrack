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
router.post("/", verifyToken,verifyStock, createProduct);
router.post("/store", verifyToken,verifyStock, storeProductInColdRoom);
router.post("/sell", verifyToken,verifyAdministration, sellingProducts);
router.post("/buy", verifyToken,verifyAdministration, buyingProducts);
router.get("/", verifyToken, getAllProducts);
router.get("/:id", verifyToken, getProductById);
router.put("/:id", verifyToken,verifyStock, updateProduct);
router.delete("/:id", verifyToken,verifyStock, deleteProduct);
export default router;
