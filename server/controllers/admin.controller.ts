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

// Bundle Controllers
export const createBundle = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                name,
                description,
                price,
                isFeatured,
                bundleItems
            } = req.body;
            
            if (!req.user) {
                return next(new ErrorHandler("Unauthorized", 401));
            }

            let parsedBundleItems = bundleItems;
            if (typeof bundleItems === 'string') {
                try {
                    parsedBundleItems = JSON.parse(bundleItems);
                } catch (error) {
                    return next(new ErrorHandler("Invalid bundle items format", 400));
                }
            }

            if (!name || !price || !parsedBundleItems || !Array.isArray(parsedBundleItems) || parsedBundleItems.length === 0) {
                return next(new ErrorHandler("Please provide bundle name, price, and at least one bundle item", 400));
            }

            // Validate bundle items
            for (const item of parsedBundleItems) {
                if (!item.furnitureId || !item.quantity || item.quantity <= 0) {
                    return next(new ErrorHandler("Each bundle item must have furnitureId and valid quantity", 400));
                }

                // Check if furniture exists
                const furniture = await prisma.furniture.findUnique({
                    where: { id: item.furnitureId }
                });

                if (!furniture) {
                    return next(new ErrorHandler(`Furniture with ID ${item.furnitureId} not found`, 404));
                }

                // Check if furniture has enough quantity
                if (furniture.availableQuantity < item.quantity) {
                    return next(new ErrorHandler(`Not enough quantity available for ${furniture.title}`, 400));
                }
            }

            // Handle image upload if provided
            let imageUrl = null;
            if (req.files && req.files.image) {
                const image = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
                const result = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: "bundles"
                });
                imageUrl = result.secure_url;
            }

            // Create bundle with items
            const bundle = await prisma.furnitureBundle.create({
                data: {
                    name,
                    description: description || null,
                    price: Number(price),
                    imageUrl,
                    isFeatured: Boolean(isFeatured),
                    bundleItems: {
                        create: parsedBundleItems.map((item: any) => ({
                            furnitureId: item.furnitureId,
                            quantity: Number(item.quantity)
                        }))
                    }
                },
                include: {
                    bundleItems: {
                        include: {
                            furniture: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    }
                }
            });

            res.status(201).json({
                success: true,
                message: "Bundle created successfully",
                bundle
            });
        } catch (error) {
            return next(error);
        }
    }
);

export const getAllBundles = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bundles = await prisma.furnitureBundle.findMany({
                include: {
                    bundleItems: {
                        include: {
                            furniture: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            res.status(200).json({
                success: true,
                bundles
            });
        } catch (error) {
            return next(error);
        }
    }
);

export const getBundleById = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const bundle = await prisma.furnitureBundle.findUnique({
                where: { id },
                include: {
                    bundleItems: {
                        include: {
                            furniture: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    }
                }
            });

            if (!bundle) {
                return next(new ErrorHandler("Bundle not found", 404));
            }

            res.status(200).json({
                success: true,
                bundle
            });
        } catch (error) {
            return next(error);
        }
    }
);

export const updateBundle = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                price,
                isFeatured,
                bundleItems
            } = req.body;

            if (!req.user) {
                return next(new ErrorHandler("Unauthorized", 401));
            }

            const existingBundle = await prisma.furnitureBundle.findUnique({
                where: { id },
                include: {
                    bundleItems: true
                }
            });

            if (!existingBundle) {
                return next(new ErrorHandler("Bundle not found", 404));
            }

            // Handle image upload if provided
            let imageUrl = existingBundle.imageUrl;
            if (req.files && req.files.image) {
                // Delete old image if exists
                if (existingBundle.imageUrl) {
                    const segments = existingBundle.imageUrl.split("/");
                    const publicIdWithExt = segments[segments.length - 1];
                    const publicId = publicIdWithExt.split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }

                const image = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
                const result = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: "bundles"
                });
                imageUrl = result.secure_url;
            }

            // Update bundle
            const updatedBundle = await prisma.furnitureBundle.update({
                where: { id },
                data: {
                    name: name || existingBundle.name,
                    description: description !== undefined ? description : existingBundle.description,
                    price: price ? Number(price) : existingBundle.price,
                    imageUrl,
                    isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingBundle.isFeatured
                },
                include: {
                    bundleItems: {
                        include: {
                            furniture: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    }
                }
            });

            // Update bundle items if provided
            if (bundleItems) {
                // Parse bundleItems if it's a JSON string
                let parsedBundleItems = bundleItems;
                if (typeof bundleItems === 'string') {
                    try {
                        parsedBundleItems = JSON.parse(bundleItems);
                    } catch (error) {
                        return next(new ErrorHandler("Invalid bundle items format", 400));
                    }
                }

                if (Array.isArray(parsedBundleItems)) {
                    // Delete existing bundle items
                    await prisma.bundleItem.deleteMany({
                        where: { bundleId: id }
                    });

                    // Create new bundle items
                    await prisma.bundleItem.createMany({
                        data: parsedBundleItems.map((item: any) => ({
                            bundleId: id,
                            furnitureId: item.furnitureId,
                            quantity: Number(item.quantity)
                        }))
                    });

                    // Fetch updated bundle with new items
                    const finalBundle = await prisma.furnitureBundle.findUnique({
                        where: { id },
                        include: {
                            bundleItems: {
                                include: {
                                    furniture: {
                                        include: {
                                            images: true
                                        }
                                    }
                                }
                            }
                        }
                    });

                    res.status(200).json({
                        success: true,
                        message: "Bundle updated successfully",
                        bundle: finalBundle
                    });
                }
            } else {
                res.status(200).json({
                    success: true,
                    message: "Bundle updated successfully",
                    bundle: updatedBundle
                });
            }
        } catch (error) {
            return next(error);
        }
    }
);

export const deleteBundle = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (!req.user) {
                return next(new ErrorHandler("Unauthorized", 401));
            }

            const bundle = await prisma.furnitureBundle.findUnique({
                where: { id },
                include: {
                    bundleItems: true
                }
            });

            if (!bundle) {
                return next(new ErrorHandler("Bundle not found", 404));
            }

            // Delete bundle image from cloudinary if exists
            if (bundle.imageUrl) {
                const segments = bundle.imageUrl.split("/");
                const publicIdWithExt = segments[segments.length - 1];
                const publicId = publicIdWithExt.split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Delete bundle items first (cascade)
            await prisma.bundleItem.deleteMany({
                where: { bundleId: id }
            });

            // Delete the bundle
            await prisma.furnitureBundle.delete({
                where: { id }
            });

            res.status(200).json({
                success: true,
                message: "Bundle deleted successfully"
            });
        } catch (error) {
            return next(error);
        }
    }
);
