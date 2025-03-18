import express from "express";
import {
  addProduct,
  deleteProduct,
  generateCoupon,
  getAllCategories,
  getAllOrders,
  updateOrder,
  updateProduct,
} from "../controllers/admin.controller.js";
const router = express.Router();
router.post("/add-product", addProduct);
router.delete("/delete-product/:id", deleteProduct);
router.patch("/update-product/:id", updateProduct);
router.post("/generate-Coupon", generateCoupon);
router.get("/getAllCategories", getAllCategories);
router.get("/getAllOrders", getAllOrders);
router.patch("/updateOrder/:orderId", updateOrder);
export default router;
