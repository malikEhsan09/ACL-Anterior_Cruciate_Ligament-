import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import admissionRoute from "./routes/admission.js";
import authRoute from "./routes/auth.route.js";
import playerRoute from "./routes/player.route.js";
import clubRoute from "./routes/club.route.js";
import bodyParser from "body-parser";
import AdminRoute from "./routes/admin.route.js";
import "./middleware/passport-strategies.mw.js";
import appointmentRoute from "./routes/appointment.route.js";
import doctorRoute from "./routes/doctor.route.js";
import exerciseRoute from "./routes/exercise.route.js";
import mriFileRoute from "./routes/mri.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import promoRoute from "./routes/promo.route.js";

// import { nodemailer } from "./middleware/nodemailer.js";
// import nodemailer from "nodemailer";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);

// Add session middleware
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth/", authRoute);
app.use("/api/admission/", admissionRoute);
app.use("/api/player/", playerRoute);
app.use("/api/club/", clubRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/appointment/", appointmentRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/exercise", exerciseRoute);
app.use("/api/mriFile", mriFileRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/promo", promoRoute);

// ? use the nodemailor to send the user contact us query
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "ehsanahmed122001@gmail.com",
//     pass: "lzjb cgjk ydmq dwxo",
//   },
// });

// app.post("/send-email", (req, res) => {
//   const { name, email, query, gender, message } = req.body;

//   const mailOptions = {
//     from: "ehsanahmed122@gmail.com",
//     to: "ehsanahmed122001@gmail.com",
//     subject: "New Contact Form Submission",
//     text: `Name: ${name}\nEmail: ${email}\nQuery: ${query}\nGender: ${gender}\nMessage: ${message}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).json({ error: "Error sending email" });
//     }
//     res.status(200).json({ message: "Email sent successfully!" });
//   });
// });

// Database connected
const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Database connected successfully 🎆");
    })
    .catch((err) => console.log(err));
};

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong 💣";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(process.env.PORT || 8800, () => {
  connect();
  console.log(`Server is running at ${process.env.PORT || 8800}`);
});
