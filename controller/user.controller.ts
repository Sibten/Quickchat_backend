import { sendMailtoClient } from "../helper/sendMail";
import { userModel } from "../model/user.model";
import { otpModel } from "../model/otp.model";
import { validateEmail } from "../validator/email.validator";
import otpGenerator from "otp-generator";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  let validate = validateEmail(req.body);
  if (!validate["error"]) {
    const email_id = req.body.email;
    const OTP = parseInt(
      otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      })
    );

    try {
      const date: Date = new Date();
      let expiryTime: Date = new Date(date.getTime() + 1000 * 60 * 5);
      let findMail = await otpModel.findOne({ email: email_id }).exec();
      await otpModel
        .updateOne(
          { email: email_id },
          {
            $set: {
              email: email_id,
              otp: OTP,
              sent_time: date,
              expriy_time: expiryTime,
            },
          },
          { upsert: true }
        )
        .exec();
      // let status = await sendMailtoClient(email_id, OTP);

      if (findMail) {
        res.status(200).json({
          found: 1,
          email: email_id,
          date: date,
          expiryTime: expiryTime,
          status: "",
        });
      } else {
        res.status(200).json({
          found: 0,
          email: email_id,
          date: date,
          expiryTime: expiryTime,
          status: "",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: 1,
        error_desc: e,
      });
    }
  } else {
    res.status(400).json({
      error: 1,
      message: "email validation error!",
      error_desc: validate["error"],
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const findOTP = await otpModel.findOne({ email: req.body.email }).exec();
  const curTime = new Date();
  if (findOTP) {
    if (
      findOTP?.otp === parseInt(req.body.otp) &&
      findOTP?.expriy_time! > curTime
    ) {
      const findUser = await userModel
        .findOne({ user_email: req.body.email })
        .exec();
      if (!findUser) {
        await addUser(req, res);
      }
      const key = process.env.JWT_KEY ?? "quick_chat_key";
      const payload = { user_email: req.body.email };
      const token = jwt.sign(payload, key);
      res
        .status(200)
        .json({ login: 1, token: token, message: "Login Successful!" });
    } else {
      res.status(401).json({ login: 0, message: "Verification failed" });
    }
  } else {
    res.status(401).json({ login: 0, message: "User not found!" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  const userObject = {
    user_name: req.body.email.split("@")[0],
    user_email: req.body.email,
  };
  const newuser = new userModel(userObject);
  await newuser.save();
};
