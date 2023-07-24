"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoomrouter = void 0;
const express_1 = __importDefault(require("express"));
const user_auth_1 = require("../middleware/user.auth");
const chatroom_controller_1 = require("../controller/chatroom.controller");
exports.chatRoomrouter = express_1.default.Router();
exports.chatRoomrouter.use(user_auth_1.authenticateUser);
exports.chatRoomrouter.post("/create", chatroom_controller_1.createChatRoom);
exports.chatRoomrouter.get("/join?", chatroom_controller_1.loginChatRoom);
exports.chatRoomrouter.get("/myrooms", chatroom_controller_1.getChatRooms);
exports.chatRoomrouter.get("/getchatroom/:chatcode", chatroom_controller_1.getChatRoom);
