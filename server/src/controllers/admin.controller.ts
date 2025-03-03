import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/error.js";
import { prisma } from "../utils/prismaClient.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";
import { Condition } from "@prisma/client";
import { generateToken } from "../utils/generateToken.js";

export const addProduct = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    name,
    categoryId,
    pricePerDay,
    description,
    isAvailable,
    dimensions,
    material,
    condition,
  } = req.body;

  // Validate required fields
  if (!name || !categoryId || !pricePerDay || !isAvailable || !description) {
    return next(new ErrorHandler(400, "Fill In All Details Carefully"));
  }
  // Validate and process images from req.files
  if (!req.files || !req.files.images) {
    return next(
      new ErrorHandler(400, "Please provide images for the product.")
    );
  }

  const images = Array.isArray(req.files.images)
    ? req.files.images
    : [req.files.images]; // Ensure images is an array

  // Upload images to Cloudinary
  const uploadedImages = await Promise.all(
    images.map(async (image) => {
      if (!image.mimetype.startsWith("image/")) {
        throw new ErrorHandler(400, "Only image files are allowed.");
      }

      const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
        folder: "furniture_products",
      });
      return result.secure_url; // Store the secure URL
    })
  );

  // Create a new product and store the Cloudinary image URLs
  const product = await prisma.furniture.create({
    data: {
      name,
      categoryId: parseInt(categoryId),
      condition: condition as Condition,
      pricePerDay: parseFloat(pricePerDay),
      description,
      isAvailable: Boolean(isAvailable),
      dimensions: dimensions || null,
      material: material || null,
      images: {
        create: uploadedImages.map((imageUrl) => ({
          imageUrl,
        })),
      },
    },
  });

  res.status(201).json({
    success: true,
    message: "Product added successfully",
    product,
  });
});
export const updateProduct = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const {
    name,
    categoryId,
    pricePerDay,
    description,
    isAvailable,
    dimensions,
    material,
    condition,
  } = req.body;

  // Validate ID
  if (!id) {
    return next(new ErrorHandler(400, "Product ID is required."));
  }

  // Check if the product exists
  const product = await prisma.furniture.findUnique({
    where: { FurnitureId: parseInt(id) },
    include: { images: true }, // Include related images
  });

  if (!product) {
    return next(new ErrorHandler(404, "Product not found."));
  }

  // Handle updating images (if provided in req.files)
  const images = req.files?.images
    ? Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images]
    : [];

  const newUploadedImages = await Promise.all(
    images.map(async (image) => {
      if (!image.mimetype.startsWith("image/")) {
        throw new ErrorHandler(400, "Only image files are allowed.");
      }

      const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
        folder: "furniture_products",
      });
      return result.secure_url; // Store the secure URL
    })
  );

  // If new images are provided, delete old images from Cloudinary and update the database
  if (newUploadedImages.length > 0) {
    await Promise.all(
      product.images.map(async (image) => {
        const publicId = image.imageUrl.split("/").pop().split(".")[0]; // Extract Cloudinary publicId
        await cloudinary.v2.uploader.destroy(`furniture_products/${publicId}`);
      })
    );

    // Delete old images from the database
    await prisma.image.deleteMany({
      where: { furnitureId: parseInt(id) },
    });

    // Add new images to the database
    await prisma.image.createMany({
      data: newUploadedImages.map((imageUrl) => ({
        imageUrl,
        furnitureId: parseInt(id),
      })),
    });
  }

  // Update product details
  const updatedProduct = await prisma.furniture.update({
    where: { FurnitureId: parseInt(id) },
    data: {
      name: name || product.name,
      categoryId: categoryId ? parseInt(categoryId) : product.categoryId,
      pricePerDay: pricePerDay ? parseFloat(pricePerDay) : product.pricePerDay,
      description: description || product.description,
      isAvailable:
        typeof isAvailable !== "undefined"
          ? Boolean(isAvailable)
          : product.isAvailable,
      dimensions: dimensions || product.dimensions,
      material: material || product.material,
      condition: condition || product.condition,
    },
    include: { images: true },
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    product: updatedProduct,
  });
});
export const deleteProduct = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    return next(new ErrorHandler(400, "Product ID is required."));
  }

  // Check if the product exists
  const product = await prisma.furniture.findUnique({
    where: { FurnitureId: parseInt(id) },
    include: { images: true, orderItems: true, Coupon: true }, // Include related entities
  });

  if (!product) {
    return next(new ErrorHandler(404, "Product not found."));
  }

  // Check if the product is associated with any order items or coupons
  if (product.orderItems.length > 0) {
    return next(
      new ErrorHandler(
        400,
        "Cannot delete product as it is part of existing orders."
      )
    );
  }

  if (product.Coupon.length > 0) {
    return next(
      new ErrorHandler(
        400,
        "Cannot delete product as it is associated with active coupons."
      )
    );
  }

  // Remove related images from Cloudinary
  if (product.images) {
    await Promise.all(
      product.images.map(async (image) => {
        const publicId = image.imageUrl.split("/").pop().split(".")[0]; // Extract Cloudinary publicId
        await cloudinary.v2.uploader.destroy(`furniture_products/${publicId}`);
      })
    );
  }

  // Delete the product from the database
  try {
    const deletedProduct = await prisma.furniture.delete({
      where: { FurnitureId: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(500, "An error occurred while deleting the product.")
    );
  }
});

export const generateCoupon = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, discount, isPercentage, furnitureId, expiryDate } = req.body;

    // Validate the required fields
    if (!code || discount === undefined || isPercentage === undefined) {
      return next(
        new ErrorHandler(400, "Code, discount, and isPercentage are required")
      );
    }

    // Create the coupon
    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        discount,
        isPercentage,
        furnitureId,
        expiryDate,
      },
    });
    res.status(201).json({
      message: "Coupon generated successfully",
      coupon: newCoupon,
    });
  }
);
export const getAllCategories = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
});
export const adminLogin = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  const checkAdmin = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (checkAdmin?.role !== "Admin") {
    return next(new ErrorHandler(400, "Opps Looks Like your are not an Admin"));
  }
  const checkPassword = await bcrypt.compare(password, checkAdmin.password);
  if (!checkPassword) {
    return next(new ErrorHandler(401, "Password Didnot Matched"));
  }
  const token = generateToken(checkAdmin.email);
  res.status(200).json({ message: "Admin Login Successful", token });
});
