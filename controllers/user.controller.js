const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const UserTravel = require("../models/userTravel.model");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");

// User Register Function
// (Admin , LocalPassenger , ForeignPassenger , Inspector)
const UserRegister = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      nic,
      passportNo,
      country,
      userExpDate,
      route,
      role,
    } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (role == "Admin") {
        const data = {
          firstName: firstName,
          lastName: lastName,
          fullName: firstName + " " + lastName,
          email: email,
          phoneNo: phoneNo,
          nic: nic,
          password: hashedPassword,
          role: role,
        };
        const newAdmin = await User.create(data);
        if (newAdmin) {
          res
            .status(200)
            .send({ status: true, message: "Admin registered successfully" });
        } else {
          res
            .status(400)
            .send({ status: false, message: "Admin registration failed" });
        }
      } else if (role == "LocalPassenger") {
        const data = {
          firstName: firstName,
          lastName: lastName,
          fullName: firstName + " " + lastName,
          email: email,
          phoneNo: phoneNo,
          nic: nic,
          password: hashedPassword,
          totalCredit: 100.0,
          role: role,
        };
        const newLocalPassenger = await User.create(data);

        if (newLocalPassenger) {
          const encryptedUserID = jwt.sign(
            { userID: newLocalPassenger._id },
            process.env.JWT_SECRET_QR
          );

          //console.log(encryptedUserID);
          //Slet stringData = JSON.stringify(data);

          QRCode.toDataURL(encryptedUserID, function (err, GenaratedQR) {
            if (err) {
              console.log("error occurred in QR code generation");
            } else {
              User.findByIdAndUpdate(
                newLocalPassenger._id,
                { smartCard: GenaratedQR },
                { new: true },
                (err, updatedUser) => {
                  if (err) {
                    User.findByIdAndDelete(newLocalPassenger._id);
                    res.status(400).send({
                      status: false,
                      message: "Local Passenger registration failed",
                    });
                  } else {
                    res.status(200).send({
                      status: true,
                      message: "Local Passenger registered successfully",
                    });
                  }
                }
              );
            }
          });
        } else {
          res.status(400).send({
            status: false,
            message: "Local Passenger registration failed",
          });
        }
      } else if (role == "ForeignPassenger") {
        const data = {
          firstName: firstName,
          lastName: lastName,
          fullName: firstName + " " + lastName,
          email: email,
          phoneNo: phoneNo,
          passportNo: passportNo,
          password: hashedPassword,
          totalCredit: 100.0,
          country: country,
          userExpDate: userExpDate,
          role: role,
        };
        const newForeignPassenger = await User.create(data);
        if (newForeignPassenger) {
          const encryptedUserID = jwt.sign(
            { userID: newForeignPassenger._id },
            process.env.JWT_SECRET_QR
          );
          //let stringData = JSON.stringify(data);

          QRCode.toDataURL(encryptedUserID, function (err, GenaratedQR) {
            if (err) {
              console.log("error occurred in QR code generation");
            } else {
              User.findByIdAndUpdate(
                newForeignPassenger._id,
                { smartCard: GenaratedQR },
                { new: true },
                (err, updatedUser) => {
                  if (err) {
                    User.findByIdAndDelete(newForeignPassenger._id);
                    res.status(400).send({
                      status: false,
                      message: "Foreign Passenger registration failed",
                    });
                  } else {
                    res.status(200).send({
                      status: true,
                      message: "Foreign Passenger registered successfully",
                    });
                  }
                }
              );
            }
          });
        } else {
          res.status(400).send({
            status: false,
            message: "Foreign Passenger registration failed",
          });
        }
      } else if (role == "Driver") {
        const data = {
          firstName: firstName,
          lastName: lastName,
          fullName: firstName + " " + lastName,
          email: email,
          phoneNo: phoneNo,
          nic: nic,
          password: hashedPassword,
          busDriverStatus: false,
          role: role,
        };
        const newInspector = await User.create(data);
        if (newInspector) {
          res.status(200).send({
            status: true,
            message: "Driver registered successfully",
          });
        } else {
          res.status(400).send({
            status: false,
            message: "Driver registration failed",
          });
        }
      } else if (role == "Inspector") {
        const data = {
          firstName: firstName,
          lastName: lastName,
          fullName: firstName + " " + lastName,
          email: email,
          phoneNo: phoneNo,
          nic: nic,
          password: hashedPassword,
          route: route,
          role: role,
        };
        const newInspector = await User.create(data);
        if (newInspector) {
          return res.status(200).send({
            status: true,
            message: "Inspector registered successfully",
          });
        } else {
          return res.status(400).send({
            status: false,
            message: "Inspector registration failed",
          });
        }
      } else {
        return res.status(400).send({ status: false, message: "Invalid Role" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "User already exists" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// User Login Function
const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const allForiegnPassengers = await User.find({ role: "ForeignPassenger" });
    allForiegnPassengers.forEach(async (passenger) => {
      const today = new Date();
      const expDate = new Date(passenger.userExpDate);
      if (expDate < today) {
        await User.findByIdAndUpdate(
          passenger._id,
          { accountStatus: "Expired" },
          { new: true }
        );
      }
    });

    const user = await User.findOne({ email: email });
    if (user) {
      if (user.accountStatus == "Expired") {
        return res
          .status(400)
          .send({ status: false, message: "Your account has been expired" });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "2d",
          });

          const tokens = {
            token: token,
          };

          await User.findByIdAndUpdate(
            user._id,
            { tokens: tokens },
            { new: true }
          );
          return res.status(200).send({
            status: true,
            message: "Login Success",
            token: token,
            role: user.role,
          });
        } else {
          return res
            .status(400)
            .send({ status: false, message: "Invalid Password" });
        }
      }
    } else {
      return res.status(400).send({ status: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//User Logout Function
const UserLogout = async (req, res) => {
  try {
    req.logedUser.tokens = req.logedUser.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.logedUser.save();

    return res.status(200).send({
      success: true,
      message: "User Logout Successful",
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//User Profile detais get using token
const UserProfile = async (req, res) => {
  try {
    const logedUser = req.logedUser;

    return res.status(200).send({ status: true, user: logedUser });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetOneUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const userDetails = await User.findById(userId);

    if (userDetails) {
      return res.status(200).send({ status: true, user: userDetails });
    } else {
      return res.status(400).send({ status: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//User Profile Update
const UpdateUser = async (req, res) => {
  try {
    const userId = req.logedUser._id;
    const { firstName, lastName, phoneNo, nic, passportNo, country, route } =
      req.body;

    const user = await User.findById(userId);

    if (user) {
      const data = {
        firstName: firstName,
        lastName: lastName,
        fullName: firstName + " " + lastName,
        phoneNo: phoneNo,
        nic: nic,
        passportNo: passportNo,
        country: country,
        route,
      };

      const updatedUser = await User.findByIdAndUpdate(userId, data);

      if (updatedUser) {
        return res.status(200).send({
          status: true,
          message: "User updated successfully",
        });
      } else {
        return res.status(400).send({
          status: false,
          message: "User update failed",
        });
      }
    } else {
      return res.status(400).send({ status: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//Delete User Profile
const DeleteUserProfile = async (req, res) => {
  try {
    const userId = req.logedUser._id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      return res.status(200).send({
        status: true,
        message: "User deleted successfully",
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "User delete failed",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//Get all passengers
const GetAllPassengers = async (req, res) => {
  try {
    const allPassengers = await User.find({
      $or: [{ role: "LocalPassenger" }, { role: "ForeignPassenger" }],
    });

    if (allPassengers) {
      return res.status(200).send({ status: true, users: allPassengers });
    } else {
      return res.status(400).send({ status: false, message: "No users found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//Get all Drivers
const GetAllDriver = async (req, res) => {
  try {
    const allInspectors = await User.find({ role: "Driver" });

    if (allInspectors) {
      return res.status(200).send({ status: true, users: allInspectors });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "No Driver found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//Get all Inspectors
const GetAllInspectors = async (req, res) => {
  try {
    const allInspectors = await User.find({ role: "Inspector" });

    if (allInspectors) {
      return res.status(200).send({ status: true, users: allInspectors });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "No Inspector found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//Delete User by ID
const DeleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      return res.status(200).send({
        status: true,
        message: "User deleted successfully",
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "User delete failed",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//Update user by ID
const UpdateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, phoneNo, nic, passportNo, country, route } =
      req.body;

    const user = await User.findById(userId);

    if (user) {
      const data = {
        firstName: firstName,
        lastName: lastName,
        fullName: firstName + " " + lastName,
        phoneNo: phoneNo,
        nic: nic,
        passportNo: passportNo,
        country: country,
        route,
      };

      const updatedUser = await User.findByIdAndUpdate(userId, data);

      if (updatedUser) {
        return res.status(200).send({
          status: true,
          message: "User updated successfully",
        });
      } else {
        return res.status(400).send({
          status: false,
          message: "User update failed",
        });
      }
    } else {
      return res.status(400).send({ status: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetNotAllocatedDrivers = async (req, res) => {
  try {
    const allDrivers = await User.find({
      role: "Driver",
      busDriverStatus: false,
    });

    return res.status(200).send({ status: true, users: allDrivers });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetAllTravelHistory = async (req, res) => {
  try {
    const allTravelHistory = await UserTravel.find();

    return res.status(200).send({ status: true, users: allTravelHistory });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetTravelHistoryByID = async (req, res) => {
  try {
    const userID = req.params.id;

    const travelHistory = await UserTravel.find({ passengerID: userID });

    return res.status(200).send({ status: true, travelHistory: travelHistory });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetTravelHistoryBytoken = async (req, res) => {
  try {
    const userID = req.logedUser._id;

    const travelHistory = await UserTravel.find({ passengerID: userID });

    return res.status(200).send({ status: true, travelHistory: travelHistory });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
module.exports = {
  UserRegister,
  UserLogin,
  UserLogout,
  UserProfile,
  GetOneUser,
  UpdateUser,
  DeleteUserProfile,
  GetAllPassengers,
  GetAllDriver,
  GetAllInspectors,
  DeleteUserById,
  UpdateUserById,
  GetNotAllocatedDrivers,
  GetAllTravelHistory,
  GetTravelHistoryByID,
  GetTravelHistoryBytoken,
};
