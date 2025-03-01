import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/error.js";
import ErrorHandler from "../utils/errorHandler.js";
import { prisma } from "../utils/prismaClient.js";

export const getAllProducts = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract query parameters
    const {
      price,
      condition,
      category,
      name,
      material,
      isAvailable,
      description,
      sortBy,
      order,
    } = req.query;

    // Initialize where filter for Prisma query
    let filters: any = {};

    // Filter by price range (e.g., ?price=5-20)
    if (price) {
      const priceRange = String(price).split("-");
      const minPrice = parseFloat(priceRange[0]);

      if (priceRange.length > 1) {
        // Range query (min-max)
        const maxPrice = parseFloat(priceRange[1]);
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
          filters.pricePerDay = {
            gte: minPrice,
            lte: maxPrice,
          };
        }
      } else if (!isNaN(minPrice)) {
        // Exact price match
        filters.pricePerDay = minPrice;
      }
    }

    // Filter by condition (case-insensitive)
    if (condition) {
      filters.condition = {
        equals: String(condition),
        mode: "insensitive",
      };
    }

    // Filter by category (e.g., ?category=1)
    if (category) {
      const categoryId = parseInt(String(category));
      if (!isNaN(categoryId)) {
        filters.categoryId = categoryId;
      }
    }

    // Filter by name (case-insensitive partial match)
    if (name) {
      filters.name = {
        contains: String(name),
        mode: "insensitive",
      };
    }

    // Filter by material (case-insensitive partial match)
    if (material) {
      filters.material = {
        contains: String(material),
        mode: "insensitive",
      };
    }

    // Filter by availability (boolean conversion)
    if (isAvailable !== undefined) {
      filters.isAvailable = String(isAvailable).toLowerCase() === "true";
    }

    // Filter by description (case-insensitive partial match)
    if (description) {
      filters.description = {
        contains: String(description),
        mode: "insensitive",
      };
    }

    // Set up ordering
    const orderBy: any = {};
    if (sortBy) {
      const validSortFields = ["pricePerDay", "name", "createdAt", "condition"];
      const field = String(sortBy);

      if (validSortFields.includes(field)) {
        orderBy[field] =
          String(order).toLowerCase() === "desc" ? "desc" : "asc";
      }
    } else {
      // Default sorting by creation date (newest first)
      orderBy.createdAt = "desc";
    }

    // Query the database with filters
    const products = await prisma.furniture.findMany({
      where: filters,
      include: {
        images: true, // Include related images
        category: true, // Include category details
      },
      orderBy,
    });

    // Return the products
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return next(new ErrorHandler(500, "Internal Server Error"));
  }
});
export const getProductById = catchAsyncError(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler(400, "You Must Provide Product ID"));
  }
  const product = await prisma.furniture.findFirst({
    where: {
      FurnitureId: parseInt(id),
    },
    include: {
      images: true,
      category: true,
    },
  });
  return res.status(200).json({ product });
});
