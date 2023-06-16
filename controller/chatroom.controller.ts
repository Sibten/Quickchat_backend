import { chatRoomModel } from "../model/chatroom.model";
import { Request, Response } from "express";
import otpGenerator from "otp-generator";
import { userModel } from "../model/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";

export const createChatRoom = async (req: Request, res: Response) => {
  const code = otpGenerator.generate(6, {
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const findUser = await userModel
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
      const newRoom = new chatRoomModel(chatRoomObject);
      await newRoom.save();

      res
        .status(200)
        .json({ create: 1, code: code, message: "Chat room created" });
    } catch (e) {
      res.status(400).json({ create: 0, message: "Error!", error: e });
    }
  } else {
    res
      .status(401)
      .json({ create: 0, message: "unauthorized creation detect" });
  }
};

export const loginChatRoom = async (req: Request, res: Response) => {
  try {
    const findRoom = await chatRoomModel
      .findOne({
        chat_room_code: req.query.chatcode,
      })
      .exec();

    if (
      findRoom?.status == 1 &&
      findRoom.chat_room_code == req.query.chatcode
    ) {
      let token: any = req.headers.token;
      let decode: JwtPayload = <JwtPayload>jwt.decode(token);

      const findUser = await userModel
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
    } else {
      res
        .status(200)
        .json({ login: 0, message: "Currently room is disabled now!" });
    }
  } catch (e) {
    res.status(400).json({ login: 0, message: "error", error: e });
  }
};

export const getChatRooms = async (req: Request, res: Response) => {
  let token: any = req.headers.token;
  let decode: JwtPayload = <JwtPayload>jwt.decode(token);

  const findUser = await userModel
    .findOne({ user_email: decode.user_email })
    .exec();

  const data = await chatRoomModel.find({ admin: findUser?._id }).exec();
  res.status(200).send(data);
};

export const getChatRoom = async (req: Request, res: Response) => {
  const fidnRoom = await chatRoomModel
    .findOne({
      chat_room_code: req.params.chatcode,
    })
    .populate("admin")
    .exec();

  res.status(200).send(fidnRoom);
};
