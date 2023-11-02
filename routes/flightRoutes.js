const express = require("express");
const router = express.Router();

const flightController = require("../controller/flightController");
const userController = require("../controller/userController");
router.get("/", flightController.getAllFlights);
router.get("/airports", flightController.getAirports);
router.post(
  "/",
  userController.protect,
  userController.restrictTo("admin"),
  flightController.createFlight
);

router.get("/:id", flightController.getFlight);
router.patch(
  "/:id",
  userController.protect,
  userController.restrictTo("admin"),
  flightController.updateFlight
);
router.delete(
  "/:id",
  userController.protect,
  userController.restrictTo("admin"),
  flightController.deleteFlight
);

module.exports = router;
