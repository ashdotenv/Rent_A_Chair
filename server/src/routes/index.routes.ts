import express from "express";
import userRouter from "../routes/user.routes.js";
import adminRouter from "../routes/admin.routes.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";
import {
  adminLogin,
  Login,
  logout,
  Register,
} from "../controllers/auth.controller.js";
import {
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";
const router = express.Router();
router.post("/register", Register);
router.post("/login", Login);
router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:id", getProductById);
router.get("/logout", logout);
router.post("/adminLogin", adminLogin);
router.use("/user", verifyToken, userRouter);
router.use("/admin", verifyToken, verifyAdmin, adminRouter);
export default router;
