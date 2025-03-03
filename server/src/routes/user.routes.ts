import express from "express";
import {
  getMyDetails,
  getMyOrders,
  resetPassword,
  updateProfile,
} from "../controllers/user.controller.js";
const router = express.Router();
router.patch("/update-profile/:id", updateProfile);
router.get("/getmydetails", getMyDetails);
router.get("/myOrders", getMyOrders);
router.get("/resetPassword", resetPassword);
export default router;
