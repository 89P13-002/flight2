import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./UserProfile.css"; // Import your CSS file for styling

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading state
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        setError(error.message);
      }
    };

    fetchUserData();
  }, [id]);

  const handleDeleteBooking = async (bookingId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/booking/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      // Update user's bookings after successful deletion
      const updatedUser = { ...user };
      updatedUser.bookings = updatedUser.bookings.filter((booking) => booking._id !== bookingId);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error deleting booking:", error.message);
      setLoading(false);
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>; // Replace with a loader component
  }

  if (error) {
    return <div className="error-container">{error}</div>; // Replace with an error component
  }

  if (!user) {
    return <div className="loading-container">Loading...</div>; // Replace with a loader component
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Welcome, {user.name}</h2>
        <p>Email: {user.email}</p>
      </div>
      <div className="profile-content">
        <h3>Bookings:</h3>
        <ul className="bookings-list">
          {user.bookings.map((booking) => (
            <li key={booking._id} className="booking-item">
              <div>
                <strong>Flight:</strong> {booking.flightName}
              </div>
              <div>
                <strong>Seat Number:</strong> {booking.seatNumber}
              </div>
              <div>
                <strong>Status:</strong> {booking.status}
              </div>
              <button
                className="delete-booking-btn"
                onClick={() => handleDeleteBooking(booking._id)}
                disabled={booking.status !== "Success"} // Disable button if payment status is not 'Success'
              >
                Cancel Booking
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
