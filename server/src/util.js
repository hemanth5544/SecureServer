import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path'

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


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export const sendEmail = async (to, subject, userName, userEmail) => {
  try {
    const templatePath = path.join(__dirname, 'templates', 'singup.html');
    console.log('Resolved Template Path:', templatePath); 

    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    emailTemplate = emailTemplate
      .replace('{{name}}', userName)
      .replace('{{email}}', userEmail);

    const mailOptions = {
      from: 'rachapalli.hemanth5544@gmail.com', 
      to, 
      subject, 
      html: emailTemplate, 
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
