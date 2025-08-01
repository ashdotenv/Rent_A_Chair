import { Response } from "express";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  NODE_ENV,
} from "../config/env.config";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none";
  secure: boolean;
}

interface IUser {
  id: string;
  email: string;
  role: string;
  password?: string;
}

const tokenOptions: ITokenOptions = {
  httpOnly: true,
  sameSite: NODE_ENV === "production" ? "lax" : "lax",
  secure: NODE_ENV === "production",
  expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  maxAge: 15 * 24 * 60 * 60 * 1000,
};

export const signToken = (user: IUser): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET as string,
    { expiresIn: "15d" }
  );
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user);

  res.cookie("token", token, tokenOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      ...user,
      password: "",
    },
  });
};
