// import User from "../models/userModel";
// import { sendEmail } from "../utils/mailer.js";

// const sendEmailToAdmins = (req, res) => {
//   const { emailType } = req.body;

//   const subject = "Your Subject Here";
//   const text = `${message}\n\nVisit us at: ${link}`;
//   const html = `
//   <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
//     <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
//       <h2 style="color: #333;">שלום!</h2>
//       <p style="color: #555;">${message}</p>
//       <p style="color: #555;">בקרו אותנו ב: <a href="${link}" style="color: #1a73e8;">${link}</a></p>
//     </div>
//     <div style="text-align: center; margin-top: 20px;">
//       <img src="your-logo-url.png" alt="Your Company Logo" style="width: 150px; height: auto;">
//     </div>
//   </div>
// `;

//   sendEmail(email, subject, text, html);

//   res.status(200).send("אימייל נשלח בהצלחה למנהל הבקרה");
// };

// export { sendEmailToAdmins };
