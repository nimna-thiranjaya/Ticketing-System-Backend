const BusStateTemp = require("../models/busStateTemp.model");
const Bus = require("../models/bus.model");
const UserTravel = require("../models/userTravel.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const allRoutes = require("../data/route.data");

const ChangeBusState = async (req, res) => {
  const { busState } = req.body;

  const logedUser = req.logedUser;

  const busDetails = await Bus.findOne({ _id: logedUser.busDetails._id });

  //console.log(busDetails);
  if (busState == "Running") {
    const busStatetemcheck = await BusStateTemp.findOne({
      driverID: logedUser._id,
    });
    const data = {
      busId: busDetails._id,
      busState: busState,
      sheetCount: busDetails.sheetCount,
      remainingSeats: busDetails.sheetCount,
      driverID: busDetails.driverID,
    };

    if (!busStatetemcheck) {
      const newStateChaged = await BusStateTemp.create(data);
      if (!newStateChaged) {
        return res
          .status(500)
          .send({ status: false, message: "Something went wrong" });
      } else {
        await Bus.findByIdAndUpdate(logedUser.busDetails._id, {
          busState: busState,
          BusRunningID: newStateChaged._id,
        });

        return res
          .status(200)
          .send({ status: true, message: "Bus State Changed" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Bus is already running" });
    }
  } else if (busState == "Arrived") {
    const changeState = await BusStateTemp.findOneAndDelete({
      busId: logedUser.busDetails._id,
    });
    if (!changeState) {
      return res
        .status(500)
        .send({ status: false, message: "Something went wrong" });
    } else {
      await Bus.findByIdAndUpdate(logedUser.busDetails._id, {
        busState: busState,
        BusRunningID: null,
      });
      return res
        .status(200)
        .send({ status: true, message: "Bus State Changed" });
    }
  } else if (busState == "Stopped") {
    const buscheck = await BusStateTemp.findOne({
      busId: logedUser.busDetails._id,
    });
    if (buscheck) {
      await BusStateTemp.findOneAndDelete({ busId: logedUser.busDetails._id });
      await Bus.findByIdAndUpdate(logedUser.busDetails._id, {
        busState: busState,
        BusRunningID: null,
      });
      return res
        .status(200)
        .send({ status: true, message: "Bus State Changed" });
    } else {
      await Bus.findByIdAndUpdate(logedUser.busDetails._id, {
        busState: busState,
        BusRunningID: null,
      });
      return res
        .status(200)
        .send({ status: true, message: "Bus State Changed" });
    }
  } else {
    return res
      .status(400)
      .send({ status: false, message: "Invalid Bus State" });
  }
};

const calculateFare = (totalLength) => {
  if (totalLength <= 5) {
    return 30;
  } else {
    return 30 + (totalLength - 5) * 3;
  }
};

const PassengerGetOn = async (req, res) => {
  try {
    const logedUser = req.logedUser;
    const { QRToken, getOnHoltID, getOffHoltID } = req.body;

    var UserData = jwt.verify(QRToken, process.env.JWT_SECRET_QR);
    var passenger = await User.findOne({ _id: UserData.userID });
    var totalLength = Math.abs((getOnHoltID - getOffHoltID) * 4);
    var bus = await Bus.findOne({ driverID: logedUser._id });
    var fare = calculateFare(totalLength);
    var runningBusTemp = await BusStateTemp.findOne({
      _id: bus.BusRunningID,
    });

    if (!runningBusTemp.remainingSeats == 0) {
      console.log(passenger.totalCredit);
      if (passenger.totalCredit >= fare) {
        const route = allRoutes.find(
          (route) => route.routeId == logedUser.route
        );
        const getOnHoltName = route.holts.find(
          (holt) => holt.holtId == getOnHoltID
        ).holtName;
        const getOffHoltName = route.holts.find(
          (holt) => holt.holtId == getOffHoltID
        ).holtName;

        const data = {
          passengerID: passenger._id,
          passengerName: passenger.fullName,
          busID: bus._id,
          busRunningID: bus.BusRunningID,
          busNumber: bus.busNumber,
          routeNo: logedUser.route,
          routeName: route.routeName,
          getOnHoltID: getOnHoltID,
          getOnHoltName: getOnHoltName,
          getOffHoltID: getOffHoltID,
          getOffHoltName: getOffHoltName,
          getOnTime: new Date(),
          getOffTime: null,
          ticketPrice: fare,
        };

        const newPassengerTravel = await UserTravel.create(data);
        if (newPassengerTravel) {
          await User.findByIdAndUpdate(passenger._id, {
            totalCredit: passenger.totalCredit - fare,
            inATravelID: newPassengerTravel._id,
          });

          await Bus.findByIdAndUpdate(bus._id, {
            totalEarning: bus.totalEarning + fare,
          });

          await BusStateTemp.findByIdAndUpdate(bus.BusRunningID, {
            remainingSeats: runningBusTemp.remainingSeats - 1,
          });

          return res.status(200).send({
            status: true,
            message: "Passenger Travel Created",
          });
        } else {
          return res.status(500).send({
            status: false,
            message: "Something went wrong",
          });
        }
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Insufficient Credit" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "No Seats Available" });
    }

    // console.log(fare);
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const PassengerGetOff = async (req, res) => {
  try {
    const { QRToken } = req.body;
    const logedUser = req.logedUser;
    var UserData = jwt.verify(QRToken, process.env.JWT_SECRET_QR);
    var passenger = await User.findOne({ _id: UserData.userID });
    var bus = await Bus.findOne({ driverID: logedUser._id });
    var busRunning = await BusStateTemp.findOne({ _id: bus.BusRunningID });

    await UserTravel.findByIdAndUpdate(passenger.inATravelID, {
      getOffTime: new Date(),
    });

    await BusStateTemp.findByIdAndUpdate(bus.BusRunningID, {
      remainingSeats: busRunning.remainingSeats + 1,
    });

    await User.findByIdAndUpdate(passenger._id, {
      inATravelID: null,
    });

    return res.status(200).send({ status: true, message: "Passenger Get Off" });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetBusCurrentStatus = async (req, res) => {
  try {
    const LogedUser = req.logedUser;

    const busRunningStatus = await BusStateTemp.findOne({
      busId: LogedUser.busDetails._id,
      driverID: LogedUser._id,
    });
    return res
      .status(200)
      .send({ status: true, busRunningStatus: busRunningStatus });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetNotAssignDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: "Driver", busDriverStatus: false });

    return res.status(200).send({ status: true, driversNotAssign: drivers });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
module.exports = {
  ChangeBusState,
  PassengerGetOn,
  PassengerGetOff,
  GetBusCurrentStatus,
  GetNotAssignDrivers,
};
