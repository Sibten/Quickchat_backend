import express from "express";
import { authenticateUser } from '../middleware/user.auth';
import { getMyfriends } from "../controller/user.controller";

import {
  getUsers,
  generateOTP,
  verifyOTP,
  getMyProfile,
} from "../controller/user.controller";

export const userRouter = express.Router();

userRouter.post("/generateotp", generateOTP);
userRouter.post("/verify", verifyOTP);
userRouter.use(authenticateUser);
userRouter.get("/getmyprofile?", getMyProfile);
userRouter.get("/getalllist", getUsers);
userRouter.get("/myfriends", getMyfriends);