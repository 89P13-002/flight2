import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FlightItem from '../FlightItem/FlightItem.jsx';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    classType: "Economy",
  });

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("http://localhost:3000/flight"); // Replace with your actual API endpoint
        const data = await response.json(); // Parsing the JSON data
        setFlights(data.flights); // Assuming response has a key 'flights' which contains the array of flights
      } catch (error) {
        console.error("Error fetching flights:", error);
        // Handle error fetching flights (e.g., set error state)
      }
    };

    fetchFlights();
  }, []); // Empty dependency array ensures this effect runs only once

  // Function to handle search
  const handleSearch = () => {
    const { from, to, departureDate, returnDate, classType } = searchParams;

    // Check if all required search parameters are present
    if (!from || !to || !departureDate) {
      alert("Please enter From, To, and Departure Date");
      return;
    }

    // Navigate to search results page with search parameters
    navigate(`/search/${from}/${to}/${departureDate}/${returnDate}/${classType}`);
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  // JSX for rendering the component
  return (
    <div className="container">
      <div className="search-container">
        <h2>Search Flights</h2>
        <div className="form-control">
          <label htmlFor="from">From</label>
          <input
            type="text"
            name="from"
            value={searchParams.from}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="to">To</label>
          <input
            type="text"
            name="to"
            value={searchParams.to}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="departureDate">Departure Date</label>
          <input
            type="date"
            name="departureDate"
            value={searchParams.departureDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="returnDate">Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={searchParams.returnDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="classType">Class</label>
          <select
            name="classType"
            value={searchParams.classType}
            onChange={handleChange}
          >
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="First Class">First Class</option>
          </select>
        </div>
        <button onClick={handleSearch}>Search Flights</button>
      </div>

      <div className="flights-container">
        <h2>Deal of the Day</h2>
        <div className="flights-grid">
          {flights && flights.slice(0, 4).map((flight) => (
            <FlightItem
              key={flight._id}
              id={flight._id}
              airline={flight.airline}
              flightNumber={flight.flightNumber}
              departureAirport={flight.departureAirport}
              arrivalAirport={flight.arrivalAirport}
              departureTime={flight.departureTime}
              arrivalTime={flight.arrivalTime}
              price={flight.price}
            />
          ))}
        </div>
        <div className="view-all">
          <Link to="/flight" className="view-all-link">
            View All Flights
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
