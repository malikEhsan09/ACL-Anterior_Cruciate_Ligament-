import mongoose from "mongoose";
const { Schema } = mongoose;

const doctorSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    medicalLicenseNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    // phoneNumber: {
    //   type: String,
    //   required: true,
    // },
    rating: {
      type: Number,
      default: 0,
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
