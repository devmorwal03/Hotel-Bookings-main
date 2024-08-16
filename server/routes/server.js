const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
app.use(cors());


const dbConfig = require("./db"); //configuring our database
const roomsRoute = require("./routes/roomRoute"); //setting up routes for rooms
const usersRoute = require("./routes/userRoute"); //setting up routes for user
const bookingRoute = require("./routes/bookingRoute"); //setting up routes for booking
const payRoute = require("./routes/paymentverifyRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//access for routes imported above
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/paymentverification", payRoute);

//   console.log(instance)
//setting up port and using app.listen to start the expressjs server
const port = process.env.PORT || 5000; // port act as an entry point for server
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Node app listening on ${port} port!`));


const key = process.env.RAZORPAY_API_KEY;
app.get("/api/getkey", (req, res) => res.status(200).json({ key: key }));
