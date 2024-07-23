import mongoose from "mongoose";

const { Schema } = mongoose;

const mriAssessmentSchema = new Schema(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    fileType: {
      type: String,
      enum: ["application/octet-stream", ".npy", ".pck"],
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    assessmentResult: {
      type: String,
      enum: ["1-Fine", "2-partially-injured", "3-Completely Ruptured"],
    },
    reportPath: {
      type: String,
    },
    pdfReport: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MRIFile", mriAssessmentSchema);
