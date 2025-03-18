import fs from "fs";
import { prisma } from "../utils/prismaClient.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/nodeMailer.js";
export const updateProfile = catchAsyncError(async function (req, res, next) {
    const { body } = req;
    const { id: idParam } = req.params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        return next(new ErrorHandler(400, "Invalid ID provided"));
    }
    const checkOwner = await prisma.user.findFirst({
        where: { AND: [{ userId: id }, { email: req.user.email }] },
    });
    if (!checkOwner) {
        return next(new ErrorHandler(401, "You cannot update someone else's profile"));
    }
    const checkExists = await prisma.user.findUnique({ where: { userId: id } });
    if (!checkExists) {
        return next(new ErrorHandler(404, "User not found"));
    }
    if (req.body.username || req.body.email) {
        const checkUnique = await prisma.user.findFirst({
            where: {
                OR: [{ username: req.body.username }, { email: req.body.email }],
            },
        });
        if (checkUnique) {
            return next(new ErrorHandler(401, "Username or Email already exists. Choose another"));
        }
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.role) {
        return next(new ErrorHandler(401, "You can't change your role"));
    }
    if (req.files?.profilePic) {
        const file = req.files.profilePic;
        try {
            if (checkExists.profilePic) {
                const secureUrl = checkExists.profilePic;
                const publicId = secureUrl.split("/").slice(-2).join("/").split(".")[0]; // Extract Cloudinary public ID
                const deletePhoto = await cloudinary.uploader.destroy(publicId);
                if (deletePhoto.result !== "ok") {
                    throw new Error("Failed to delete the photo from Cloudinary");
                }
            }
            const upload = await cloudinary.uploader.upload(file.tempFilePath);
            body.profilePic = upload.secure_url;
        }
        catch (error) {
            console.error("Cloudinary upload/delete error:", error);
        }
        finally {
            try {
                if (file.tempFilePath) {
                    await fs.promises.unlink(file.tempFilePath);
                }
            }
            catch (unlinkError) {
                console.warn("Failed to delete temp file:", unlinkError);
            }
        }
    }
    try {
        const updatedProfile = await prisma.user.update({
            where: { userId: id },
            data: { ...body },
        });
        res.status(200).json({
            message: "User updated successfully",
            ...updatedProfile,
            password: "",
        });
    }
    catch (error) {
        return next(new ErrorHandler(500, error?.message || "Failed to update the profile"));
    }
});
export const getMyDetails = catchAsyncError(async function name(req, res, next) {
    const myDetails = await prisma.user.findFirst({
        where: {
            email: req.user.email,
        },
    });
    res.status(200).json({ ...myDetails, password: "" });
});
export const resetPassword = catchAsyncError(async function (req, res, next) {
    const { email } = req.user;
    if (!email) {
        return next(new ErrorHandler(400, "Email is required"));
    }
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);
    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
    await prisma.user.update({
        where: { userId: user.userId },
        data: {
            passwordResetToken: resetToken,
            passwordTokenExpires: tokenExpiry,
        },
    });
    const resetLink = `${process.env.FRONTEND_URL}resetPassword?token=${resetToken}`;
    const message = `Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.`;
    await sendMail(user.email, "Password Reset Request", message);
    res.status(200).json({
        success: true,
        message: "Password reset link sent to your email.",
    });
});
export const placeOrder = catchAsyncError(async function (req, res, next) {
    const { email } = req.user; // Get the email from req.user (ensure user is populated in the request)
    // Fetch the user ID using the email
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const userId = user.userId; // Get the userId from the fetched user
    // You can now use the userId and other data in the request to place the order
    const { orderData } = req.body; // Assuming orderData is part of the request body
    try {
        const order = await prisma.order.create({
            data: {
                userId,
                totalPrice: orderData.reduce((acc, item) => acc + item.totalPrice, 0), // Assuming totalPrice is in each orderData item
                orderItems: {
                    create: orderData.map((item) => ({
                        furnitureId: item.productId,
                        totalQuantity: item.quantity,
                        noOfDays: item.totalDays,
                        subTotal: item.totalPrice,
                    })),
                },
            },
        });
    }
    catch (error) {
        console.log(error);
    }
    // Example: Creating an order in the database
    res.status(201).json({
        message: "Order placed successfully",
    });
});
export const getMyOrders = catchAsyncError(async function (req, res, next) {
    const { email } = req.user; // Get the email from req.user (ensure user is populated)
    // Fetch the user by email
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            orders: {
                include: {
                    orderItems: {
                        include: {
                            furniture: {
                                include: {
                                    images: true,
                                    category: true,
                                },
                            }, // Include the related furniture data
                        },
                    },
                },
            },
        },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Return the orders related to the user
    res.status(200).json({
        message: "Orders retrieved successfully",
        orders: user.orders, // You can modify this to shape the response as needed
    });
});
