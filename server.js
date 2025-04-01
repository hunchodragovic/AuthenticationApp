require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/dbConnect");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 5000;
connectDB();
app.use(cors(corsOptions));
app.use(cookieParser());
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
