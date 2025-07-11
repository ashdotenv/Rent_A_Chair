import { Request, Response, NextFunction } from "express"
import { catchAsyncError } from "../middleware/catchAsyncError"
import { ErrorHandler } from "../utils/ErrorHandler"
import { cloudinary } from "../config/cloundinary.config"
import { prisma } from "../utils/prismaClient"
export const createFurniture = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {
                title,
                description,
                category,
                material,
                color,
                dimensions,
                availableQuantity,
                dailyRate,
                weeklyRate,
                monthlyRate,
                valuationPrice,
                originalPrice,
                purchaseDate,
                conditionScore,
                wearLevel,
                tags,
                isFeatured,
                isArchived,
            } = req.body

            if (!req.user) {
                return next(new ErrorHandler("Unauthorized: User not found", 401))
            }

            if (
                !title ||
                !description ||
                !category ||
                !material ||
                !color ||
                !dimensions ||
                availableQuantity == null ||
                dailyRate == null ||
                weeklyRate == null ||
                monthlyRate == null ||
                valuationPrice == null ||
                originalPrice == null ||
                !purchaseDate ||
                conditionScore == null ||
                wearLevel == null
            ) {
                return next(new ErrorHandler("Please provide all required furniture fields", 400))
            }

            if (!req.files || !req.files.images) {
                return next(new ErrorHandler("Please upload at least one image", 400))
            }

            const images = Array.isArray(req.files.images)
                ? req.files.images
                : [req.files.images]

            const uploadedImageUrls: string[] = []

            for (const image of images) {
                if (Array.isArray(image)) {
                    for (const img of image) {
                        const result = await cloudinary.uploader.upload(img.tempFilePath, {
                            folder: "furnitures"
                        })
                        uploadedImageUrls.push(result.secure_url)
                    }
                } else {
                    const result = await cloudinary.uploader.upload(image.tempFilePath, {
                        folder: "furnitures"
                    })
                    uploadedImageUrls.push(result.secure_url)
                }
            }



            const furniture = await prisma.furniture.create({
                data: {
                    title,
                    description,
                    category,
                    material,
                    color,
                    dimensions,
                    availableQuantity: Number(availableQuantity),
                    dailyRate: Number(dailyRate),
                    weeklyRate: Number(weeklyRate),
                    monthlyRate: Number(monthlyRate),
                    valuationPrice: Number(valuationPrice),
                    originalPrice: Number(originalPrice),
                    purchaseDate: new Date(purchaseDate),
                    conditionScore: Number(conditionScore),
                    wearLevel: Number(wearLevel),
                    tags: typeof tags === 'string' ? tags : Array.isArray(tags) ? tags.join(',') : '',
                    isFeatured: Boolean(isFeatured),
                    isArchived: Boolean(isArchived),
                    images: {
                        create: uploadedImageUrls.map((url) => ({ url })),
                    },
                },
                include: {
                    images: true,
                },
            })

            res.status(201).json({
                success: true,
                message: "Furniture created successfully",
                furniture,
            })
        } catch (error) {
            return next(error)
        }
    }
)
export const updateFurniture = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const furnitureId = req.params.id
            const {
                title,
                description,
                category,
                material,
                color,
                dimensions,
                availableQuantity,
                dailyRate,
                weeklyRate,
                monthlyRate,
                valuationPrice,
                originalPrice,
                purchaseDate,
                conditionScore,
                wearLevel,
                tags,
                isFeatured,
                isArchived,
            } = req.body

            if (!req.user) {
                return next(new ErrorHandler("Unauthorized", 401))
            }

            const furniture = await prisma.furniture.findUnique({
                where: { id: furnitureId },
                include: { images: true },
            })

            if (!furniture) {
                return next(new ErrorHandler("Furniture not found", 404))
            }



            if (req.files && req.files.images) {
                const images = Array.isArray(req.files.images)
                    ? req.files.images
                    : [req.files.images]

                for (const existingImage of furniture.images) {
                    const segments = existingImage.url.split("/")
                    const publicIdWithExt = segments[segments.length - 1]
                    const publicId = publicIdWithExt.split(".")[0]
                }
                await prisma.furnitureImage.deleteMany({
                    where: { furnitureId },
                })
                const uploadedImageUrls: string[] = []

                for (const image of images) {
                    if (Array.isArray(image)) {
                        for (const img of image) {
                            const result = await cloudinary.uploader.upload(img.tempFilePath, {
                                folder: "furnitures"
                            })
                            uploadedImageUrls.push(result.secure_url)
                        }
                    } else {
                        const result = await cloudinary.uploader.upload(image.tempFilePath, {
                            folder: "furnitures"
                        })
                        uploadedImageUrls.push(result.secure_url)
                    }
                }

                await prisma.furnitureImage.createMany({
                    data: uploadedImageUrls.map((url) => ({
                        furnitureId,
                        url,
                    })),
                })
            }

            const updatedFurniture = await prisma.furniture.update({
                where: { id: furnitureId },
                data: {
                    title,
                    description,
                    category,
                    material,
                    color,
                    dimensions,
                    availableQuantity: availableQuantity ? Number(availableQuantity) : undefined,
                    dailyRate: dailyRate ? Number(dailyRate) : undefined,
                    weeklyRate: weeklyRate ? Number(weeklyRate) : undefined,
                    monthlyRate: monthlyRate ? Number(monthlyRate) : undefined,
                    valuationPrice: valuationPrice ? Number(valuationPrice) : undefined,
                    originalPrice: originalPrice ? Number(originalPrice) : undefined,
                    purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
                    conditionScore: conditionScore ? Number(conditionScore) : undefined,
                    wearLevel: wearLevel ? Number(wearLevel) : undefined,
                    tags: tags ? tags.toString() : undefined,
                    isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
                    isArchived: isArchived !== undefined ? Boolean(isArchived) : undefined,
                },
            })

            res.status(200).json({
                success: true,
                message: "Furniture updated successfully",
                updatedFurniture
            })
        } catch (error) {
            return next(error)
        }
    }
)
export const deleteFurniture = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const furnitureId = req.params.id

        if (!req.user) {
            return next(new ErrorHandler("Unauthorized", 401))
        }

        const furniture = await prisma.furniture.findUnique({
            where: { id: furnitureId },
            include: { images: true },
        })

        if (!furniture) {
            return next(new ErrorHandler("Furniture not found", 404))
        }

        for (const image of furniture.images) {
            const segments = image.url.split("/")
            const publicIdWithExt = segments[segments.length - 1]
            const publicId = publicIdWithExt.split(".")[0]
            await cloudinary.uploader.destroy(publicId)
        }

        await prisma.furnitureImage.deleteMany({
            where: { furnitureId },
        })

        await prisma.furniture.delete({
            where: { id: furnitureId },
        })

        res.status(200).json({
            success: true,
            message: "Furniture deleted successfully",
        })
    }
)
export const updateUserRole = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        // Accept both { id, role } and { userId, newRole } for compatibility
        const userId = req.body.id || req.body.userId;
        const newRole = req.body.role || req.body.newRole;

        if (!req.user) {
            return next(new ErrorHandler("Unauthorized", 401))
        }

        if (!userId || !newRole) {
            return next(new ErrorHandler("User ID and new role are required", 400))
        }

        if (req.user.id === userId) {
            return next(new ErrorHandler("You cannot update your own role", 400))
        }

        const userToUpdate = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!userToUpdate) {
            return next(new ErrorHandler("User not found", 404))
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        })

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        })
    }
)


