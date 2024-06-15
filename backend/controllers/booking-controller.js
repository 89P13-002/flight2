import mongoose from "mongoose";
import Booking from "../models/Bookings.js";
import Flight from "../models/Flight.js";
import User from "../models/User.js";
import razorpay from "../config/razorpay.js";

export const addFlightBooking = async (req, res, next) => {
  const { flightId, seatNumber, userId, amount, razorpaySignature } = req.body;

  let existingFlight;
  let existingUser;

  try {
    existingFlight = await Flight.findById(flightId);
    existingUser = await User.findById(userId);
  } catch (err) {
    console.error("Error finding flight or user:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (!existingFlight) {
    return res.status(404).json({ message: "Flight not found with the given ID" });
  }

  if (!existingUser) {
    return res.status(404).json({ message: "User not found with the given ID" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        razorpay_signature: razorpaySignature, // Store razorpay signature in notes
      },
    });

    if (!order) {
      throw new Error("Error creating Razorpay order");
    }

    // Create and save new booking
    const booking = new Booking({
      flight: existingFlight._id,
      passenger: existingUser._id,
      seatNumber,
      bookingDate: new Date(), // current date and time
      status: "Pending", // default status
      receipt: order.receipt, // receipt from Razorpay order
      razorpayOrderId: order.id, // store Razorpay order ID
      razorpaySignature, // store Razorpay signature
      amount,
    });

    await booking.save({ session });

    // Update user and flight with the new booking
    existingUser.bookings.push(booking);
    existingFlight.bookings.push(booking);

    await existingUser.save({ session });
    await existingFlight.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Failed to create booking" });
  }
};


export const verifyPaymentAndUpdateStatus = async (req, res, next) => {
  const { bookingId, razorpayPaymentId, razorpaySignature } = req.body;

  let booking;
  try {
    booking = await Booking.findById(bookingId).populate('flight passenger');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify payment signature
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${booking.razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Update booking status to "Success"
    booking.status = "Success";
    booking.razorpayPaymentId = razorpayPaymentId;
    await booking.save();

    return res.status(200).json({ message: "Payment verified and booking status updated", booking });
  } catch (err) {
    console.error("Error verifying payment and updating status:", err);
    return res.status(500).json({ message: "Failed to verify payment and update status" });
  }
};



export const deleteFlightBooking = async (req, res, next) => {
  const { id } = req.params;
  let booking;
  let session;

  try {
    booking = await Booking.findById(id).populate("passenger flight");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if payment status is "Success" before proceeding with deletion
    if (booking.status !== "Success") {
      return res.status(400).json({ message: "Payment status is not 'Success'. Unable to proceed with deletion." });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    await booking.passenger.bookings.pull(booking._id);
    await booking.flight.bookings.pull(booking._id);

    await booking.passenger.save({ session });
    await booking.flight.save({ session });

    // Call Razorpay API to process refund
    const refundResponse = await razorpay.payments.refund(booking.razorpayPaymentId, {
      amount: booking.amount, // Amount in paise
    });

    // If refund is successful, delete the booking
    await Booking.findByIdAndRemove(id, { session });

    await session.commitTransaction();

    return res.status(200).json({ message: "Successfully Deleted and Refunded", refundResponse });
  } catch (err) {
    console.error(err);
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    return res.status(500).json({ message: "Unable to Delete and Refund", error: err.message });
  } finally {
    if (session) {
      session.endSession();
    }
  }
};