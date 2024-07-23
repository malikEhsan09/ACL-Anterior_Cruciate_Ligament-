import mongoose from 'mongoose';

const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feedbackText: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      enum: ['Negative', 'Neutral', 'Positive'],
      required: true,
    },
    feedbackDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
