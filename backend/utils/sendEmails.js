import { sendEmail } from "./mailer.js";
import fs from "fs";
import path from "path";
import ejs from "ejs";

export const sendEmailsHandler = (res, to, name, email, toAdmins) => {
  const subject = toAdmins
    ? `${name} ממתין לאישור במערכת המשמרות`
    : "ברוך הבא למערכת המשמרות!";
  const header = toAdmins ? "שלום מנהל יקר!" : `שלום ${name}!`;
  const message = toAdmins
    ? `משתמש חדש בשם ${name} עם דוא"ל ${email} נרשם למערכת המשמרות ומחכה לאישורך.`
    : "מנהל הבקרה אישר אותך במערכת המשמרות. כעת תוכל/י להתחבר למערכת ולנהל את המשמרות שלך בקלות ובנוחות.";
  const link = "https://nochotmobile-shifts-scheduling-system.onrender.com";

  // Set path to the email template
  const __dirname = path.resolve();
  const templatePath = path.join(
    __dirname,
    "backend/Assets/emailTemplate.html"
  );

  // Read the HTML template
  fs.readFile(templatePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading email template:", err);
      return;
    }

    // Render the HTML with dynamic content
    const html = ejs.render(data, { header, message, link });

    // Send the email
    sendEmail(to, subject, html);
  });
};
