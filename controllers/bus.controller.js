const Bus = require("../models/bus.model");
const User = require("../models/user.model");
const BusStateTemp = require("../models/busStateTemp.model");

//Register Bus
const RegisterBus = async (req, res) => {
  try {
    const { busNumber, sheetCount, route, driver } = req.body;

    const busCheck = await Bus.findOne({ busNumber });
    const DriverDetails = await User.findById(driver);
    if (!busCheck) {
      const data = {
        busNumber,
        sheetCount,
        route,
        driverID: driver,
        driver: DriverDetails,
      };

      const newBus = await Bus.create(data);
      if (newBus) {
        const updatedata = {
          _id: newBus._id.valueOf(),
          sheetCount: newBus.sheetCount,
          route: newBus.route,
          busNumber: newBus.busNumber,
        };

        await User.findByIdAndUpdate(driver, {
          busDetails: updatedata,
          busDriverStatus: true,
          route: route,
        });

        return res
          .status(200)
          .send({ status: true, message: "Bus registered" });
      } else {
        return res.status(400).send({
          satus: false,
          message: "Somthing went wrong in bus register",
        });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Bus Already Registered" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const UpdateBus = async (req, res) => {
  try {
    const BusID = req.params.busID;
    const { busNumber, sheetCount, route, phoneNo, driver } = req.body;

    const DriverDetails = await User.findById(driver);

    var newdata = {
      busNumber,
      sheetCount,
      route,
      phoneNo,
      driverID: driver,
      driver: DriverDetails,
    };

    const updatedata = {
      _id: BusID,
      sheetCount: sheetCount,
      route: route,
      busNumber: busNumber,
    };

    await Bus.findByIdAndUpdate(BusID, newdata);
    await User.findByIdAndUpdate(driver, {
      busDetails: updatedata,
    });

    return res.status(200).send({ status: true, message: "Bus Updated" });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const DeleteBus = async (req, res) => {
  try {
    const BusID = req.params.busID;
    const busCheck = await Bus.findById(BusID);
    if (busCheck) {
      await Bus.findByIdAndDelete(BusID);
      await User.findByIdAndUpdate(busCheck.driverID, {
        busDriverStatus: false,
        busDetails: null,
        route: null,
      });
      return res.status(200).send({ status: true, message: "Bus Deleted" });
    } else {
      return res.status(400).send({ status: false, message: "Bus not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    return res.status(200).send({ status: true, data: buses });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
const GetOneBus = async (req, res) => {
  try {
    const BusID = req.params.busID;
    const bus = await Bus.findById(BusID);
    if (bus) {
      return res.status(200).send({ status: true, busdetails: bus });
    } else {
      return res.status(400).send({ status: false, message: "Bus not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetOneBusTemp = async (req, res) => {
  try {
    const BusID = req.params.busID;
    const bus = await BusStateTemp.findOne({ busId: BusID });
    return res.status(200).send({ status: true, bustempDetails: bus });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  RegisterBus,
  UpdateBus,
  DeleteBus,
  GetAllBuses,
  GetOneBus,
  GetOneBusTemp,
};
