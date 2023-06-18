import express from "express";
import { generateOTP, verifyOTP } from "../controller/user.controller";

export const userRouter = express.Router();

userRouter.post("/generateotp", generateOTP);
userRouter.post("/verify", verifyOTP);
