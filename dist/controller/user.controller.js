"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyfriends = exports.getMyProfile = exports.getUsers = exports.addUser = exports.verifyOTP = exports.generateOTP = void 0;
const sendMail_1 = require("../helper/sendMail");
const user_model_1 = require("../model/user.model");
const otp_model_1 = require("../model/otp.model");
const email_validator_1 = require("../validator/email.validator");
const otp_generator_1 = __importDefault(require("otp-generator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateOTP = async (req, res) => {
    let validate = (0, email_validator_1.validateEmail)(req.body);
    if (!validate["error"]) {
        const email_id = req.body.email;
        const OTP = parseInt(otp_generator_1.default.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        }));
        try {
            const date = new Date();
            let expiryTime = new Date(date.getTime() + 1000 * 60 * 5);
            let findMail = await otp_model_1.otpModel.findOne({ email: email_id }).exec();
            await otp_model_1.otpModel
                .updateOne({ email: email_id }, {
                $set: {
                    email: email_id,
                    otp: OTP,
                    sent_time: date,
                    expriy_time: expiryTime,
                },
            }, { upsert: true })
                .exec();
            let status = await (0, sendMail_1.sendMailtoClient)(email_id, OTP);
            if (findMail) {
                res.status(200).json({
                    found: 1,
                    email: email_id,
                    date: date,
                    expiryTime: expiryTime,
                    status: status,
                });
            }
            else {
                res.status(200).json({
                    found: 0,
                    email: email_id,
                    date: date,
                    expiryTime: expiryTime,
                    status: "",
                });
            }
        }
        catch (e) {
            res.status(500).json({
                error: 1,
                error_desc: e,
            });
        }
    }
    else {
        res.status(400).json({
            error: 1,
            message: "email validation error!",
            error_desc: validate["error"],
        });
    }
};
exports.generateOTP = generateOTP;
const verifyOTP = async (req, res) => {
    const findOTP = await otp_model_1.otpModel.findOne({ email: req.body.email }).exec();
    const curTime = new Date();
    if (findOTP) {
        if (findOTP?.otp === parseInt(req.body.otp) &&
            findOTP?.expriy_time > curTime) {
            const findUser = await user_model_1.userModel
                .findOne({ user_email: req.body.email })
                .exec();
            if (!findUser) {
                await (0, exports.addUser)(req, res);
            }
            const key = process.env.JWT_KEY ?? "quick_chat_key";
            const payload = { user_email: req.body.email };
            const token = jsonwebtoken_1.default.sign(payload, key);
            res
                .status(200)
                .json({ login: 1, token: token, message: "Login Successful!" });
        }
        else {
            res.status(401).json({ login: 0, message: "Verification failed" });
        }
    }
    else {
        res.status(401).json({ login: 0, message: "User not found!" });
    }
};
exports.verifyOTP = verifyOTP;
const addUser = async (req, res) => {
    const userObject = {
        user_name: req.body.email.split("@")[0],
        user_email: req.body.email,
    };
    const newuser = new user_model_1.userModel(userObject);
    await newuser.save();
};
exports.addUser = addUser;
const getUsers = async (req, res) => {
    const data = await user_model_1.userModel.find({}).exec();
    res.status(200).send(data);
};
exports.getUsers = getUsers;
const getMyProfile = async (req, res) => {
    const findUser = await user_model_1.userModel
        .findOne({ user_email: req.query.email })
        .exec();
    if (findUser) {
        res.status(200).send(findUser);
    }
    else {
        res.status(400).json({ find: 0, message: "user nnot found!" });
    }
};
exports.getMyProfile = getMyProfile;
const getMyfriends = async (req, res) => {
    const data = await user_model_1.userModel.findOne({ user_email: req.query.email }, { friends: 1 }).populate({ path: 'friends', select: 'user_name user_email' }).exec();
    res.status(200).send(data);
};
exports.getMyfriends = getMyfriends;
// export const sendRequest = async (req: Request, res: Response) => {
//   let findUser = await userModel
//     .findOne({ user_email: req.body.from_email })
//     .exec();
//   let body = {
//     user_id: findUser?._id,
//     status: Invite.send,
//   };
//   await userModel
//     .updateOne(
//       { user_email: req.body.to_email },
//       { $push: { invitation: body } },
//       { upsert: true }
//     )
//     .exec();
//   res.status(200).json({ update: 1, message: "Udpated!" });
// };
// export const acceptRequest = (req: Request, res: Response) => {};
