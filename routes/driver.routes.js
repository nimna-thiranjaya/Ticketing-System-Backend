const express = require("express");
const DriverRouter = express.Router();

const { ChangeBusState } = require("../controllers/driver.controller");
const userAuth = require("../middlewares/user.middleware");

DriverRouter.post("/changeBusState", userAuth, ChangeBusState);

module.exports = DriverRouter;
