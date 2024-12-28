import express from "express";
import userRouter from "../routes/user.routes.js";
import { verifyToken } from "../middlewares/auth.js";
import { Login, Register } from "../controllers/auth.controller.js";
const router = express.Router();
router.post("/register", Register);
router.post("/login", Login);
router.use("/user", verifyToken, userRouter);
export default router;
