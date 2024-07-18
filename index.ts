import express from "express";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bookingRoutes from "./routes/booking.routes.ts";
import fieldRoutes from "./routes/field.routes.ts";
import userRoutes from "./routes/user.routes.ts";
import authMiddleware from "./middleware/auth.middleware.ts";
import errorHandler from "./middleware/error.middleware.ts";

configDotenv();
const app = express();
app.use(express.json());
app.use(cors());

const MONGODB_URL =
  process.env.MONGO_DB_URL ||
  "mongodb+srv://hieunm1:hieunm98@mycloud.xwhohwz.mongodb.net/?retryWrites=true&w=majority&appName=Mycloud";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("MongoDB connected..."))
  .catch((err: Error) => {
    console.log("Failed to connect to MonggoDB", err);
    process.exit(1);
  });
// Middleware
app.use(authMiddleware);
// Error hanndling middleware
app.use(errorHandler);

// Routes
app.use("/users", userRoutes);
app.use("/fields", fieldRoutes);
app.use("/bookings", bookingRoutes);

app.listen(process.env.PORT, () => {
  console.log(`App is running on http://localhost:${process.env.PORT}`);
});
