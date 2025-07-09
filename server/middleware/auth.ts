import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { ErrorHandler } from "../utils/ErrorHandler"
import { JWT_SECRET } from "../config/env.config"
import { prisma } from "../utils/prismaClient"

interface JwtPayload {
  id: string
  role: string
  email: string
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return next(new ErrorHandler("Unauthorized: No token provided", 401))
    }

    const { id, role } = jwt.verify(token, JWT_SECRET!) as JwtPayload


    // const user = await prisma.user.findUnique({
    //   where: { email: decoded.email },
    // })

    // if (!user) {
    //   return next(new ErrorHandler("User not found", 404))
    // }

    req.user = {
      id: id,
      role: role,
    }

    next()
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401))
  }
}

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorHandler("Forbidden: Access denied", 403))
    }
    next()
  }
}
