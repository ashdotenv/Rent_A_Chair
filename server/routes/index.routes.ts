import { Router } from "express";
import authRoutes from "./auth.routes"
import adminRoutes from "./admin.routes"
import userRoutes from "./user.routes"
import rentalRoutes from "./rental.routes"
import khaltiRoutes from "./khalti.routes"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getAllFurniture, getTopFeaturedProducts } from "../controllers/public.controller";
const router = Router()
router.get("/furnitures", getAllFurniture)
router.get("/furnitures/:category", getAllFurniture)
router.get("/featuredProducts", getTopFeaturedProducts)
router.use("/auth", authRoutes)
router.use("/khalti", isAuthenticated, authorizeRoles("USER"), khaltiRoutes)
router.use("/rental", isAuthenticated, authorizeRoles("USER"), rentalRoutes)
router.use("/admin", isAuthenticated, authorizeRoles("ADMIN"), adminRoutes)
router.use("/user", isAuthenticated, authorizeRoles("USER"), userRoutes)
export default router