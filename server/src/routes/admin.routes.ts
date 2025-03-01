import express from "express";
import {
  addProduct,
  deleteProduct,
  generateCoupon,
  getAllCategories,
  updateProduct,
} from "../controllers/admin.controller.js";
const router = express.Router();
router.post("/add-product", addProduct);
router.delete("/delete-product/:id", deleteProduct);
router.patch("/update-product/:id", updateProduct);
router.post("/generate-Coupon", generateCoupon);
router.get("/getAllCategories", getAllCategories);
export default router;
