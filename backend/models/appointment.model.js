import mongoose from "mongoose";
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    playerID: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    doctorID: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Physical", "Online"],
      default: "Physical",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
