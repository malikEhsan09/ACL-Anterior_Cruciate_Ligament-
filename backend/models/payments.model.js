import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentSchema = new Schema({
  cardHolderName: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  cardExpiryDate: {
    type: String,
    required: true,
  },
  cardCVV: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Payment", paymentSchema);
