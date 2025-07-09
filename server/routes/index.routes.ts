import { Router } from "express";
import authRoutes from "./auth.routes"
import adminRoutes from "./admin.routes"
import userRoutes from "./user.routes"
import rentalRoutes from "./rental.routes"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getAllFurniture } from "../controllers/public.controller";
const router = Router()
router.get("/furnitures", getAllFurniture)
router.use("/auth", authRoutes)
router.use("/rental", isAuthenticated, authorizeRoles("USER"), rentalRoutes)
router.use("/admin", isAuthenticated, authorizeRoles("ADMIN"), adminRoutes)
router.use("/user", isAuthenticated, authorizeRoles("USER"), userRoutes)
export default router