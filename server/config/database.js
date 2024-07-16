const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {})
    .then(() =>
      console.log("DB Connected Succesfully at " + process.env.MONGODB_URL)
    )
    .catch((error) => {
      console.log("DB Connection failed");
      console.error(error);
      process.exit(1);
    });
};
