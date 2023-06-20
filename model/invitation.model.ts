import mongoose from "mongoose";

const conurl = process.env.MONG_CON ?? "mongodb://localhost:27017/quickchat";

mongoose
  .connect(conurl)
  .then((d) => console.log("Database is connected"))
  .catch((e) => console.log(e));

const invitationSchema = new mongoose.Schema({
  to: { type: mongoose.Types.ObjectId, ref: "user" },
  from: { type: mongoose.Types.ObjectId, ref: "user" },
  time: Date,
});

export const invitationModel = mongoose.model("invitation", invitationSchema);
