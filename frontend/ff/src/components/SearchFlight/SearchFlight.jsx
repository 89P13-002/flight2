import React, { useState, useEffect } from "react";
import { Link ,useParams } from "react-router-dom";
import "./SearchFlight.css";

const SearchedFlight = () => {
  const { from, to, departureDate, returnDate, classType } = useParams();
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const url = `http://localhost:3000/flight/search/${from}/${to}/${departureDate}/${returnDate}/${classType}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFlights(data.flights);
      } catch (error) {
        console.error("Error fetching flights:", error.message);
        setError("Error fetching flights. Please try again later.");
      }
    };

    fetchFlights();
  }, [from, to, departureDate, returnDate, classType]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="flight-container">
      <h1 className="page-title">Search Results</h1>
      <div className="flight-list">
        {flights.length === 0 && <div>No flights found</div>}
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

export default SearchedFlight;
