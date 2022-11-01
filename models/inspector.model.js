const mongoose = require("mongoose");

const inspectorSchema = new mongoose.Schema({
  passengerID: {
    type: Object,
    required: true,
  },

  passengerStatus: {
    type: String,
    required: true,
  },
});

const Inspector = mongoose.model("Inspector", inspectorSchema);
module.exports = Inspector;
