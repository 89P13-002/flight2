import React, { useState } from "react";
import "./Booking.css";

const BookingPage = () => {
  const [flightId, setFlightId] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState(null);

  const handleBooking = async () => {
    try {
      const response = await fetch("http://localhost:3000/booking/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flightId, seatNumber, userId, amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to book flight");
      }

      const data = await response.json();
      setBookingResult(data.booking);
      setError(null);

      // After successful booking, verify payment and update status
      await verifyPayment(data.booking._id);

    } catch (error) {
      console.error("Error booking flight:", error.message);
      setError("Failed to book flight");
      setBookingResult(null);
    }
  };

  const verifyPayment = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:3000/booking/${bookingId}/verify`, {
        method: "POST", // Assuming you use POST for verification
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          razorpayPaymentId: bookingResult.razorpayPaymentId, // Assuming you have stored razorpayPaymentId after booking
          razorpaySignature: bookingResult.razorpaySignature, // Assuming you have stored razorpaySignature after booking
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify payment");
      }

      const verifiedBooking = await response.json();
      setBookingResult(verifiedBooking); // Update booking details with verified status
    } catch (error) {
      console.error("Error verifying payment:", error.message);
      setError("Failed to verify payment");
    }
  };

  return (
    <div className="booking-container">
      <h2>Book a Flight</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="booking-form">
        <label>
          Flight ID:
          <input
            type="text"
            value={flightId}
            onChange={(e) => setFlightId(e.target.value)}
          />
        </label>
        <label>
          Seat Number:
          <input
            type="text"
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
          />
        </label>
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
        <label>
          Amount:
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <button onClick={handleBooking}>Book Flight</button>
      </div>
      {bookingResult && (
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p>Booking ID: {bookingResult._id}</p>
          <p>Flight ID: {bookingResult.flight}</p>
          <p>User ID: {bookingResult.passenger}</p>
          <p>Seat Number: {bookingResult.seatNumber}</p>
          <p>Status: {bookingResult.status}</p>
          <p>Booking Date: {new Date(bookingResult.bookingDate).toLocaleString()}</p>
          <p>Receipt: {bookingResult.receipt}</p>
          <p>Amount: {bookingResult.amount}</p>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
