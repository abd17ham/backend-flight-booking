const mongoose = require("mongoose");
const Flight = require("../models/flightModel");
const dotenv = require("dotenv");
const flightData = require("./flights.json");

dotenv.config({ path: "./../.env" });

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB Atlas");
});

Flight.insertMany(flightData)
  .then((docs) => {
    console.log(`${docs.length} flights inserted.`);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });

// Flight.deleteMany()
//   .then(() => {
//     console.log("All flights deleted.");
//   })
//   .catch((err) => {
//     console.error(err);
//   })
//   .finally(() => {
//     mongoose.connection.close();
//   });
