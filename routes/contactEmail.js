const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const asyncWrapper = require("../middleware/async");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASS,
  },
});

router.route("/").post(
  asyncWrapper(async (req, res) => {
    // getting email data from request
    const { email, subject, message } = req.body;
    // defining email options (constructing the email)
    const options = {
      from: process.env.EMAIL_SENDER,
      to: process.env.EMAIL_RECEIVER,
      subject: "From vouchyQR :" + subject,
      html:
        "<h3>Email from vouchyQR contact form</h3><p>From : " +
        email +
        "</p><p> <b> Subject : " +
        subject +
        "</b></p><p>Message :</p><p>" +
        message +
        "</p>",
    };
    // sending the email and responding
    const info = await transporter.sendMail(options);
    return res.status(200).json({ msg: "email sent", info: info });
  })
);

module.exports = router;
