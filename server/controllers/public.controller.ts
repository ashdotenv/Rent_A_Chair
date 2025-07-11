import { NextFunction, Request, Response } from "express"
import { catchAsyncError } from "../middleware/catchAsyncError"
import { prisma } from "../utils/prismaClient"
import { ErrorHandler } from "../utils/ErrorHandler"
import { FurnitureCategory } from "@prisma/client"
export const getAllFurniture = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const furniture = await prisma.furniture.findMany({
        include: { images: true },
        orderBy: { createdAt: "desc" },
      })
      res.status(200).json({ success: true, furniture })
    } catch (error) {
      return next(error)
    }
  }
)

export const getFurnitureByCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category } = req.params

      const validCategories: FurnitureCategory[] = [
        "SOFA", "BED", "TABLE", "CHAIR", "WARDROBE", "DESK", "BOOKSHELF",
        "DRESSER", "NIGHTSTAND", "CABINET", "OTTOMAN", "RECLINER", "BENCH",
        "HUTCH", "TV_STAND", "DINING_SET", "ENTRYWAY", "STORAGE",
        "KITCHEN_ISLAND", "VANITY", "SECTIONAL", "LOVESEAT", "FILING_CABINET", "OTHER"
      ]

      if (!validCategories.includes(category as FurnitureCategory)) {
        return next(new ErrorHandler("Invalid furniture category", 400))
      }

      const furniture = await prisma.furniture.findMany({
        where: { category: category as FurnitureCategory },
        include: {
          images: true,
          ratings: true
        },
        orderBy: { createdAt: "desc" }
      })

      res.status(200).json({
        success: true,
        count: furniture.length,
        furniture
      })
    } catch (error) {
      next(error)
    }
  }
)

export const getTopFeaturedProducts = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 9;
      // Use MySQL-compatible raw SQL for random selection
      const furniture = await prisma.$queryRawUnsafe<any[]>(
        'SELECT * FROM `Furniture` WHERE `isFeatured` = true ORDER BY RAND() LIMIT ?',
        limit
      );
      // Fetch images for each furniture (since $queryRaw does not join images)
      const ids = furniture.map((f: any) => f.id);
      const images = await prisma.furnitureImage.findMany({
        where: { furnitureId: { in: ids } },
      });
      const furnitureWithImages = furniture.map((f: any) => ({
        ...f,
        images: images.filter(img => img.furnitureId === f.id)
      }));
      res.status(200).json({ success: true, count: furnitureWithImages.length, furniture: furnitureWithImages });
    } catch (error) {
      return next(error);
    }
  }
);

export const getFurnitureById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const furniture = await prisma.furniture.findUnique({
        where: { id },
        include: {
          images: true,
          ratings: true
        }
      });
      
      if (!furniture) {
        return next(new ErrorHandler("Furniture not found", 404));
      }
      res.status(200).json({ success: true, furniture });
    } catch (error) {
      return next(error);
    }
  }
);
