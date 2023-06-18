"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const conurl = process.env.MONG_CON ?? "mongodb://localhost:27017/quickchat";
mongoose_1.default
    .connect(conurl)
    .then((d) => console.log("Database is connected"))
    .catch((e) => console.log(e));
const otpSchema = new mongoose_1.default.Schema({
    email: String,
    otp: Number,
    sent_time: Date,
    expriy_time: Date,
}, { timestamps: true });
exports.otpModel = mongoose_1.default.model("otp", otpSchema);
