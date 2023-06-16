import { Server, Socket } from "socket.io";
import env from "dotenv";
import express from "express";
import { userRouter } from "./router/user.router";
import cors from "cors";
import { chatRoomrouter } from "./router/chatroom.router";
env.config();

const app = express();

const socket_port: number = parseInt(process.env.SOCKET_PORT!) ?? 5050;
const http_port: number = parseInt(process.env.SERVER_PORT!) ?? 5051;
const io = new Server({
  cors: {
    origin: "*",
  },
});

const Users: { [index: string]: any } = {};

io.on("connection", (socket: Socket) => {
  const roomId = socket.handshake.query.room;
  socket.on("join", (room) => socket.join(room));

  socket.on("private message", (room, msg) => {
    socket.in(room).emit("private message", msg);
  });

  socket.on("new-user-joined", (room, name) => {
    console.log("New User Joined", name);
    Users[socket.id] = name;
    socket.broadcast.in(room).emit("User Joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("message", {
      message: message,
      name: Users[socket.id],
    });
  });
});

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/chatroom", chatRoomrouter);
app.listen(http_port, () => {
  console.log("HTTP Server is listening at", http_port);
});

io.listen(socket_port);
console.log("Socket is listening at", socket_port);
