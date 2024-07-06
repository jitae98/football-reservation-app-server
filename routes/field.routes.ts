import type { Request, Response, NextFunction } from "express";
import Field from "../models/field.model.ts";
import { Router } from "express";

const router = Router();

// Create a new field
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const field = new Field(req.body);
    await field.save();
    res.status(201).json(field);
  } catch (err) {
    next(err);
  }
});

// Get all fields
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fields = await Field.find();
    res.json(fields);
  } catch (err) {
    next(err);
  }
});

// Get field by id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.json(field);
  } catch (err) {
    next(err);
  }
});

// Update field by id
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const field = await Field.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.json(field);
  } catch (err) {
    next(err);
  }
});

// Delete field by id
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const field = await Field.findByIdAndDelete(req.params.id);
      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }
      res.json({ message: "Field deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
