import mongoose from "mongoose";

const conurl = process.env.MONG_CON ?? "mongodb://localhost:27017/quickchat";

mongoose
  .connect(conurl)
  .then((d) => console.log("Database is connected"))
  .catch((e) => console.log(e));

const chatSchema = new mongoose.Schema(
  {
    users: [
      { type: mongoose.Types.ObjectId, ref: "user" },
      { type: mongoose.Types.ObjectId, ref: "user" },
    ],
    messages: [
      {
        auth: { type: mongoose.Types.ObjectId, ref: "user" },
        message: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

export const chatModel = mongoose.model("chats", chatSchema);
