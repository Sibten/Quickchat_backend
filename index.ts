import { Server, Socket } from "socket.io";
import env from "dotenv";
import express from "express";
import { userRouter } from "./router/user.router";
import cors from "cors";
import { chatRoomrouter } from "./router/chatroom.router";
import { chatRouter } from "./router/chat.router";
env.config();

const app = express();

const socket_port: number = parseInt(process.env.SOCKET_PORT!) ?? 5050;
const http_port: number = parseInt(process.env.SERVER_PORT!) ?? 5051;
const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
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

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/chatroom", chatRoomrouter);
app.listen(http_port, () => {
  console.log("HTTP Server is listening at", http_port);
});

io.listen(socket_port);
console.log("Socket is listening at", socket_port);
