import { Router } from "express";
import { createFurniture, getAllRentals, getAllUsers, updateFurniture, updateRentalStatus, updateUserRole } from "../controllers/admin.controller";
const router = Router()
import analyticsRoute from "./analytics.routes"
router.get("/users", getAllUsers)
router.get("/rentals", getAllRentals)
router.post("/add-furniture", createFurniture)
router.put("/update-furniture/:id", updateFurniture)
router.put("/update-user-role", updateUserRole)
router.delete("/delete-furniture/:id", updateFurniture)
router.use("/analytics", analyticsRoute)
router.put("/update-rental-status/:id", updateRentalStatus)
export default router   