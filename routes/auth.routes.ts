import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// User registration
router.post(
    "/register",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;

            // Check if all fields are provided
            if (!name || !email || !password) {
                return res
                    .status(400)
                    .json({ message: "Name, email, and password are required" });
            }

            // Check if user already registered
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Already registered" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const user = new User({ name, email, password: hashedPassword });
            await user.save();
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
                expiresIn: "1h",
            });

            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            });
        } catch (err) {
            next(err);
        }
    }
);

// User login
router.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            // Check if the user exist
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Generate JWT
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
                expiresIn: "1h",
            });

            res.status(200).json({
                message: "Success",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router