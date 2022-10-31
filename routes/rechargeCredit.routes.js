const express = require("express");
const RechargeCreditRouter = express.Router();

const userAuth = require("../middlewares/user.middleware");

const {
  RechargeCredit,
  RechargeCreditbyApp,
  GetRechargeHistory,
  GetRechargeHistoryById,
  GetRechargeHistoryByToken,
} = require("../controllers/rechargeCredits.controller");

RechargeCreditRouter.post("/rechargeCredit", RechargeCredit);
RechargeCreditRouter.post(
  "/rechargeCreditbyApp",
  userAuth,
  RechargeCreditbyApp
);
RechargeCreditRouter.get("/getRechargeHistory", GetRechargeHistory);
RechargeCreditRouter.get("/getRechargeHistoryById/:id", GetRechargeHistoryById);
RechargeCreditRouter.get(
  "/getRechargeHistoryByToken",
  userAuth,
  GetRechargeHistoryByToken
);

module.exports = RechargeCreditRouter;
