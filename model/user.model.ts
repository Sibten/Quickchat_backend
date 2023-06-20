import { number } from "joi";
import mongoose from "mongoose";

const conurl = process.env.MONG_CON ?? "mongodb://localhost:27017/quickchat";
mongoose
  .connect(conurl)
  .then((d) => console.log("Database is connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  user_name: String,
  user_email: String,
  friends: [{ type: mongoose.Types.ObjectId, ref: "user" }],
});

export const userModel = mongoose.model("user", userSchema);
