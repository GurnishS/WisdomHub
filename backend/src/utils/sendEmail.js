import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;
import { createTransport } from "nodemailer";

// Load environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const EMAIL_USER = process.env.EMAIL_USER;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Create OAuth2 client
const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Function to send email
const sendMail = async (subject, body, address) => {
  try {
    // Create a Nodemailer transporter with OAuth2
    const transporter = createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
      },
    });

    // Email options
    const mailOptions = {
      from: EMAIL_USER,
      to: address,
      subject: subject,
      text: "Hello from Wisdom Hub",
      html: body,
    };
    // Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending mail:", error.message);
    throw error;
  }
};

const sendOTP = async (email, otp) => {
  try {
    const result = await sendMail(
      "Verify your email address",
      `Your OTP is ${otp}`,
      email
    );
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export { sendOTP };
