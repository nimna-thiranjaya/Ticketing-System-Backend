const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbConStr = process.env.MONGODB_URI;
    mongoose.connect(dbConStr, () => {
      console.log("Database connected");
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = { connectDB };
