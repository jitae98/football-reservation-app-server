import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Booking from "../models/booking.model.ts";

const router = Router();

// Create a new booking
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { user, field, booking } = req.body;

  try {
    const newBooking = new Booking({ user, field, booking });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    next(err);
  }
});

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
