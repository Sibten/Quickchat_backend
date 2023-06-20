import { Request, Response } from "express";
import { userModel } from "../model/user.model";
import { invitationModel } from "../model/invitation.model";
import { addMessage } from "./chat.controller";
export const sendInv = async (req: Request, res: Response) => {
  const from_user = await userModel
    .findOne({ user_email: req.body.from })
    .exec();
  const to_user = await userModel.findOne({ user_email: req.body.to }).exec();

  console.log(to_user);

  let body = {
    to: to_user?._id,
    from: from_user?._id,
    time: new Date(),
  };

  try {
    const newInvReq = new invitationModel(body);
    await newInvReq.save();
    res.status(201).json({ add: 1, message: "Added!" });
  } catch (e) {
    res.status(400).json({ add: 0, error: e });
  }
};

export const acceptInv = async (req: Request, res: Response) => {
  const from_user = await userModel
    .findOne({ user_email: req.body.from })
    .exec();
  const to_user = await userModel.findOne({ user_email: req.body.to }).exec();

  try {
    await userModel
      .updateOne(
        { user_email: from_user?.user_email },
        { $push: { friends: to_user?._id } }
      )
      .exec();
    await userModel
      .updateOne(
        { user_email: to_user?.user_email },
        { $push: { friends: from_user?._id } }
      )
      .exec();

    await invitationModel
      .findOneAndRemove({
        from: to_user?._id,
        to: from_user?._id,
      })
      .exec();

    await addMessage(req, res, "Invitation Accepetd!");
  } catch (e) {
    res.status(400).json({ add: 0, error: e });
  }
};

export const getMyInv = async (req: Request, res: Response) => {
  try {
    const findUser = await userModel
      .findOne({ user_email: req.query.email })
      .exec();

    const data = await invitationModel
      .find({ to: findUser?._id }, { from: 1, time: 1 })
      .populate({ path: "from", select: "user_email user_name" })
      .exec();

    let sendData: Array<any> = [];
    data.forEach((s) => {
      sendData.push(s?.from);
    });

    res.status(200).send(sendData);
  } catch (e) {
    res.status(400).json({ find: 0, error: e });
  }
};

export const getMySentInv = async (req: Request, res: Response) => {
  try {
    const findUser = await userModel
      .findOne({ user_email: req.query.email })
      .exec();
    const data = await invitationModel
      .find({ from: findUser?._id })
      .populate({ path: "to", select: "user_email user_name" })
      .exec();

    let sendData: Array<any> = [];

    data.forEach((s) => {
      sendData.push(s.to);
    });
    res.status(200).send(sendData);
  } catch (e) {}
};
