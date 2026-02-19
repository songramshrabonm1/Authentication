require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});
// Connection verify করা
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});


const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"City Food" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const SendOtpEmail = async (UserEmail, otp) => {
  const subject = "🍔 CityFood Verification Code";

  const text = `Welcome to CityFood!

Your verification code is: ${otp}

This OTP will expire in 5 minutes.
Do not share this code with anyone.

- CityFood Team`;

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
    
    <div style="max-width:500px; margin:auto; background:white; padding:25px; border-radius:10px; text-align:center;">
      
      <h2 style="color:#ff6b00;">🍔 CityFood</h2>
      <p style="font-size:16px; color:#333;">Welcome to <b>CityFood</b></p>
      <p style="font-size:14px; color:#666;">Use the OTP below to verify your account</p>
      
      <div style="margin:20px 0; font-size:28px; font-weight:bold; letter-spacing:5px; color:#ff6b00;">
        ${otp}
      </div>

      <p style="font-size:13px; color:#999;">This OTP will expire in <b>5 minutes</b>.</p>
      <p style="font-size:13px; color:#999;">Do not share this code with anyone.</p>

      <hr style="margin:20px 0;" />

      <p style="font-size:12px; color:#aaa;">
        If you did not request this, please ignore this email.
      </p>

      <p style="font-size:13px; color:#333; margin-top:10px;">
        ❤️ CityFood Team
      </p>

    </div>

  </div>
  `;

  await sendEmail(UserEmail, subject, text, html);
};


module.exports = { sendEmail , SendOtpEmail}; 