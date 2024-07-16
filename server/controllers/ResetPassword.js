const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
//resetPassToken
exports.resetPasswordToken = async (req, res) => {
  //get email
  try {
    const email = req.body.email;

    //check user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    //generate token and expiry time
    const token = crypto.randomBytes(20).toString("hex");
    //add to user
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    //create url
    console.log("Details :", updatedDetails);
    //send email with link
    //return response
    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link : ${url}`
    );
    return res.json({
      success: true,
      message: "Email sent succesffuly for reset",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong:resetting pass",
    });
  }
};
//resetPassword

exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password != confirmPassword) {
      return res.json({
        success: false,
        message: "Password does not matches please check password is correct",
      });
    }
    //get userdedtails from token
    const userDetails = await User.findOne({ token: token });
    //if no entry invalid
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }
    //token expiry time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token expired regenerate",
      });
    }
    //hash new pass
    const hashedPassword = await bcrypt.hash(password, 10);

    //updatte to db
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    //response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password ",
    });
  }
};
