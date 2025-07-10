import { Router } from "express"
import { initiatePayment, verifyPayment } from "../controllers/khalti.controller"

const router= Router()
router.post("/create",initiatePayment)
router.post("/verify",verifyPayment)
export default router