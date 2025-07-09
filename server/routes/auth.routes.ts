import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
const router = Router()
router.post("/login-user", loginUser)
router.post("/register-user", registerUser)
export default router