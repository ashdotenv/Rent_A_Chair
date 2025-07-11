import { Router } from "express"
import { initiatePayment, verifyPayment } from "../controllers/khalti.controller"

const router= Router()
router.post("/initiate",initiatePayment)
router.get("/verify",verifyPayment)
export default router