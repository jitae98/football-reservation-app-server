import express from "express";
import Field from "../models/field.model";
import Booking from "../models/booking.model.ts";

const router = express.Router();

router.get("/fields", async (req, res) => {
  try {
    const fields = await Field.find();
    res.json(fields);
  } catch (error) {
    const errorMessage =
      (error as Error).message || "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

router.get("/statistic", async (req, res) => {
  const { date } = req.query;
  console.log(date)
  try {
    const fields = await Field.find();
    const bookingsCountPromises = fields.map(async (item) => {
      const existingBookingsCount = await Booking.countDocuments({
        field: item._id,
        booking: new Date(date)
      });
      return {
        fieldId: item._id,
        fieldName: item.name,
        fieldQuantity: item.quantity,
        existingBookingsCount
      };
    });
    const results = await Promise.all(bookingsCountPromises);
    res.json(results);
  } catch (error) {
    const errorMessage =
        (error as Error).message || "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

export default router;
