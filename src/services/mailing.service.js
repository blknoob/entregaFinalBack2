import nodemailer from "nodemailer";
import { getEmailTemplate } from "../utils/templates.js";

class MailingService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(email, resetToken) {
    try {
      const resetUrl = `${
        process.env.FRONTEND_URL || "http://localhost:8080"
      }/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Recuperación de Contraseña",
        html: getEmailTemplate(resetUrl, email.split("@")[0]),
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Error enviando email:", error.message);
      return { error: true, message: "Error enviando email de recuperación" };
    }
  }
}

export default MailingService;
