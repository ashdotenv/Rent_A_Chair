import { NextFunction, Request, Response } from "express"
import { catchAsyncError } from "../middleware/catchAsyncError"
import { prisma } from "../utils/prismaClient"

export const getAllFurniture = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const furniture = await prisma.furniture.findMany({
                include: { images: true },
                orderBy: { createdAt: "desc" },
            })
            res.status(200).json({ success: true, furniture })
        } catch (error) {
            return next(error)
        }
    }
)
