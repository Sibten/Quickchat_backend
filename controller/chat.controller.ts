import { Request, Response, json } from "express";
import { chatModel } from "../model/chats.model";
import { userModel } from "../model/user.model";

export const addMessage = async (
  req: Request,
  res: Response,
  msg?: string,
  auth?: any,
  chatKey?: any
) => {
  const findUserS = await userModel
    .findOne({ user_email: req.body.from })
    .exec();
  const findUserR = await userModel.findOne({ user_email: req.body.to }).exec();

  let rId = findUserR?._id;
  let sId = findUserS?._id;

  let messageBody = {
    auth: auth === null ? null : findUserS?._id,
    message: req.body.message ?? msg,
    timestamp: new Date(),
  };
  const findChat = await chatModel
    .findOne({ users: { $all: [rId, sId] } })
    .exec();

  const chat_key = findChat?.chatkey ?? chatKey;

  await chatModel
    .updateOne(
      {
        users: {
          $all: [{ $elemMatch: { $eq: rId } }, { $elemMatch: { $eq: sId } }],
        },
      },
      {
        $set: {
          users: [rId, sId],
          chatkey: chat_key,
        },
        $push: {
          messages: messageBody,
        },
      },
      { upsert: true }
    )
    .exec();
  res.status(201).json({ insert: 1, message: "Updated!" });
};
//ALL chat
export const getChats = async (req: Request, res: Response) => {
  const data = await chatModel
    .find({})
    .populate("users")
    .populate("messages.auth")
    .exec();
  res.status(200).send(data);
};

// part. Chat

export const getChatUser = async (req: Request, res: Response) => {
  const findUser = await userModel
    .findOne({ user_email: req.query.user_email })
    .exec();

  const uid = findUser?._id;
  const data = await chatModel.find({ users: uid }).exec();

  res.status(200).send(data);
};

export const getTwoPartyChat = async (req: Request, res: Response) => {
  const findUser1 = await userModel
    .findOne({ user_email: req.query.email1 })
    .exec();
  const findUser2 = await userModel
    .findOne({ user_email: req.query.email2 })
    .exec();
  const data = await chatModel
    .findOne(
      {
        users: { $all: [findUser1?._id, findUser2?._id] },
      },
      { messages: 1, chatkey: 1 }
    )
    .populate({ path: "messages.auth", select: "user_name user_email" })
    .exec();

  res.status(200).send(data);
};