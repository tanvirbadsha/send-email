// server/index.js
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware to parse JSON bodies
app.use(express.json());

// Setup the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "mstanvir55@gmail.com",
    pass: "",
  },
});

// Hardcoded recipient emails
const recipientEmails = ["tanvirtonmoy18@gmail.com", "mstanvir55@gmail.com"];

// Endpoint to send email with attachment
app.post("/send-email", upload.single("attachment"), async (req, res) => {
  const { userEmail, subject, text } = req.body;
  const file = req.file;
  // || !file
  if (!userEmail || !subject || !text) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const mailOptions = {
      from: userEmail, // Use the user's email as the sender
      to: recipientEmails, // Send to hardcoded recipients
      subject: subject,
      text: text,
      //   attachments: [
      //     {
      //       filename: file.originalname,
      //       path: file.path
      //     }
      //   ]
    };

    const info = await transporter.sendMail(
      mailOptions,
      (error, emailResponse) => {
        if (error) {
          throw error;
        }
        console.log("success!");
        response.end();
      }
    );

    // Delete the file after sending email
    //fs.unlinkSync(file.path);

    res.status(200).json({ message: "Emails sent successfully", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
