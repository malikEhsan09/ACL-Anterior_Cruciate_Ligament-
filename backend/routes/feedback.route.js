import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbacksBySentiment,
  deleteFeedbackById,
} from "../controllers/feedback.controller.js";
import { isAdmin, verifyToken } from "../middleware/auth.mw.js";

const router = express.Router();

// Create a new feedback (Player only)
router.post("/", createFeedback);

// Get all feedbacks (Admin only)
router.get("/", verifyToken, isAdmin, getAllFeedbacks);

// Get feedbacks by sentiment (Admin only)
router.get(
  "/sentiment/:sentiment",
  verifyToken,
  isAdmin,
  getFeedbacksBySentiment
);

// Delete feedback by ID (Admin only)
router.delete("/:id", verifyToken, isAdmin, deleteFeedbackById);

export default router;
