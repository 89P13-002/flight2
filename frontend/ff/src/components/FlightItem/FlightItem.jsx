import React from "react";
import { Link } from "react-router-dom";
import './FlightItem.css';

const FlightItem = ({ flightNumber, departureTime, departureAirport, arrivalAirport, price, id }) => {
  return (
    <div className="card">
      <div className="cardContent">
        <h5 className="flightNumber">{flightNumber}</h5>
        <p className="text">
          {new Date(departureTime).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p className="text">From: {departureAirport}</p>
        <p className="text">To: {arrivalAirport}</p>
        <p className="text">Price: Rs {price}</p>
      </div>
      <div className="cardActions">
        <Link to={`/booking/${id}`} className="button">
          Book
        </Link>
      </div>
    </div>
  );
};

export default FlightItem;
