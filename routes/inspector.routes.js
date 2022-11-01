const express = require("express");
const InspectorRouter = express.Router();

const {
  CheckAccounValidity,
  GetPassengerDetailsByQR,
  GetAllInspectorReport,
} = require("../controllers/inspector.controller");

InspectorRouter.post("/checkAccountValidity", CheckAccounValidity);
InspectorRouter.get("/getPassengerDetailsByQR", GetPassengerDetailsByQR);
InspectorRouter.get("/getAllInspectorReport", GetAllInspectorReport);

module.exports = InspectorRouter;
