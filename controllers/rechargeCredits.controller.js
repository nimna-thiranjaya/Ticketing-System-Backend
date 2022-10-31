const RechargeCredits = require("../models/rechargeCredit.model.js");
const User = require("../models/user.model");

const RechargeCredit = async (req, res) => {
  try {
    const { amount, email, rechargeType, paymentMethod } = req.body;
    if (email) {
      const userCheck = await User.findOne({
        $or: [{ role: "LocalPassenger" }, { role: "ForeignPassenger" }],
        $and: [{ email: email }],
      });

      if (userCheck) {
        if (userCheck.accountStatus == "Active") {
          var userData = {
            _id: userCheck._id.valueOf(),
            fullName: userCheck.fullName,
            email: userCheck.email,
            phoneNo: userCheck.phoneNo,
            role: userCheck.role,
          };

          const data = {
            passengerID: userCheck._id,
            amount: amount,
            rechargeType: rechargeType,
            paymentMethod: paymentMethod,
            passengerDetails: userData,
          };
          const newRecharge = await RechargeCredits.create(data);
          if (newRecharge) {
            var newAmount = userCheck.totalCredit + amount;
            await User.findByIdAndUpdate(userCheck._id, {
              totalCredit: newAmount,
            });

            return res
              .status(200)
              .send({ status: true, message: "Recharge Successfull" });
          } else {
            await RechargeCredits.findByIdAndDelete(newRecharge._id);
            return res
              .status(400)
              .send({ status: false, message: "Recharge Failed" });
          }
        } else {
          return res
            .status(400)
            .send({ status: false, message: "User Account is Expired" });
        }
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Invalid Email Address" });
      }
    } else {
      return res.status(400).send({ status: false, message: "Email Required" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const RechargeCreditbyApp = async (req, res) => {
  try {
    const { amount, rechargeType, paymentMethod } = req.body;
    const logedUser = req.logedUser;

    if (logedUser) {
      if (logedUser.accountStatus == "Active") {
        var userData = {
          _id: logedUser._id.valueOf(),
          fullName: logedUser.fullName,
          email: logedUser.email,
          phoneNo: logedUser.phoneNo,
          role: logedUser.role,
        };

        const data = {
          passengerID: logedUser._id,
          amount: amount,
          rechargeType: rechargeType,
          paymentMethod: paymentMethod,
          passengerDetails: userData,
        };
        const newRecharge = await RechargeCredits.create(data);

        if (newRecharge) {
          var newAmount = logedUser.totalCredit + amount;
          await User.findByIdAndUpdate(logedUser._id, {
            totalCredit: newAmount,
          });

          return res
            .status(200)
            .send({ status: true, message: "Recharge Successfull" });
        } else {
          await RechargeCredits.findByIdAndDelete(newRecharge._id);
          return res
            .status(400)
            .send({ status: false, message: "Recharge Failed" });
        }
      } else {
        return res
          .status(400)
          .send({ status: false, message: "User Account is Expired" });
      }
    } else {
      return res.status(400).send({ status: false, message: "Invalid User" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetRechargeHistory = async (req, res) => {
  try {
    const rechargeHistory = await RechargeCredits.find();

    return res.status(200).send({
      status: true,
      rechargeHistory: rechargeHistory,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//get recharge history by Id for passenger
const GetRechargeHistoryById = async (req, res) => {
  try {
    const userID = req.params.id;

    const rechargeHistory = await RechargeCredits.find({ passengerID: userID });

    return res
      .status(200)
      .send({ status: true, rechargeHistory: rechargeHistory });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetRechargeHistoryByToken = async (req, res) => {
  try {
    const logedUser = req.logedUser;

    const rechargeHistory = await RechargeCredits.find({
      passengerID: logedUser._id,
    });

    return res
      .status(200)
      .send({ status: true, rechargeHistory: rechargeHistory });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  RechargeCredit,
  RechargeCreditbyApp,
  GetRechargeHistory,
  GetRechargeHistoryById,
  GetRechargeHistoryByToken,
};
