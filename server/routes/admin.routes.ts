import { Router } from "express";
import { 
    createFurniture, 
    getAllRentals, 
    getAllUsers, 
    updateFurniture, 
    updateRentalStatus, 
    updateUserRole,
    createBundle,
    getAllBundles,
    getBundleById,
    updateBundle,
    deleteBundle,
    deleteFurniture
} from "../controllers/admin.controller";
const router = Router()
import analyticsRoute from "./analytics.routes"
router.get("/users", getAllUsers)
router.get("/rentals", getAllRentals)
router.post("/add-furniture", createFurniture)
router.put("/update-furniture/:id", updateFurniture)
router.put("/update-user-role", updateUserRole)
router.delete("/delete-furniture/:id", deleteFurniture)
router.use("/analytics", analyticsRoute)
router.put("/update-rental-status/:id", updateRentalStatus)

// Bundle routes
router.post("/bundles", createBundle)
router.get("/bundles", getAllBundles)
router.get("/bundles/:id", getBundleById)
router.put("/bundles/:id", updateBundle)
router.delete("/bundles/:id", deleteBundle)

export default router   