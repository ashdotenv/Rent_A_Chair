import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465, // Corrected port
  secure: true,
  auth: {
    user: "ashishghimire445@gmail.com",
    pass: process.env.GOOGLE_PASS, // Ensure this is correctly set in env
  },
});

export const sendMail = async (to: string, sub: string, msg: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"Ashish" <ashishghimire445@gmail.com>', // Ensure sender is specified
      to: to,
      subject: sub,
      html: msg,
    });

    console.log("Email sent successfully: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
