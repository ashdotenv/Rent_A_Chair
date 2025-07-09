import { Router } from "express"
import { placeRental } from "../controllers/rental.controller"
const router = Router()
router.post("/place", placeRental)
export default router