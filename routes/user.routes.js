const express = require("express");
const UserRouter = express.Router();
const userAuth = require("../middlewares/user.middleware");

const {
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
} = require("../controllers/user.controller");

UserRouter.post("/userRegister", UserRegister);
UserRouter.post("/userLogin", UserLogin);
UserRouter.get("/userLogout", userAuth, UserLogout);
UserRouter.get("/profile", userAuth, UserProfile);
UserRouter.get("/getOneUser/:id", GetOneUser);
UserRouter.patch("/updateUser", userAuth, UpdateUser);
UserRouter.delete("/deleteUser", userAuth, DeleteUserProfile);
UserRouter.get("/getAllPassengers", GetAllPassengers);
UserRouter.get("/getAllDrivers", GetAllDriver);
UserRouter.get("/getAllInspectors", GetAllInspectors);
UserRouter.delete("/deleteUserById/:id", DeleteUserById);
UserRouter.patch("/updateUserById/:id", UpdateUserById);
UserRouter.get("/getNotAllocatedDrivers", GetNotAllocatedDrivers);
UserRouter.get("/getAllTravelHistory", GetAllTravelHistory);
UserRouter.get("/getTravelHistoryByID/:id", GetTravelHistoryByID);
UserRouter.get("/getTravelHistoryBytoken", userAuth, GetTravelHistoryBytoken);

module.exports = UserRouter;
