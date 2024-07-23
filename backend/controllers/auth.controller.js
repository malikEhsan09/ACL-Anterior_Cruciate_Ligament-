import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/user.model.js";
import Randomstring from "randomstring";
import passport from "passport";
import ForgotPassword from "../models/forgot.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

//  secure password
function securePassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

//*  Register user
export const register = async (req, res, next) => {
  const { email, password, userType, isAdmin } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = new User({
      email,
      password: securePassword(password),
      userType,
      isAdmin,
    });
    const userSaved = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userSaved,
    });
  } catch (err) {
    next(err);
    console.log("From Cont:" + err.message);
  }
};

//* Signin function
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!process.env.JWT) {
      return next(createError(500, "JWT secret key is missing"));
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT,
      { expiresIn: "3d" }
    );
    const { password: userPassword, ...others } = user._doc;

    // Set token as a session cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        user: others,
        msg: `User the ${user.userType} is logged in`,
        token,
      });
  } catch (err) {
    next(err);
  }
};

//* Signout function
export const signout = (req, res) => {
  const { id } = req.params;
  res
    .clearCookie("access_token", id)
    .json({ msg: "User is logged out Succesfully", id });
};

//* Forgot password Rest it
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase(); // Generate 6-digit OTP

    const forgotPassword = new ForgotPassword({
      user_id: user._id,
      verificationCode,
    });
    await forgotPassword.save();

    // Setup email
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "9ed93bedbf9244",
        pass: "abfdbd2418881e",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email, // Ensure this is correctly set to the user's email
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${verificationCode}`,
    };
    console.log("Sending OTP to:", email);
    await transport.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Request Password Reset error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// * verify OTP
export const verifyOTP = async (req, res) => {
  const { userId, verificationCode } = req.body;

  try {
    const otpEntry = await ForgotPassword.findOne({
      user_id: userId,
      verificationCode,
    });

    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updatePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.updateOne(
      { _id: userId },
      { password: hashedPassword, updatedAt: new Date() }
    );

    // Optionally, we can delete the OTP after password update
    await ForgotPassword.deleteMany({ user_id: userId });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update Password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//! Find user by ID
export const findUserById = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Exclude the password field from the response
    const { password, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

//! Find all users
export const findAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    // console.log(req.url, users)
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

//! Delete user by ID
export const deleteUserById = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).send("User deleted successfully");
  } catch (err) {
    next(err);
  }
};
