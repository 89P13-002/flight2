import mongoose from "mongoose";

const { Schema } = mongoose;

const bookingSchema = new Schema({
  flight: {
    type: Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  passenger: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
  },
  receipt: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpaySignature: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Booking", bookingSchema);
