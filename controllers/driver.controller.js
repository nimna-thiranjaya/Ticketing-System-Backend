const BusStateTemp = require("../models/busStateTemp.model");
const Bus = require("../models/bus.model");

const ChangeBusState = async (req, res) => {
  const { busState } = req.body;

  const logedUser = req.logedUser;

  const busDetails = await Bus.findOne({ _id: logedUser.busDetails._id });

  console.log(busDetails);
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
      });
      return res
        .status(200)
        .send({ status: true, message: "Bus State Changed" });
    } else {
      await Bus.findByIdAndUpdate(logedUser.busDetails._id, {
        busState: busState,
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

module.exports = { ChangeBusState };
