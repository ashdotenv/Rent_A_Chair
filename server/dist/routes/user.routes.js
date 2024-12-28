import express from "express";
import { updateProfile } from "../controllers/user.controller.js";
const router = express.Router();
router.patch("/update-profile/:id", updateProfile);
export default router;
