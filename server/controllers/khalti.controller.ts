import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { prisma } from "../utils/prismaClient";
import { ErrorHandler } from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { CLIENT_URL, KHALTI_GATEWAY_URL, KHALTI_SECRET_KEY } from "../config/env.config";
// Initiate Khalti Payment and Rental
export const initiatePayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("Unauthorized", 401));
      }
      const {
        items,
        startDate,
        endDate,
        deliveryAddress,
        customer_info,
        discountCode,
        paymentMethod
      } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return next(new ErrorHandler("No items provided", 400));
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      let totalAmount = 0;
      const createdRentals = [];
      for (const item of items) {
        const { furnitureId, quantity = 1, rentalType, purchase_order_name } = item;
        const furniture = await prisma.furniture.findUnique({ where: { id: furnitureId } });
        if (!furniture) return next(new ErrorHandler("Furniture not found", 404));
        if (furniture.availableQuantity < quantity) return next(new ErrorHandler("Not enough furniture in stock", 400));
        let rentalRate = 0;
        if (rentalType === "DAILY") rentalRate = furniture.dailyRate;
        else if (rentalType === "WEEKLY") rentalRate = furniture.weeklyRate;
        else rentalRate = furniture.monthlyRate;
        const itemTotal = rentalRate * totalDays * quantity;
        totalAmount += itemTotal;
        // Create rental (PENDING)
        const rental = await prisma.rental.create({
          data: {
            userId: req.user.id,
            furnitureId,
            rentalType,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalAmount: itemTotal,
            paymentMethod: "KHALTI",
            paymentStatus: "PENDING",
            status: "PENDING",
            deliveryStreet: deliveryAddress.street,
            deliveryCity: deliveryAddress.city,
            deliveryState: deliveryAddress.state,
            deliveryPostalCode: deliveryAddress.postalCode,
            deliveryCountry: deliveryAddress.country,
            discountCode: discountCode || null,
            quantity
          }
        });
        createdRentals.push(rental);
        await prisma.furniture.update({
          where: { id: furnitureId },
          data: {
            availableQuantity: {
              decrement: quantity
            }
          }
        });
      }
      // Create payment (PENDING) for the first rental only (schema limitation)
      const payment = await prisma.payment.create({
        data: {
          paymentMethod: "KHALTI",
          status: "PENDING",
          amount: totalAmount,
          rentalId: createdRentals[0].id, // Only one rental per payment in schema
        }
      });
      // Initiate Khalti payment
      const response = await axios.post(
        `${KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
        {
          return_url: CLIENT_URL+"/payment/verify",
          website_url: CLIENT_URL,
          amount: Math.round(totalAmount * 100), // Khalti expects paisa
          purchase_order_id: payment.id,
          purchase_order_name: items.map(i => i.purchase_order_name).join(", "),
          customer_info,
        },
        {
          headers: {
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json({
        success: true,
        rentalIds: createdRentals.map(r => r.id),
        paymentId: payment.id,
        khalti: response.data
      });
    } catch (error: any) {
      return next(new ErrorHandler(error?.response?.data?.detail || error.message, 400));
    }
  })

// Verify Khalti Payment (after user completes payment)
export const verifyPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
  
    const { pidx, token, amount, paymentId } = req.query;
    let response;
    if (pidx) {
      response = await axios.post(
        `${KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
        { pidx },
        {
          headers: {
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status !== "Completed") {
        return next(new ErrorHandler("Payment not completed", 400));
      }
    } else if (token && amount) {
      const amountNumber = typeof amount === "string" ? parseInt(amount as string, 10) : amount;
      response = await axios.post(
        `${KHALTI_GATEWAY_URL}/api/v2/payment/verify/`,
        { token, amount: amountNumber },
        {
          headers: {
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.state?.name !== "Completed") {
        return next(new ErrorHandler("Payment not completed", 400));
      }
    } else {
      return next(new ErrorHandler("Invalid verification payload", 400));
    }

    // Check if payment is already verified
    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId as string },
      include: { rental: true },
    });
    if (existingPayment?.status === "SUCCESS") {
      // Already verified, return rental details
      return res.json({ success: true, alreadyVerified: true, rental: existingPayment.rental });
    }

    // Save KhaltiPayment and update Payment & Rental
    const payment = await prisma.payment.update({
      where: { id: paymentId as string },
      data: {
        status: "SUCCESS",
        transactionId: response.data.transaction_id || response.data.idx,
        paidAt: new Date(),
        gatewayMeta: response.data,
        khaltiPayment: {
          upsert: {
            create: {
              transactionId: response.data.transaction_id || response.data.idx,
              token: (pidx || token) as string,
              rawResponse: response.data,
            },
            update: {
              transactionId: response.data.transaction_id || response.data.idx,
              token: (pidx || token) as string,
              rawResponse: response.data,
            }
          }
        },
      },
      include: { khaltiPayment: true, rental: true },
    });
    await prisma.rental.update({
      where: { id: payment.rentalId },
      data: { paymentStatus: "SUCCESS", status: "ACTIVE" },
    });
    res.json({ success: true, payment });
  } catch (error: any) {
    return next(new ErrorHandler(error?.response?.data?.detail || error.message, 400));
  }
}); 