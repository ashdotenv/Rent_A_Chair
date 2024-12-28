import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./error.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { prisma } from "../utils/prismaClient.js";

export const verifyToken = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token } = req.cookies;
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verifiedToken;
    next();
  } catch (error) {
    return next(new ErrorHandler(401, "Couldn't Verify Token"));
  }
});
export const verifyAdmin = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
    
  const { email } = req.user;
  const checkAdmin = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (checkAdmin?.role !== "Admin") {
    return next(
      new ErrorHandler(401, "You are not allowed to access this resource")
    );
  }
  next();
});
