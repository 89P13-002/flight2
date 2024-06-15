import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./AdminProfile.css";

const AdminProfile = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [flightForm, setFlightForm] = useState({
    airline: "",
    flightNumber: "",
    departureAirport: "",
    arrivalAirport: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    price: "",
    availableSeats: "",
    classType: "Economy",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/admin/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch admin");
        }
        const data = await response.json();
        setAdmin(data.admin);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchAdminData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightForm({
      ...flightForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/flight/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...flightForm,
          adminId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add flight");
      }

      // const data = await response.json();
      setSuccessMessage("Flight added successfully!");

      // Optionally update admin state or handle success message
    } catch (error) {
      console.error("Error adding flight:", error.message);
      // Handle error state or display error message
    } finally {
      setSubmitting(false);
      setFlightForm({
        airline: "",
        flightNumber: "",
        departureAirport: "",
        arrivalAirport: "",
        departureTime: "",
        arrivalTime: "",
        duration: "",
        price: "",
        availableSeats: "",
        classType: "Economy",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!admin) {
    return <div>No admin found.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Welcome, {admin.name}</h2>
        <p>Email: {admin.email}</p>
      </div>
      <div className="profile-content">
        <h3>Add a Flight:</h3>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form className="flight-form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="airline">Airline:</label>
            <input
              type="text"
              id="airline"
              name="airline"
              value={flightForm.airline}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="flightNumber">Flight Number:</label>
            <input
              type="text"
              id="flightNumber"
              name="flightNumber"
              value={flightForm.flightNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="departureAirport">Departure Airport:</label>
            <input
              type="text"
              id="departureAirport"
              name="departureAirport"
              value={flightForm.departureAirport}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="arrivalAirport">Arrival Airport:</label>
            <input
              type="text"
              id="arrivalAirport"
              name="arrivalAirport"
              value={flightForm.arrivalAirport}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="departureTime">Departure Time:</label>
            <input
              type="datetime-local"
              id="departureTime"
              name="departureTime"
              value={flightForm.departureTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="arrivalTime">Arrival Time:</label>
            <input
              type="datetime-local"
              id="arrivalTime"
              name="arrivalTime"
              value={flightForm.arrivalTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="duration">Duration:</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={flightForm.duration}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={flightForm.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="availableSeats">Available Seats:</label>
            <input
              type="number"
              id="availableSeats"
              name="availableSeats"
              value={flightForm.availableSeats}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="classType">Class Type:</label>
            <select
              id="classType"
              name="classType"
              value={flightForm.classType}
              onChange={handleInputChange}
              required
            >
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First</option>
            </select>
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Adding Flight..." : "Add Flight"}
          </button>
        </form>

        <div className="view-links">
          <Link to={`/admin/${id}/flight`} className="view-link">
            View All Flights
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
