import express from "express";
import {
  deleteUserById,
  findAllUsers,
  findUserById,
  signout,
  register,
  login,
  requestPasswordReset,
  verifyOTP,
  updatePassword,
} from "../controllers/auth.controller.js";
import passport from "passport";
import "../utils/passport.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello Ehsan");
});

// Signup
router.post("/register", register);

// SignIn
router.post("/login", login);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

// Signout
router.get("/signout/:id", signout);

// Forgot and send OTP to update
router.post("/password/reset", requestPasswordReset);
router.post("/password/verify", verifyOTP);
router.post("/password/updatePassword", updatePassword);

// Find user by ID
router.get("/user/:id", findUserById);
// Find all users
router.get("/users", findAllUsers);
// Delete user by ID
router.delete("/user/:id", deleteUserById);

export default router;
