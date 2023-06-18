import mongoose from "mongoose";

const conurl = process.env.MONG_CON ?? "mongodb://localhost:27017/quickchat";

mongoose
  .connect(conurl)
  .then((d) => console.log("Database is connected"))
  .catch((e) => console.log(e));

const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: Number,
    sent_time: Date,
    expriy_time: Date,
  },
  { timestamps: true }
);

export const otpModel = mongoose.model("otp", otpSchema);
