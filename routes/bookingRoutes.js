const express = require("express");
const router = express.Router();

const bookingController = require("../controller/bookingController");
const userController = require("../controller/userController");

router.get("/", bookingController.getAllBookings);
router.get("/mybooking", userController.protect, bookingController.myBookings);
router.post("/", bookingController.createBooking);
router.get("/:id", bookingController.getBooking);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
