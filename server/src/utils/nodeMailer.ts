import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 456,
  auth: {
    user: `ashishghimire445@gmail.com`,
    pass: process.env.GOOGLE_PASS,
  },
});

export const sendMail = (to: string, sub: string, msg: string) => {
  transporter.sendMail({
    to: to,
    subject: sub,
    html: msg,
  });
};