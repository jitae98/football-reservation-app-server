import express from "express";
import Field from "../models/field.model";

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

export default router;
