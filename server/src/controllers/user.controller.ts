import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/error.js";
import ErrorHandler from "../utils/errorHandler.js";
import { prisma } from "../utils/prismaClient.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
export const updateProfile = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;
  const { id: idParam } = req.params;
  const id = parseInt(idParam, 10);

  if (isNaN(id)) {
    return next(new ErrorHandler(400, "Invalid ID provided"));
  }

  const checkOwner = await prisma.user.findFirst({
    where: {
      AND: [{ id }, { email: req.user.email }],
    },
  });

  if (!checkOwner) {
    return next(
      new ErrorHandler(401, "You cannot update someone else's profile")
    );
  }

  const checkExists = await prisma.user.findUnique({ where: { id } });
  if (!checkExists) {
    return next(new ErrorHandler(404, "User not found"));
  }

  // Handle profile picture upload
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
    } catch (error) {
      if (file?.tempFilePath) {
        try {
          await fs.promises.unlink(file.tempFilePath);
        } catch (unlinkError) {
          console.error("Failed to delete temp file:", unlinkError);
        }
      }
      return next(new ErrorHandler(500, error.message || "File upload error"));
    }
  }

  try {
    const updatedProfile = await prisma.user.update({
      where: { id },
      data: { ...body },
    });

    res.status(200).json({
      message: "User updated successfully",
      updatedProfile,
    });
  } catch (error) {
    return next(
      new ErrorHandler(500, error?.message || "Failed to update the profile")
    );
  }
});
