import { NextFunction, Request, Response } from "express"
import { catchAsyncError } from "../middleware/catchAsyncError"
import { generateModelReport } from "../utils/generateModelReport"

export const getUsersReport = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const report = await generateModelReport("user")
            res.status(200).json({ success: true, report })
        } catch (error) {
           return next(error)
        }
    }
)

export const getFurnitureReport = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const report = await generateModelReport("furniture")
            res.status(200).json({ success: true, report })
        } catch (error) {
           return next(error)
        }
    }
)

export const getRentalsReport = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate, status } = req.query
            const filters: Record<string, any> = { startDate, endDate }
            if (status) filters.status = status
            const report = await generateModelReport("rental", filters, "totalAmount")
            res.status(200).json({ success: true, report })
        } catch (error) {
           return next(error)
        }
    }
)