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

export const generateReferralCode = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("Unauthorized", 401));
      }

      // Helper to generate a random alphanumeric code
      function randomCode(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }

      // Try to generate a unique code
      let code;
      let isUnique = false;
      for (let i = 0; i < 10; i++) { // Try 10 times
        code = randomCode();
        const existing = await prisma.user.findUnique({ where: { referralCode: code } });
        if (!existing) {
          isUnique = true;
          break;
        }
      }
      if (!isUnique) {
        return next(new ErrorHandler("Could not generate a unique referral code. Please try again.", 500));
      }

      // Save to user
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { referralCode: code },
        select: { id: true, referralCode: true }
      });

      res.status(200).json({ success: true, referralCode: updatedUser.referralCode });
    } catch (error) {
      return next(error);
    }
  }
);

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

// New: Dashboard summary endpoint
export const getUserDashboard = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("Unauthorized", 401));
      }
      // Get loyalty points
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { loyaltyPoints: true }
      });
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      // Count active rentals
      const activeRentalsCount = await prisma.rental.count({
        where: { userId: req.user.id, status: "ACTIVE" }
      });
      // Get 3 latest rentals
      const latestRentals = await prisma.rental.findMany({
        where: { userId: req.user.id },
        orderBy: { startDate: "desc" },
        take: 3,
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
      // Count total reviews by user
      const totalReviews = await prisma.rating.count({
        where: { userId: req.user.id }
      });
      res.status(200).json({
        success: true,
        loyaltyPoints: user.loyaltyPoints,
        activeRentals: activeRentalsCount,
        latestRentals,
        totalReviews
      });
    } catch (error) {
      return next(error);
    }
  }
);
