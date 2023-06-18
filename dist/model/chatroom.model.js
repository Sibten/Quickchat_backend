"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoomModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default
    .connect("mongodb://localhost:27017/quickchat")
    .then((d) => console.log("Database is connected"))
    .catch((e) => console.log(e));
const chatroomSchema = new mongoose_1.default.Schema({
    chat_room_name: String,
    chat_room_code: String,
    status: Number,
    admin: { type: mongoose_1.default.Types.ObjectId, ref: "user" },
    message: [
        {
            auth_id: { type: mongoose_1.default.Types.ObjectId, ref: "user" },
            message: String,
            time: Date,
        },
    ],
}, { timestamps: true });
exports.chatRoomModel = mongoose_1.default.model("chatroom", chatroomSchema);
