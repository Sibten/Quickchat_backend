import nodemailer from "nodemailer";
import { otpTemplate } from "../view/otp.view";
import SMTPTransport from "nodemailer/lib/smtp-transport";
const transporter = nodemailer.createTransport({
  host: "mail.mailtest.radixweb.net",
  port: 465,
  secure: true,
  auth: {
    user: "testphp@mailtest.radixweb.net",
    pass: "Radix@web#8",
  },
});

export const sendMailtoClient = (email: string, otp: number) => {
  let mailoptions = {
    from: "testphp@mailtest.radixweb.net",
    to: email,
    subject: "Quickchat User Authentication: One Time Password",
    html: otpTemplate(otp),
  };

  return new Promise((res, rej) =>
    transporter.sendMail(
      mailoptions,
      (err: Error | null, info: SMTPTransport.SentMessageInfo) => {
        if (err) return rej(err);
        res(info);
      }
    )
  );
};
