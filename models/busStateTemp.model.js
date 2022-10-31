const mongoose = require("mongoose");

const busStateTempSchema = new mongoose.Schema(
  {
    busId: {
      type: String,
      required: true,
    },
    busState: {
      type: String,
      required: true,
    },
    sheetCount: {
      type: Number,
      required: true,
    },
    remainingSeats: {
      type: Number,
      required: true,
    },
    driverID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BusStateTemp = mongoose.model("BusStateTemp", busStateTempSchema);
module.exports = BusStateTemp;
