import mongoose from "mongoose";
const { Schema } = mongoose;

const doctorScheduleSchema = new Schema(
  {
    doctorID: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slots: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        timings: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("DoctorSchedule", doctorScheduleSchema);
