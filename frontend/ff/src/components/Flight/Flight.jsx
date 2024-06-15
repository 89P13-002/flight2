import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Flight.css";

const Flight = () => {
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("http://localhost:3000/flight");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFlights(data.flights);
      } catch (error) {
        console.error("Error fetching flights:", error.message);
        setError("Error fetching flights. Please try again later.");
      }
    };

    fetchFlights();
  }, []);


  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="flight-container">
      <h1 className="page-title">Flight List</h1>
      <div className="flight-list">
        {flights.map((flight) => (
          <div key={flight._id} className="flight-item">
            <div>Flight Number: {flight.flightNumber}</div>
            <div>Departure Airport: {flight.departureAirport}</div>
            <div>Arrival Airport: {flight.arrivalAirport}</div>
            <div>Departure Time: {flight.departureTime}</div>
            <div>Price: Rs {flight.price}</div>
            <div>
            <Link to={`/booking/${flight._id}`} className="button">
            Book
            </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flight;
