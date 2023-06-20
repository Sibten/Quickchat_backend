import e from "express";
import {
  addMessage,
  getChats,
  getChatUser,
} from "../controller/chat.controller";

export const chatRouter = e.Router();

chatRouter.post("/add", addMessage);
chatRouter.get("/get", getChats);
chatRouter.get("/getuser?", getChatUser);
chatRouter.get("/get_two_party_chat")