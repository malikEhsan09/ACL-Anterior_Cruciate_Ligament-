import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

//? Create feedback
export const createFeedback = async (req, res) => {
  try {
    const { userID, feedbackText, sentiment } = req.body;
    console.log(userID, feedbackText, sentiment);

    // Validate userID as a valid ObjectId
    if (!ObjectId.isValid(userID)) {
      return res.status(400).json({ message: "Invalid userID format" });
    }

    // Check if the user exists and is a player
    const user = await User.findById(userID);
    if (!user || user.userType !== "Player") {
      return res
        .status(403)
        .json({ message: "Only players can give feedback" });
    }

    const newFeedback = new Feedback({
      userID,
      feedbackText,
      sentiment,
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Feedback created successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? Get all feedbacks
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate(
      "userID",
      "email userType"
    );

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? Get feedbacks by sentiment
export const getFeedbacksBySentiment = async (req, res) => {
  try {
    const { sentiment } = req.params;

    const feedbacks = await Feedback.find({ sentiment }).populate(
      "userID",
      "email userType"
    );

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks by sentiment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? Delete feedback by ID
export const deleteFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
