"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailtoClient = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const otp_view_1 = require("../view/otp.view");
const transporter = nodemailer_1.default.createTransport({
    host: "mail.mailtest.radixweb.net",
    port: 465,
    secure: true,
    auth: {
        user: "testphp@mailtest.radixweb.net",
        pass: "Radix@web#8",
    },
});
const sendMailtoClient = (email, otp) => {
    let mailoptions = {
        from: "testphp@mailtest.radixweb.net",
        to: email,
        subject: "Quickchat User Authentication: One Time Password",
        html: (0, otp_view_1.otpTemplate)(otp),
    };
    return new Promise((res, rej) => transporter.sendMail(mailoptions, (err, info) => {
        if (err)
            return rej(err);
        res(info);
    }));
};
exports.sendMailtoClient = sendMailtoClient;
