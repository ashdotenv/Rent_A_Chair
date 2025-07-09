import { Router } from "express";
import { getFurnitureReport, getRentalsReport, getUsersReport } from "../controllers/report.controller";

const router = Router()
router.get("/users", getUsersReport)
router.get("/rentals", getRentalsReport)
router.get("/furniture", getFurnitureReport)
export default router