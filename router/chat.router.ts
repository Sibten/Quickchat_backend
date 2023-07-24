import e from "express";
import { authenticateUser } from "../middleware/user.auth";

import {
  getTwoPartyChat,
  addMessage,
  getChats,
  getChatUser,
} from "../controller/chat.controller";

export const chatRouter = e.Router();

chatRouter.use(authenticateUser);
chatRouter.post("/add", (req, res) => addMessage(req, res));
chatRouter.get("/get", getChats);
chatRouter.get("/getuser?", getChatUser);
chatRouter.get("/get_two_party_chat", getTwoPartyChat);