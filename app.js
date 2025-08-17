const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/customer", require("./routes/customer"));
app.use("/rep", require("./routes/rep"));
app.use("/manager", require("./routes/manager"));
app.use("/notification", require("./routes/notification"));

// Home route
app.get("/", (req, res) => {
  res.render("home", { title: "Young4ChickS" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .render("error", { title: "Error", message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
