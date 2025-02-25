const express = require("express");
const { PrismaClient } = require("@prisma/client");
const sendEmail = require("../nodemailer");

const router = express.Router();
const prisma = new PrismaClient();

// Show referral form
router.get("/new", (req, res) => {
  res.render("form");
});

// Handle referral form submission
router.post("/submit", async (req, res) => {
  const { name, email, referralCode } = req.body;

  // Validate fields
  if (!name || !email || !referralCode) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // Check if email already exists
    const existingReferral = await prisma.referral.findUnique({
      where: { email },
    });

    if (existingReferral) {
      return res.status(400).send("Email already referred.");
    }

    // Save referral to database
    const newReferral = await prisma.referral.create({
      data: { name, email, referralCode },
    });

    // Send referral email
    await sendEmail(email, name, referralCode);

    res.render("success", { name });
  } catch (error) {
    console.error("Error saving referral:", error);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
