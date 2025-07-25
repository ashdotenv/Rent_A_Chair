import { Router } from "express";
import { getLoyaltyPoints, getMyRentals, getReferralHistory, myProfile, updateProfile } from "../controllers/user.controller";
const router = Router()
router.get("/me", myProfile)
router.get("/rentals", getMyRentals)
router.get("/loyalty-points", getLoyaltyPoints)
router.get("/referral-history", getReferralHistory)
router.put("/update-Profile", updateProfile)
export default router