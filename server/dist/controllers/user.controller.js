import fs from "fs";
import { prisma } from "../utils/prismaClient.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/nodeMailer.js";
export const updateProfile = catchAsyncError(async function (req, res, next) {
    console.log(req.files);
    const { body } = req;
    console.log(body);
    const { id: idParam } = req.params;
    const id = parseInt(idParam, 10);
    console.log(req.user.email);
    if (isNaN(id)) {
        return next(new ErrorHandler(400, "Invalid ID provided"));
    }
    const checkOwner = await prisma.user.findFirst({
        where: {
            AND: [{ userId: id }, { email: req.user.email }],
        },
    });
    if (!checkOwner) {
        return next(new ErrorHandler(401, "You cannot update someone else's profile"));
    }
    const checkExists = await prisma.user.findUnique({ where: { userId: id } });
    if (!checkExists) {
        return next(new ErrorHandler(404, "User not found"));
    }
    if (req.body.username || req.body.email) {
        const checkUniqie = await prisma.user.findFirst({
            where: {
                OR: [{ username: req.body.username }, { email: req.body.username }],
            },
        });
        if (checkUniqie) {
            return next(new ErrorHandler(401, "Username or Email already Exists Choose Another"));
        }
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.role) {
        return next(new ErrorHandler(401, "You can't Change your Role"));
    }
    if (req.files?.profilePic) {
        const file = req.files.profilePic;
        try {
            if (checkExists.profilePic) {
                const secureUrl = checkExists.profilePic;
                const publicId = secureUrl.split("/").slice(-2).join("/").split(".")[0];
                const deletePhoto = await cloudinary.uploader.destroy(publicId);
                if (deletePhoto.result !== "ok") {
                    throw new Error("Failed to delete the photo from Cloudinary");
                }
            }
            const upload = await cloudinary.uploader.upload(file.tempFilePath);
            body.profilePic = upload.secure_url;
            await fs.promises.unlink(file.tempFilePath);
        }
        catch (error) {
            if (file?.tempFilePath) {
                try {
                    await fs.promises.unlink(file.tempFilePath);
                }
                catch (unlinkError) {
                    console.error("Failed to delete temp file:", unlinkError);
                }
            }
            return next(new ErrorHandler(500, error.message || "File upload error"));
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
export const getMyOrders = catchAsyncError(async function (req, res, next) {
    const user = await prisma.user.findFirst({
        where: {
            email: req.user.email,
        },
    });
    const orders = await prisma.order.findFirst({
        where: {
            userId: user?.userId,
        },
    });
    res.status(200).json(orders);
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
