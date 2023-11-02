const Flight = require("../models/flightModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModel");
const Email = require("../utils/email");

exports.getAllFlights = catchAsync(async (req, res, next) => {
  const flights = await Flight.find({}).sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: flights.length,
    data: flights,
  });
});

exports.getFlight = catchAsync(async (req, res, next) => {
  const flight = await Flight.findById(req.params.id);

  if (!flight) {
    return next(new AppError("No flight found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      flight,
    },
  });
});

exports.createFlight = catchAsync(async (req, res, next) => {
  const newFlight = await Flight.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newFlight,
    },
  });
});

exports.updateFlight = catchAsync(async (req, res, next) => {
  const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });

  if (!flight) {
    return next(new AppError("No Flights found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      ...flight,
    },
  });
});

exports.deleteFlight = catchAsync(async (req, res, next) => {
  const flight = await Flight.findById(req.params.id);

  if (!flight) {
    return next(new AppError("No Flighs found with that ID", 404));
  }

  //find the bookings related to this flight
  const bookings = await Booking.find({ flight: req.params.id });

  //TODO: remove the comments

  //cancel all the bookings related to this flight and send email to the user
  // bookings.forEach(async (booking) => {
  //   await new Email(booking.user.email).sendFlightCancellation();
  // });

  await Flight.findByIdAndDelete(req.params.id);
  await Booking.deleteMany({ flight: req.params.id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAirports = catchAsync(async (req, res, next) => {
  const airports = await Flight.find().select({
    originPlace: 1,
    destinationPlace: 1,
  });

  res.status(200).json({
    status: "success",
    results: airports.length,
    data: airports,
  });
});
