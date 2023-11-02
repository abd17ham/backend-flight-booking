const Booking = require("../models/bookingModel");
const Flight = require("../models/flightModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({}).select("+createdAt");
  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name")
    .populate("flight", "name");

  if (!booking) {
    return next(new AppError("No booking found with that ID", 404));
  }

  await res.status(200).json({
    status: "success",
    data: {
      booking,
    },
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const { flightId, userId, seatNumbers } = req.body;
  // console.log(req.body);

  const flight = await Flight.findById(flightId);
  let user = await User.findById(userId);

  if (!flight || !user) {
    return next(new AppError("No flight or user found with that ID", 404));
  }

  //getting the seatsBooked object from the flight document(BLUEPRINT)
  const {
    seatsBooked,
    economySeats,
    firstClassSeats,
    premiumClassSeats,
    economyPrice,
    premiumClassPrice,
    firstClassPrice,
  } = flight;

  if (!seatsBooked) {
    seatsBooked = {};
  }

  let bookedEconomySeats = 0;
  let bookedPremiumClassSeats = 0;
  let bookedFirstClassSeats = 0;
  for (let seatNumber of seatNumbers) {
    if (seatNumber[0] === "E") {
      bookedEconomySeats++;
    } else if (seatNumber[0] === "P") {
      bookedPremiumClassSeats++;
    } else if (seatNumber[0] === "F") {
      bookedFirstClassSeats++;
    } else {
      return next(new AppError("Invalid seat number", 404));
    }

    if (seatsBooked[seatNumber]) {
      return next(new AppError("Seat already booked", 404));
    } else {
      seatsBooked[seatNumber] = true;
    }
  }

  if (
    !(
      economySeats - bookedEconomySeats >= 0 &&
      premiumClassSeats - bookedPremiumClassSeats >= 0 &&
      firstClassSeats - bookedFirstClassSeats >= 0
    )
  ) {
    return next(new AppError("Seat already booked", 404));
  }

  await Flight.findOneAndUpdate(
    { _id: flightId },
    {
      seatsBooked,
      $inc: {
        economySeats: -bookedEconomySeats,
        premiumClassSeats: -bookedPremiumClassSeats,
        firstClassSeats: -bookedFirstClassSeats,
      },
    }
  );

  let price =
    bookedEconomySeats * economyPrice +
    bookedFirstClassSeats * firstClassPrice +
    bookedPremiumClassSeats * premiumClassPrice;

  const newBooking = await Booking.create({
    user: userId,
    flight: flightId,
    seatNumbers: req.body.seatNumbers,
    price,
  });

  //send email to the user
  user = await User.findById(newBooking.user._id);
  // await new Email(user).sendBookingConfirmation(newBooking);

  res.status(201).json({
    status: "success",
    data: newBooking,
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) {
    return next(new AppError("No booking found with that ID", 404));
  }
  const flight = await Flight.findById(booking.flight);

  if (!flight) {
    return next(new AppError("No flight found with that ID", 404));
  }

  //getting the seatsBooked object from the flight document(BLUEPRINT)
  const { seatsBooked } = flight;

  let bookedEconomySeats = 0;
  let bookedPremiumClassSeats = 0;
  let bookedFirstClassSeats = 0;

  for (let seatNumber of booking.seatNumbers) {
    let seatClass = "";

    if (seatNumber[0] === "E") {
      seatClass = "economy";
      bookedEconomySeats++;
    } else if (seatNumber[0] === "P") {
      seatClass = "premiumClass";
      bookedPremiumClassSeats++;
    } else if (seatNumber[0] === "F") {
      seatClass = "firstClass";
      bookedFirstClassSeats++;
    } else {
      return next(new AppError("Invalid seat number", 404));
    }

    if (seatsBooked[seatNumber]) {
      seatsBooked[seatNumber] = false;
    }
  }

  await Flight.findOneAndUpdate(
    { _id: booking.flight },
    {
      seatsBooked,
      $inc: {
        economySeats: bookedEconomySeats,
        premiumClassSeats: bookedPremiumClassSeats,
        firstClassSeats: bookedFirstClassSeats,
      },
    }
  );

  // await new Email(booking.user).sendBookingCancellation(booking);
  res.status(200).json({
    status: "success",
  });
});

exports.myBookings = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Please login to view your bookings", 404));
  }
  const bookings = await Booking.find({ user: req.user._id }).select(
    "+createdAt"
  );

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});
