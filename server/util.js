import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'mrbean', { expiresIn: '24h' });
  };

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "rachapalli.hemanth5544@gmail.com",
      pass: "kecnjtxgtacaqipo",
    },
  });

// Function to send an email
export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "rachapalli.hemanth5544@gmail.com", 
    to, 
    subject, 
    text, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};