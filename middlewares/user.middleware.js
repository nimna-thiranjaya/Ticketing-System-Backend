const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const userAuth = async (req, res, next) => {
  try {
    const usedtoken = req.header("Authorization");
    try {
      var token = usedtoken;
    } catch (e) {
      return res
        .status(401)
        .send({ status: false, message: "User Login Required" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const logedUser = await User.findOne({
      _id: decode._id,
      "tokens.token": token,
    });
    if (!logedUser) {
      return res
        .status(401)
        .send({ status: false, message: "Please Authenticate" });
    }
    req.token = token;
    req.logedUser = logedUser;
    next();
  } catch (error) {
    return res.status(401).send({ status: false, message: error.message });
  }
};

module.exports = userAuth;
