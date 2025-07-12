import { Request, Response, NextFunction } from "express"
import { ErrorHandler } from "../utils/ErrorHandler"
import { catchAsyncError } from "../middleware/catchAsyncError"
import { prisma } from "../utils/prismaClient"

export const myProfile = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new ErrorHandler("Unauthorized", 401))
            }

            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    loyaltyPoints: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })

            res.status(200).json({ success: true, user })
        } catch (error) {
            console.log(error);
            return next(error)
        }
    }
)

export const updateProfile = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new ErrorHandler("Unauthorized", 401))
            }

            const { fullName } = req.body

            const updatedUser = await prisma.user.update({
                where: { id: req.user.id },
                data: {
                    fullName,
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    loyaltyPoints: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })

            res.status(200).json({ success: true, user: updatedUser })
        } catch (error) {
            return next(error)
        }
    }
)
export const getLoyaltyPoints = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorHandler("Unauthorized", 401))
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                loyaltyPoints: true,
                loyaltyBonuses: {
                    select: {
                        id: true,
                        rentalId: true,
                        points: true,
                        earnedAt: true
                    },
                    orderBy: { earnedAt: "desc" }
                }
            }
        })

        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        res.status(200).json({
            success: true,
            loyaltyPoints: user.loyaltyPoints,
            bonuses: user.loyaltyBonuses
        })
    } catch (error) {
        next(error)
    }
}
export const getReferralHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorHandler("Unauthorized", 401))
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                referralCode: true,
                referralsMade: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        createdAt: true,
                        loyaltyPoints: true
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        res.status(200).json({
            success: true,
            referralCode: user.referralCode,
            referrals: user.referralsMade
        })
    } catch (error) {
        next(error)
    }
}

export const getMyRentals = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("Unauthorized", 401));
      }
      const rentals = await prisma.rental.findMany({
        where: { userId: req.user.id },
        orderBy: { startDate: "desc" },
        include: {
          furniture: {
            select: {
              id: true,
              title: true,
              images: true,
              category: true,
              dailyRate: true,
              weeklyRate: true,
              monthlyRate: true,
            }
          },
          payment: true,
        }
      });
      res.status(200).json({ success: true, rentals });
    } catch (error) {
      return next(error);
    }
  }
);