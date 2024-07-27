import type { Request, Response } from "express";
import { Router } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/user.model.ts";

const router = Router();

router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your-email@example.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      to: user.email,
      from: "passwordreset@demo.com",
      subject: "Node.js Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({
        message:
          "An email has been sent to" +
          user.email +
          "with further instruction.",
      });
  } catch (err) {
    res.status(500).json({ message: "Error on the server." });
  }
});

router.post("/reset-password/:token", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Error on the server" });
  }
});

export default router;
