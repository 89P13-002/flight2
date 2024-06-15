import express from "express";
import {
  deleteFlightBooking,
  verifyPaymentAndUpdateStatus,
  addFlightBooking,
} from "../controllers/booking-controller.js";

const flightBookingsRouter = express.Router();

flightBookingsRouter.post("/verify", verifyPaymentAndUpdateStatus);
flightBookingsRouter.post("/add", addFlightBooking);
flightBookingsRouter.delete("/:id", deleteFlightBooking);

export default flightBookingsRouter;
