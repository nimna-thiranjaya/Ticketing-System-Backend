const mongoose = require("mongoose");

const UserTravelSchema = new mongoose.Schema(
  {
    passengerID: {
      type: String,
      required: true,
    },
    passengerName: {
      type: String,
    },
    busID: {
      type: String,
      required: true,
    },
    busRunningID: {
      type: String,
    },
    busNumber: {
      type: String,
    },
    routeNo: {
      type: String,
      required: true,
    },
    routeName: {
      type: String,
      required: true,
    },
    getOnHoltID: {
      type: Number,
      required: true,
    },
    getOffHoltID: {
      type: Number,
      required: true,
    },
    getOffHoltName: {
      type: String,
      required: true,
    },
    getOnHoltName: {
      type: String,
      required: true,
    },
    getOnTime: {
      type: String,
      required: true,
    },
    getOffTime: {
      type: String,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const UserTravel = mongoose.model("UserTravel", UserTravelSchema);
module.exports = UserTravel;
