"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatRoom = exports.getChatRooms = exports.loginChatRoom = exports.createChatRoom = void 0;
const chatroom_model_1 = require("../model/chatroom.model");
const otp_generator_1 = __importDefault(require("otp-generator"));
const user_model_1 = require("../model/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createChatRoom = async (req, res) => {
    const code = otp_generator_1.default.generate(6, {
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    const findUser = await user_model_1.userModel
        .findOne({ user_email: req.body.email })
        .exec();
    if (findUser) {
        const chatRoomObject = {
            chat_room_name: req.body.name,
            chat_room_code: code,
            status: 1,
            admin: findUser?._id,
            message: [],
        };
        try {
            const newRoom = new chatroom_model_1.chatRoomModel(chatRoomObject);
            await newRoom.save();
            res
                .status(200)
                .json({ create: 1, code: code, message: "Chat room created" });
        }
        catch (e) {
            res.status(400).json({ create: 0, message: "Error!", error: e });
        }
    }
    else {
        res
            .status(401)
            .json({ create: 0, message: "unauthorized creation detect" });
    }
};
exports.createChatRoom = createChatRoom;
const loginChatRoom = async (req, res) => {
    try {
        const findRoom = await chatroom_model_1.chatRoomModel
            .findOne({
            chat_room_code: req.query.chatcode,
        })
            .exec();
        if (findRoom?.status == 1 &&
            findRoom.chat_room_code == req.query.chatcode) {
            let token = req.headers.token;
            let decode = jsonwebtoken_1.default.decode(token);
            const findUser = await user_model_1.userModel
                .findOne({
                user_email: decode.user_email,
            })
                .exec();
            if (findUser?._id.toString() == findRoom.admin)
                res.status(200).json({
                    login: 1,
                    admin: 1,
                    message: "Entry Allowed!",
                });
            else
                res.status(200).json({
                    login: 1,
                    admin: 0,
                    message: "Entry Allowed!",
                });
        }
        else {
            res
                .status(200)
                .json({ login: 0, message: "Currently room is disabled now!" });
        }
    }
    catch (e) {
        res.status(400).json({ login: 0, message: "error", error: e });
    }
};
exports.loginChatRoom = loginChatRoom;
const getChatRooms = async (req, res) => {
    let token = req.headers.token;
    let decode = jsonwebtoken_1.default.decode(token);
    const findUser = await user_model_1.userModel
        .findOne({ user_email: decode.user_email })
        .exec();
    const data = await chatroom_model_1.chatRoomModel.find({ admin: findUser?._id }).exec();
    res.status(200).send(data);
};
exports.getChatRooms = getChatRooms;
const getChatRoom = async (req, res) => {
    const fidnRoom = await chatroom_model_1.chatRoomModel
        .findOne({
        chat_room_code: req.params.chatcode,
    })
        .populate("admin")
        .exec();
    res.status(200).send(fidnRoom);
};
exports.getChatRoom = getChatRoom;
