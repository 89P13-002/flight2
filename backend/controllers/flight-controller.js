import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Flight from "../models/Flight.js";

// Add a flight
export const addFlight = async (req, res, next) => {
  const { airline, flightNumber, departureAirport, arrivalAirport, departureTime, arrivalTime, duration, price, availableSeats, classType, adminId } = req.body;

  if (
    !airline || airline.trim() === "" ||
    !flightNumber || flightNumber.trim() === "" ||
    !departureAirport || departureAirport.trim() === "" ||
    !arrivalAirport || arrivalAirport.trim() === "" ||
    !departureTime || departureTime.trim() === "" ||
    !arrivalTime || arrivalTime.trim() === "" ||
    !duration || duration.trim() === "" ||
    !price || price <= 0 ||
    !availableSeats || availableSeats <= 0 ||
    !classType || classType.trim() === "" ||
    !adminId || adminId.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let admin;
  try {
    admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Fetching admin failed", error: err.message });
  }

  // Check if the flight already exists
  let existingFlight;
  try {
    existingFlight = await Flight.findOne({ airline, flightNumber, departureTime });
    if (existingFlight) {
      return res.status(400).json({ message: "Flight already exists" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  let flight;
  try {
    flight = new Flight({
      airline,
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      duration,
      price,
      availableSeats,
      classType,
      bookings: [], // Initialize as empty array
      editedByAdmin: adminId
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    await flight.save({ session });
    admin.managedFlights.push(flight);
    await admin.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({ message: "Creating flight failed", error: err.message });
  }

  if (!flight) {
    return res.status(500).json({ message: "Flight creation failed" });
  }

  return res.status(201).json({ flight });
};

// Get all flights
export const getAllFlights = async (req, res, next) => {
  let flights;

  try {
    flights = await Flight.find();
  } catch (err) {
    return console.log(err);
  }

  if (!flights) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ flights });
};



// Search flight
export const searchFlights = async (req, res, next) => {
  const { from, to, departureDate, returnDate, classType } = req.params;

  // Validate input
  if (!from && !to && !departureDate) {
    return res.status(400).json({ message: 'Invalid input: from, to, and departureDate are required' });
  }

  // Build the flight query
  let flightQuery = {
    departureAirport: from,
    arrivalAirport: to,
    departureTime: { $gte: new Date(departureDate) },
  };

  // Add classType to query if provided
  if (classType && classType !== "undefined") {
    flightQuery.classType = classType;
  }

  try {
    // Find flights matching the search criteria
    let flights = [];
    if (returnDate && returnDate !== "undefined") {
      // Find return flights if returnDate is provided
      flights = await Flight.find({
        departureAirport: to,
        arrivalAirport: from,
        departureTime: { $gte: new Date(returnDate) },
        ...(classType && classType !== "undefined" && { classType }), // Include classType if provided
      });
    }
    else{
      flights = await Flight.find(flightQuery);
    }

    return res.status(200).json({ flights });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Delete a flight
export const deleteFlight = async (req, res, next) => {
  const { adminId, id } = req.params;

  // Check if admin has permission to delete flight
  try {
    const adminUser = await Admin.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (!adminUser.permissions.includes("DELETE")) {
      return res.status(403).json({ message: "Unauthorized to delete flight" });
    }

    // Delete flight and associated bookings
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const deletedFlight = await Flight.findByIdAndDelete(id, { session });
      if (!deletedFlight) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Flight not found" });
      }

      await Booking.deleteMany({ flight: id }, { session });

      await session.commitTransaction();
      res.status(200).json({ message: "Flight and associated bookings deleted successfully" });
    } catch (err) {
      await session.abortTransaction();
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


