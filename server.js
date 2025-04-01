require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const connectDB = require("./config/dbConnect");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 8080;

// Connect to the database
connectDB();

// Middleware setup
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Custom routes
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
// 404 handler: This will be executed only if no other routes match
app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// MongoDB connection and server start
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
