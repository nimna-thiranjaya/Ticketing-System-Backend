const express = require("express");
const DriverRouter = express.Router();

const {
  ChangeBusState,
  PassengerGetOn,
  PassengerGetOff,
  GetBusCurrentStatus,
} = require("../controllers/driver.controller");
const userAuth = require("../middlewares/user.middleware");

DriverRouter.post("/changeBusState", userAuth, ChangeBusState);
DriverRouter.post("/passengerGetOn", userAuth, PassengerGetOn);
DriverRouter.post("/passengerGetOff", userAuth, PassengerGetOff);
DriverRouter.get("/getBusCurrentStatus", userAuth, GetBusCurrentStatus);

module.exports = DriverRouter;
