import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/quickchat")
  .then((d) => console.log("Database is connected"))
  .catch((e) => console.log(e));

const chatroomSchema = new mongoose.Schema(
  {
    chat_room_name: String,
    chat_room_code: String,
    status: Number,
    admin: { type: mongoose.Types.ObjectId, ref: "user" },
    message: [
      {
        auth_id: { type: mongoose.Types.ObjectId, ref: "user" },
        message: String,
        time: Date,
      },
    ],
  },
  { timestamps: true }
);

export const chatRoomModel = mongoose.model("chatroom", chatroomSchema);
