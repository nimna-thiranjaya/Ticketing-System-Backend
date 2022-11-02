const InspectorStatus = require("../models/inspectorStatus.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const CheckAccounValidity = async (req, res) => {
  try {
    const { passengerID, passengerStatus } = req.body;
    const passenger = await User.findOne({ _id: passengerID });

    const passengerData = {
      _id: passenger._id,
      email: passenger.email,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      role: passenger.role,
      totalCredit: passenger.totalCredit,
    };
    const data = {
      passenger: passengerData,
      passengerStatus: passengerStatus,
    };

    const newInspectorStatus = await InspectorStatus.create(data);

    if (!newInspectorStatus) {
      return res
        .status(500)
        .send({ status: false, message: "Something went wrong" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "Passenger Status Added" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetPassengerDetailsByQR = async (req, res) => {
  try {
    const { QRToken } = req.body;

    var UserData = jwt.verify(QRToken, process.env.JWT_SECRET_QR);

    var passenger = await User.findOne({ _id: UserData.userID });

    if (!passenger) {
      return res
        .status(400)
        .send({ status: false, message: "Passenger Not Found" });
    } else {
      return res.status(200).send({ status: true, passenger: passenger });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetAllInspectorReport = async (req, res) => {
  try {
    const inspectorStatus = await InspectorStatus.find({});

    if (!inspectorStatus) {
      return res
        .status(400)
        .send({ status: false, message: "No Status Found" });
    } else {
      return res
        .status(200)
        .send({ status: true, inspectors: inspectorStatus });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  CheckAccounValidity,
  GetPassengerDetailsByQR,
  GetAllInspectorReport,
};
