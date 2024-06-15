import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import flightRouter from "./routes/flight-routes.js";
import flightBookingsRouter from "./routes/booking-routes.js";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/flight",flightRouter);
app.use("/booking",flightBookingsRouter);

mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.tjssetn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
)
.then(() => app.listen(3000,() =>{
    console.log("Connected To localhost");
}))
.catch((err) =>{
    console.log(err);
});
