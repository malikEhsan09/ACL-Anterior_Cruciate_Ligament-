import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: ["Email is required", true],
      unique: true,
    },
    password: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["Player", "Admin", "Doctor"],
      default: "Player",
    },
    phone: {
      type: String,
    },
    googleID: {
      type: String,
    },
    facebookID: {
      type: String,
    },
    // role: {
    //   type: [String],
    //   enum: ["Player", "Admin", "Doctor"],
    //   default: ["Player"],
    // },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
