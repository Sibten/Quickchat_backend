"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const user_router_1 = require("./router/user.router");
const cors_1 = __importDefault(require("cors"));
const chatroom_router_1 = require("./router/chatroom.router");
const chat_router_1 = require("./router/chat.router");
dotenv_1.default.config();
const app = (0, express_1.default)();
const socket_port = parseInt(process.env.SOCKET_PORT) ?? 5050;
const http_port = parseInt(process.env.SERVER_PORT) ?? 5051;
const io = new socket_io_1.Server({
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    socket.on("join", (room) => socket.join(room));
    socket.on("new-user-joined", (room, name) => {
        socket.broadcast.to(room).emit("User Joined", {
            message: "user joined",
            auth: name,
            time: new Date(),
        });
    });
    socket.on("send", (message, room, name) => {
        socket
            .to(room)
            .emit("new message", { message: message, auth: name, time: new Date() });
    });
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/user", user_router_1.userRouter);
app.use("/chat", chat_router_1.chatRouter);
app.use("/chatroom", chatroom_router_1.chatRoomrouter);
app.listen(http_port, () => {
    console.log("HTTP Server is listening at", http_port);
});
io.listen(socket_port);
console.log("Socket is listening at", socket_port);
