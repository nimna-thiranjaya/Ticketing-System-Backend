const express = require("express");
const BusRouter = express.Router();

const {
  RegisterBus,
  UpdateBus,
  DeleteBus,
  GetAllBuses,
  GetOneBus,
  GetOneBusTemp,
  //   GetAllBusesByRoute,
} = require("../controllers/bus.controller");

BusRouter.post("/registerBus", RegisterBus);
BusRouter.patch("/updateBus/:busID", UpdateBus);
BusRouter.delete("/deleteBus/:busID", DeleteBus);
BusRouter.get("/getAllBuses", GetAllBuses);
BusRouter.get("/getOneBus/:busID", GetOneBus);
// BusRouter.get("/getAllBusesByRoute/:routeNo", GetAllBusesByRoute);
BusRouter.get("/getOneBusTemp/:busID", GetOneBusTemp);

module.exports = BusRouter;
