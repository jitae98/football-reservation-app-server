import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import User from "../models/user.model.ts";

const router = Router();

// // User registration
// router.post(
//   "/register",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, email, password } = req.body;
//
//       // Check if all fields are provided
//       if (!name || !email || !password) {
//         return res
//           .status(400)
//           .json({ message: "Name, email, and password are required" });
//       }
//
//       // Check if user already registered
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "Already registered" });
//       }
//
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
//
//       // Create a new user
//       const user = new User({ name, email, password: hashedPassword });
//       await user.save();
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
//         expiresIn: "1h",
//       });
//
//       // Trả về thông tin người dùng và token
//       res.status(201).json({
//         message: "User registered successfully",
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//         },
//         token,
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// );
//
// // User login
// router.post(
//   "/login",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email, password } = req.body;
//
//       // Check if the user exist
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(400).json({ message: "Invalid email or password" });
//       }
//
//       // Compare password
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: "Invalid email or password" });
//       }
//
//       // Generate JWT
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
//         expiresIn: "1h",
//       });
//
//       // Trả về thông tin người dùng và token
//       res.status(200).json({
//         message: "Success",
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//         },
//         token,
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// Create a new user (extra route, not required for registration)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Get all users
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Get user by id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Update user by id
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Delete user by id
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
