import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.ts";
import Booking from "../models/booking.model.ts";
import Field from "../models/field.model.ts";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = Router();

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const { fieldId, bookingDate } = req.body;

    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload;
      const userId = decoded.userId;
      if (
        !mongoose.Types.ObjectId.isValid(fieldId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        return res.status(400).json({ message: "Invalid fieldId or userId" });
      }

      // Tìm thông tin sân
      const field = await Field.findById(fieldId);
      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }

      // Đếm số lượng booking hiện tại cho sân vào ngày cụ thể
      const existingBookingsCount = await Booking.countDocuments({
        field: fieldId,
        booking: new Date(bookingDate),
      });

      // So sánh số lượng booking hiện tại với số lượng có sẵn của sân
      if (existingBookingsCount >= field.quantity) {
        return res
          .status(400)
          .json({ message: "Field is fully booked for this date" });
      }

      const newBooking = new Booking({
        user: new mongoose.Types.ObjectId(userId as string),
        field: new mongoose.Types.ObjectId(fieldId as string),
        booking: new Date(bookingDate),
      });
      await newBooking.save();

      const populatedBooking = await Booking.findById(newBooking._id)
        .populate("user", "name email")
        .populate("field", "name")
        .exec();

      if (!populatedBooking || !populatedBooking.booking) {
        return res
          .status(500)
          .json({ message: "Error retrieving booking details" });
      }

      res.status(201).json({
        user: populatedBooking?.user,
        field: populatedBooking?.field,
        date: formatDate(populatedBooking?.booking),
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get all bookings
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find().populate("user").populate("field");
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// Get booking by id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("field");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// Update booking by id
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("user")
      .populate("field");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// Delete booking by id
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await Booking.findByIdAndDelete(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ message: "Booking deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
