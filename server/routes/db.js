const mongoose = require("mongoose");

var mongoURL = process.env.MONGODB_URL;
// using connection string from mongodb Atlas

mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });
// This line initiates the connection to the MongoDB database using the mongoose.connect() method.
// It takes two arguments: the mongoURL and  an options object as the second argument
//useUnifiedTopology: true: This option enables the use of MongoDB's new Server Discovery and Monitoring engine (SDAM). SDAM is a new way of handling replica sets and sharded clusters, providing a more reliable and efficient way of discovering and monitoring servers in the MongoDB deployment.
//useNewUrlParser: true: This option enables the use of the new MongoDB connection string parser. Prior to version 3.1.0, the MongoDB connection string had a different format.

var connection = mongoose.connection;

connection.on("error", () => {
  console.log("Mongo DB Connection Failed");
});
// This line sets up an event listener for the "error" event on the connection object

connection.on("connected", () => {
  console.log("Mongo DB Connection Successful");
});
// This line sets up an event listener for the "connected" event on the connection

module.exports = mongoose;
