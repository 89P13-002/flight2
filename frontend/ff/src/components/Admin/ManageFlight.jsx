import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ManageFlight.css";

const ManageFlight = () => {
  const { id } = useParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`http://localhost:3000/flight`);
        if (!response.ok) {
          throw new Error("Failed to fetch flights");
        }
        const data = await response.json();
        setFlights(data.flights);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFlights();
  }, [id]);

  const handleDelete = async (flightId) => {
    try {
      const response = await fetch(`http://localhost:3000/${id}/${flightId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete flight");
      }
      setFlights(flights.filter((flight) => flight._id !== flightId));
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flights-container">
      <h2>All Flights</h2>
      {deleteError && <div className="error-message">Error: {deleteError}</div>}
      {flights.length === 0 ? (
        <div>No flights found.</div>
      ) : (
        flights.map((flight) => (
          <div key={flight._id} className="flight-item">
            <div>Airline: {flight.airline}</div>
            <div>Flight Number: {flight.flightNumber}</div>
            <div>Departure: {flight.departureAirport} at {flight.departureTime}</div>
            <div>Arrival: {flight.arrivalAirport} at {flight.arrivalTime}</div>
            <div>Duration: {flight.duration}</div>
            <div>Price: Rs {flight.price}</div>
            <div>Available Seats: {flight.availableSeats}</div>
            <div>Class Type: {flight.classType}</div>
            <button onClick={() => handleDelete(flight._id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageFlight;
