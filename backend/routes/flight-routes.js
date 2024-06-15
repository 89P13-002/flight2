import express from 'express';
import {
  addFlight,
  getAllFlights,
  searchFlights,
  deleteFlight
} from '../controllers/flight-controller.js';

const flightRouter = express.Router();

// Add a new flight
flightRouter.post('/add', addFlight);

// Get all flights
flightRouter.get('/', getAllFlights);

// Get flight by ID
flightRouter.get('/search/:from/:to/:departureDate/:returnDate/:classType', searchFlights);

// Delete a flight
flightRouter.delete('/:adminId/:id', deleteFlight);


export default flightRouter;