export const getAllUsers = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {

        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true, createdAt: true, fullName: true },
            where: { id: { not: req.user.id } },
            orderBy: { createdAt: "desc" },
        })
        res.status(200).json({ success: true, users })
    }
)
const validRentalStatuses = ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"];
const validPaymentStatuses = ["PENDING", "FAILED", "SUCCESS"];
const validDeliveryStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

export const updateRentalStatus = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, paymentStatus, deliveryStatus } = req.body;
        const { id } = req.params;

        const rentalExist = await prisma.rental.findFirst({ where: { id } });
        if (!rentalExist) {
            return next(new ErrorHandler("No rental found", 400));
        }

        if (status && !validRentalStatuses.includes(status)) {
            return next(new ErrorHandler("Enter a valid rental status", 400));
        }

        if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
            return next(new ErrorHandler("Enter a valid payment status", 400));
        }

        if (deliveryStatus && !validDeliveryStatuses.includes(deliveryStatus)) {
            return next(new ErrorHandler("Enter a valid delivery status", 400));
        }

        const rental = await prisma.rental.update({
            where: { id },
            data: {
                status: status || rentalExist.status,
                paymentStatus: paymentStatus || rentalExist.paymentStatus,
                deliveryStatus: deliveryStatus || rentalExist.deliveryStatus
            }
        });

        res.status(200).json({
            success: true,
            rental: {
                id: rental.id,
                status: rental.status,
                paymentStatus: rental.paymentStatus,
                deliveryStatus: rental.deliveryStatus
            }
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllRentals = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rentals = await prisma.rental.findMany({
                include: {
                    user: true,
                    furniture: true,
                },
                orderBy: { createdAt: "desc" },
            });
            res.status(200).json({
                success: true,
                rentals,
            });
        } catch (error) {
            return next(error);
        }
    }
);
