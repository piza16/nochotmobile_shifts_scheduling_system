import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use other services like 'Yahoo', 'Outlook', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_APP,
  },
});

export const sendEmail = (to, subject, html) => {
  const __dirname = path.resolve();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "backend/Assets/logo.png"),
        cid: "logo",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
