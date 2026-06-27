const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDb connected successfully");
  } catch (error) {
    console.error("DB connection error:", error);
  }
};

module.exports = connectDb;
