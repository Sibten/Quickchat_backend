import express from "express";
import {
  sendInv,
  acceptInv,
  getMyInv,
  getMySentInv,
} from "../controller/invitation.controller";
import { authenticateUser } from "../middleware/user.auth";

export const invRouter = express.Router();

invRouter.use(authenticateUser);
invRouter.post("/send", sendInv);
invRouter.post("/accept", acceptInv);
invRouter.get("/my_invitation", getMyInv);
invRouter.get("/my_sent_invitation", getMySentInv);
