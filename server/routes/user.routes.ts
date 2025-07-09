import { Router } from "express";
import { getLoyaltyPoints, getReferralHistory, myProfile, updateProfile } from "../controllers/user.controller";
import { changePassword, resetPassword } from "../controllers/auth.controller";

const router = Router()
router.get("/me", myProfile)
router.get("/loyalty-points", getLoyaltyPoints)
router.get("/referral-history", getReferralHistory)
router.put("/updateProfile", updateProfile)
router.post("/reset-password", resetPassword)
router.put("/change-password", changePassword)
export default router