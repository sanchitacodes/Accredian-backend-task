// const express = require("express");
// const bodyParser = require("body-parser");
// const { PrismaClient } = require("@prisma/client");
// const dotenv = require("dotenv");
// const referralRoutes = require("./routes/referral");

// dotenv.config();
// const prisma = new PrismaClient();
// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.use(express.static("public"));

// // Routes
// app.use("/referral", referralRoutes);

// // Home Page
// app.get("/", (req, res) => {
//   res.render("index");
// });

// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Home Page with Referral Button
app.get("/", (req, res) => {
  res.render("index");
});

// Referral Form Page
app.get("/refer", (req, res) => {
  res.render("refer");
});

// Handle Form Submission
app.post("/submit-referral", async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

  if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
    return res.send("All fields are required!");
  }

  try {
    const newReferral = await prisma.referral.create({
      data: { referrerName, referrerEmail, refereeName, refereeEmail },
    });

    // Send Referral Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: refereeEmail,
      subject: "You've been referred!",
      text: `Hey ${refereeName}, ${referrerName} has referred you!`,
    };

    await transporter.sendMail(mailOptions);
    res.send("Referral submitted and email sent!");
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
