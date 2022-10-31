const express = require("express");

const HelperRouter = express.Router();

const {
  GetAllRoutes,
  GetSpecificRoute,
  GetHoltsInRote,
} = require("../controllers/helper.controller");

HelperRouter.get("/getAllRoutes", GetAllRoutes);
HelperRouter.get("/getSpecificRoute/:routeID", GetSpecificRoute);
HelperRouter.get("/getHoltsInRote/:routeID", GetHoltsInRote);

module.exports = HelperRouter;
