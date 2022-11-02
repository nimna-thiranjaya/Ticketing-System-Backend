const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      trim: true,
    },

    sheetCount: {
      type: Number,
      required: true,
    },

    route: {
      type: Number,
      required: true,
    },

    driverID: {
      type: String,
      required: true,
    },
    driver: {
      type: Object,
    },
    busState: {
      type: String,
      default: "Stopped",
    },
    BusRunningID: {
      type: String,
    },
    totalEarning: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus;
