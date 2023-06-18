import e from "express";
import { authenticateUser } from "../middleware/user.auth";
import { getChatRoom } from "../controller/chatroom.controller";

import {
  createChatRoom,
  loginChatRoom,
  getChatRooms,
} from "../controller/chatroom.controller";

export const chatRoomrouter = e.Router();

chatRoomrouter.use(authenticateUser);
chatRoomrouter.post("/create", createChatRoom);
chatRoomrouter.get("/join?", loginChatRoom);
chatRoomrouter.get("/myrooms", getChatRooms);
chatRoomrouter.get("/getchatroom/:chatcode", getChatRoom);
