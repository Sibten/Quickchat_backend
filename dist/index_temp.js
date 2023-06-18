"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = parseInt(process.env.PORT) ?? 5050;
const io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:3000",
    },
});
const Users = {};
io.on("connection", (socket) => {
    socket.on("new-user-joined", (name) => {
        console.log("New User Joined", name);
        Users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });
    socket.on("send", (message) => {
        socket.broadcast.emit("message", {
            message: message,
            name: Users[socket.id],
        });
    });
});
io.listen(port);
console.log("Socket is listening at", port);
