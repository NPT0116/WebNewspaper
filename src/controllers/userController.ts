import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import { IUser } from "~/interfaces/userInterface.js";
import { AppError } from "~/utils/appError.js";
import passport from "passport";
const router = express.Router();

// Đăng ký người dùng
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(new AppError("Can't register user", 500));
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (err: Error, user: IUser | false, info: { message: string }) => {
        if (err) {
          return next(new AppError(err.message, 500));
        }
        if (!user) {
          return next();
        }
      }
    );
  }
);

// Đăng xuất người dùng
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
});

export default router;
