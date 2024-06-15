import mongoose from 'mongoose';

const { Schema } = mongoose;

// Schema for a Flight
const flightSchema = new Schema({
  airline: {
    type: String,
    required: true,
    trim: true
  },
  flightNumber: {
    type: String,
    required: true,
    trim: true
  },
  departureAirport: {
    type: String,
    required: true,
    trim: true
  },
  arrivalAirport: {
    type: String,
    required: true,
    trim: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  classType: {
    type: String,
    enum: ['Economy', 'Business', 'First Class'], // predefined class types
    required: true
  },
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  editedByAdmin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
