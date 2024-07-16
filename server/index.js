const express = require("express");
const app = express();
require("dotenv").config();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const coursesRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 3000;
console.log(`Environment PORT: ${process.env.PORT}`);
console.log(`Using PORT: ${PORT}`);

database.connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://localhost:3000",
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp",
  })
);
cloudinaryConnect();
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", coursesRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Server is running fine sit back and chill",
  });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
