import { Server } from "socket.io";
import env from "dotenv";

env.config();

const port: number = parseInt(process.env.PORT!) ?? 5050;

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

const Users: { [index: string]: any } = {};

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
