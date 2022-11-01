const mongoose = require("mongoose");

const inspectorStatusSchema = new mongoose.Schema({
  passenger: {
    type: Object,
    required: true,
  },

  passengerStatus: {
    type: String,
    required: true,
  },
});

const InspectorStatus = mongoose.model(
  "InspectorStatus",
  inspectorStatusSchema
);
module.exports = InspectorStatus;
