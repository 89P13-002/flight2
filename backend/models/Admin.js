// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmE2MTg3ZDkwMGQ3NmZiOTE5Njk2ZSIsImlhdCI6MTcxODI0ODYwNiwiZXhwIjoxNzE4ODUzNDA2fQ.LUHxBWO8SMYkXIhbaMYJ85QFZLkoRzMY4BY1pMj82RU


import mongoose from "mongoose";


const { Schema } = mongoose;

// Define the Admin schema
const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  permissions: {
    type: [String],
    default: ['READ', 'WRITE', 'DELETE'],
  },
  managedFlights: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Flight",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});


// Create and export the Admin model
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
