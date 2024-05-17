import { sendEmail } from "./mailer.js";

export const sendEmailToAdmins = (to, name) => {
  const subject = `${name} ממתין לאישור במערכת המשמרות`;
  const link = "https://nochotmobile-shifts-scheduling-system.onrender.com";
  const message = `משתמש חדש בשם ${name} עם דוא"ל ${to} נרשם למערכת המשמרות ומחכה לאישורך.`;
  const html = `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
  <div style="text-align: right; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
    <h2 style="color: #333;">שלום מנהל יקר!</h2>
    <p style="color: #555;">${message}</p>
    <p style="color: #555;">קישור למערכת המשמרות: <a href="${link}" style="color: #1a73e8;">${link}</a></p>
  </div>
  <div style="text-align: right; margin-top: 20px;">
    <img src="cid:logo" alt="NOC shifts HOTmobile logo" style="width: 180px; height: auto;">
  </div>
</div>
`;

  sendEmail(to, subject, html);

  res.status(200).send("אימייל נשלח בהצלחה למנהל הבקרה");
};
