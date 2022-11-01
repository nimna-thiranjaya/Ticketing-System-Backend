const express = require("express");
const DriverRouter = express.Router();

const {
  ChangeBusState,
  PassengerGetOn,
  PassengerGetOff,
} = require("../controllers/driver.controller");
const userAuth = require("../middlewares/user.middleware");

DriverRouter.post("/changeBusState", userAuth, ChangeBusState);
DriverRouter.post("/passengerGetOn", userAuth, PassengerGetOn);
DriverRouter.post("/passengerGetOff", userAuth, PassengerGetOff);

module.exports = DriverRouter;
