import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    partiallyDamages: {
      type: [String], // URLs of videos regarding partial damage
    },
    completelyRuptured: {
      type: [String], // URLs of videos regarding complete rupture
    },
    tutorials: {
      type: [String], // URLs of tutorials
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Exercise", exerciseSchema);
