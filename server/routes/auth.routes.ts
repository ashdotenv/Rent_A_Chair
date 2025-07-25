import { Router } from "express";
import { loginUser, registerUser, logoutUser, resetPassword, changePassword } from "../controllers/auth.controller";
const router = Router()
router.post("/login-user", loginUser)
router.post("/register-user", registerUser)
router.post("/logout", logoutUser)
router.post("/reset-password", resetPassword)
router.put("/change-password", changePassword)
export default router