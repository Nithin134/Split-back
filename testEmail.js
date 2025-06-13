// testEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send a test email
const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: process.env.EMAIL_USERNAME, // send to self for test
      subject: "Test Email from Splitara",
      text: "This is a test email to confirm SMTP setup is working correctly.",
    });

    console.log("✅ Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Failed to send test email:", error);
  }
};

sendTestEmail();
