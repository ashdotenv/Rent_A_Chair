import crypto from "crypto"
import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { ErrorHandler } from "../utils/ErrorHandler"
import { catchAsyncError } from "../middleware/catchAsyncError"
import { prisma } from "../utils/prismaClient"
import { JWT_SECRET, NODE_ENV, PASSWORD_RESET_SECRET } from "../config/env.config"
import { sendToken } from "../utils/jwt"
import { sendEmail } from "../utils/sendEmail"
import ejs from "ejs"
import path from "path"
export const registerUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { fullName, email, password, phone, address, referralCode } = req.body
            if (!fullName || !email || !password) {
                return next(new ErrorHandler("Please provide all required fields", 400))
            }

            const existingUser = await prisma.user.findUnique({ where: { email } })
            if (existingUser) {
                return next(new ErrorHandler("User already exists with this email", 400))
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const newReferralCode = `$RAC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

            let referredById: string | null = null

            if (referralCode) {
                const referrer = await prisma.user.findUnique({
                    where: { referralCode },
                })

                if (!referrer) {
                    return next(new ErrorHandler("Invalid referral code", 400))
                }

                referredById = referrer.id
            }

            const user = await prisma.user.create({
                data: {
                    fullName,
                    email,
                    password: hashedPassword,
                    phone,
                    address,
                    referralCode: newReferralCode,
                    referredById,
                },
            })
            sendToken(user, 200, res)
        } catch (error) {
            return next(error)
        }
    }
)

export const loginUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return next(new ErrorHandler("Please provide email and password", 400))
            }

            const user = await prisma.user.findUnique({ where: { email } })
            if (!user) {
                return next(new ErrorHandler("Invalid email or password", 401))
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return next(new ErrorHandler("Invalid email or password", 401))
            }

            sendToken(user, 200, res)
        } catch (error) {
            next(error)
        }
    }
)


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body

        if (!email) {
            return next(new ErrorHandler("Email is required", 400))
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        const resetCode = Math.floor(1000 + Math.random() * 9000).toString()

        const resetCodeHash = crypto.createHash("sha256").update(resetCode).digest("hex").slice(0, 16)

        const resetToken = jwt.sign(
            { id: user.id, email: user.email, resetCodeHash },
            PASSWORD_RESET_SECRET as string,
            { expiresIn: "5m" }
        )

        const html = await ejs.renderFile(
            path.join(__dirname, "../mails/password-reset.ejs"),
            { resetCode }
        )

        await sendEmail({
            email: user.email,
            subject: "Password Reset",
            template: "password-reset.ejs",
            data: { resetCode },
        })

        res.status(200).json({
            success: true,
            message: "Password reset token generated",
            resetToken,
        })
    } catch (error) {
        next(error)
    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, resetCode, newPassword } = req.body

        if (!token || !resetCode || !newPassword) {
            return next(new ErrorHandler("Token, reset code, and new password are required", 400))
        }

        let decoded
        try {
            decoded = jwt.verify(token, PASSWORD_RESET_SECRET as string) as unknown as {
                id: string
                email: string
                resetCodeHash: string
            }
        } catch {
            return next(new ErrorHandler("Invalid or expired token", 401))
        }

        const submittedCodeHash = crypto.createHash("sha256").update(resetCode).digest("hex").slice(0, 16)

        if (submittedCodeHash !== decoded.resetCodeHash) {
            return next(new ErrorHandler("Invalid reset code", 401))
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } })

        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        })

        res.status(200).cookie("token", "", { httpOnly: true, expires: new Date(0), }).
            json({ success: true, message: "Password updated successfully", })

    } catch (error) {
        next(error)
    }
}

export const logoutUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.cookie("token", "", {
                httpOnly: true,
                expires: new Date(0),
                secure: NODE_ENV === "production",
                sameSite: "lax"
            });

            res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });
        } catch (error) {
            next(error);
        }
    }
);