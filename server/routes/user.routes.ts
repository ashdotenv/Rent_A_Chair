import { Router } from "express";
import { getLoyaltyPoints, getMyRentals, getReferralHistory, myProfile, updateProfile, getUserDashboard, generateReferralCode } from "../controllers/user.controller";
const router = Router()
router.get("/me", myProfile)
router.get("/rentals", getMyRentals)
router.get("/loyalty-points", getLoyaltyPoints)
router.get("/dashboard", getUserDashboard)
router.get("/referral-history", getReferralHistory)
router.post("/genrate-referral-code", generateReferralCode)
router.put("/update-Profile", updateProfile)
export default router