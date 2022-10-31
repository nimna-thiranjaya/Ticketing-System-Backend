const allRoutes = require("../data/route.data");
const GetAllRoutes = async (req, res) => {
  try {
    return res.status(200).send({ status: true, data: allRoutes });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const GetSpecificRoute = async (req, res) => {
  try {
    const routeID = req.params.routeID;
    const route = allRoutes.filter((route) => route.routeId == routeID);
    if (route.length > 0) {
      return res.status(200).send({ status: true, data: route });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Route not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetHoltsInRote = async (req, res) => {
  try {
    const routeID = req.params.routeID;
    const route = allRoutes.filter((route) => route.routeId == routeID);
    if (route.length > 0) {
      return res.status(200).send({ status: true, holts: route[0].holts });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Route not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { GetAllRoutes, GetSpecificRoute, GetHoltsInRote };
