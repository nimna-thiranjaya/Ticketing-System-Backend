const mongoose = require("mongoose");

const RechargeCreditsSchema = new mongoose.Schema(
  {
    passengerID: {
      type: String,
      required: true,
    },
    passengerDetails: {
      type: Object,
    },
    amount: {
      type: Number,
      required: true,
    },
    rechargeType: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RechargeCredits = mongoose.model(
  "RechargeCredits",
  RechargeCreditsSchema
);
module.exports = RechargeCredits;
