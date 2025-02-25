const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, name, referralCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "You've Been Referred!",
    text: `Hi ${name},\n\nYou have been successfully referred!\nYour referral code is: ${referralCode}\n\nBest regards,\nReferral Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail;
