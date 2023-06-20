import { Request, Response, json } from "express";
import { chatModel } from "../model/chats.model";
import { userModel } from "../model/user.model";

export const addMessage = async (req: Request, res: Response, msg?: string) => {
  const findUserS = await userModel
    .findOne({ user_email: req.body.from })
    .exec();
  const findUserR = await userModel.findOne({ user_email: req.body.to }).exec();

  let rId = findUserR?._id;
  let sId = findUserS?._id;

  let messageBody = {
    auth: findUserS?._id,
    message: req.body.message ?? msg,
    timestamp: new Date(),
  };

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
};