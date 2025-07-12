import { Request, Response, NextFunction } from "express"
import { catchAsyncError } from "../middleware/catchAsyncError"
import { ErrorHandler } from "../utils/ErrorHandler"
import { prisma } from "../utils/prismaClient"

const validRentalTypes = ["DAILY", "WEEKLY", "MONTHLY"]
const validRentalStatuses = ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]
const validPaymentMethods = ["CASH", "KHALTI"]
const validPaymentStatuses = ["SUCCESS", "FAILED", "PENDING"]

export const placeRental = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new ErrorHandler("Unauthorized", 401))
            }

            const {
                items,
                startDate,
                endDate,
                paymentMethod,
                paymentStatus,
                rentalStatus,
                discountCode,
                deliveryAddress,
                customer_info
            } = req.body

            if (!Array.isArray(items) || items.length === 0) {
                return next(new ErrorHandler("No rental items provided", 400))
            }

            const createdRentals = [];
            for (const item of items) {
                const { furnitureId, quantity = 1, rentalType } = item;
                if (!validRentalTypes.includes(rentalType)) {
                    return next(new ErrorHandler("Invalid rental type", 400))
                }
                if (!validRentalStatuses.includes(rentalStatus)) {
                    return next(new ErrorHandler("Invalid rental status", 400))
                }
                if (!validPaymentMethods.includes(paymentMethod)) {
                    return next(new ErrorHandler("Invalid payment method", 400))
                }
                if (!validPaymentStatuses.includes(paymentStatus)) {
                    return next(new ErrorHandler("Invalid payment status", 400))
                }
                const furniture = await prisma.furniture.findUnique({
                    where: { id: furnitureId }
                })
                if (!furniture) {
                    return next(new ErrorHandler("Furniture not found", 404))
                }
                if (furniture.availableQuantity < quantity) {
                    return next(new ErrorHandler("Not enough furniture in stock", 400))
                }
                let rentalRate = 0
                if (rentalType === "DAILY") rentalRate = furniture.dailyRate
                else if (rentalType === "WEEKLY") rentalRate = furniture.weeklyRate
                else rentalRate = furniture.monthlyRate
                const totalAmount = rentalRate * quantity
                const rental = await prisma.rental.create({
                    data: {
                        userId: req.user.id,
                        furnitureId,
                        rentalType,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        totalAmount,
                        paymentMethod,
                        paymentStatus,
                        status: rentalStatus,
                        discountCode: discountCode || null,
                        deliveryStreet: deliveryAddress.street,
                        deliveryCity: deliveryAddress.city,
                        deliveryState: deliveryAddress.state,
                        deliveryPostalCode: deliveryAddress.postalCode,
                        deliveryCountry: deliveryAddress.country,
                        quantity
                    }
                })
                await prisma.furniture.update({
                    where: { id: furnitureId },
                    data: {
                        availableQuantity: {
                            decrement: quantity
                        }
                    }
                })
                createdRentals.push(rental)
            }
            res.status(201).json({
                success: true,
                message: "Rentals created successfully",
                rentals: createdRentals
            })
        } catch (error) {
            return next(error)
        }
    }
)
