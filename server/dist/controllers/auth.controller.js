import ErrorHandler from "../utils/errorHandler.js";
import { prisma } from "../utils/prismaClient.js";
import { generateToken } from "../utils/generateToken.js";
import { catchAsyncError } from "../middlewares/error.js";
import bcrypt from "bcrypt";
export const Register = catchAsyncError(async function (req, res, next) {
    const { fullName, username, email, password } = req.body;
    if (!password || !fullName || !email || !password || !username) {
        return next(new ErrorHandler(400, "Fill In All Details Carefully"));
    }
    const checkUniqie = await prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
    });
    if (checkUniqie) {
        return next(new ErrorHandler(400, "Username or Email Already Exists"));
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: { ...req.body, password: hashedPass },
    });
    const token = generateToken(email);
    res
        .status(201)
        .cookie("token", token, {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        partitioned: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 15),
    })
        .json({ message: "User Created Successfully", newUser });
});
export const Login = catchAsyncError(async function (req, res, next) {
    const { email, password } = req.body;
    const chechUser = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!chechUser) {
        return next(new ErrorHandler(400, "User With the Email not Found"));
    }
    const checkPassword = await bcrypt.compare(password, chechUser.password);
    if (!checkPassword) {
        return next(new ErrorHandler(400, "Password Didn't Matched"));
    }
    const token = generateToken(email);
    res
        .status(200)
        .cookie("token", token, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        partitioned: true,
        maxAge: 100 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 24 * 60 * 60 * 15),
    })
        .json({ message: "Logged In Successfully" });
});
