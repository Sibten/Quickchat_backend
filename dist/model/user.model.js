"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const conurl = process.env.MONG_CON ?? "mongodb://localhost:27017/quickchat";
mongoose_1.default
    .connect(conurl)
    .then((d) => console.log("Database is connected"))
    .catch((e) => console.log(e));
const userSchema = new mongoose_1.default.Schema({
    user_name: String,
    user_email: String,
    friends: [{ type: mongoose_1.default.Types.ObjectId, ref: "user" }],
});
exports.userModel = mongoose_1.default.model("user", userSchema);
