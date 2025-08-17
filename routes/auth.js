const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    console.log("POST /auth/register received:", req.body); // Debug log
    const {
      name,
      email,
      password,
      age,
      gender,
      nin,
      recommenderName,
      recommenderNIN,
      contact,
      role,
    } = req.body;
    if (!["customer", "rep", "manager"].includes(role)) {
      return res.render("auth/register", {
        title: "Register",
        error: "Invalid role selected",
      });
    }
    if (await User.findOne({ $or: [{ email }, { nin }] })) {
      return res.render("auth/register", {
        title: "Register",
        error: "Email or NIN already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      age,
      gender,
      nin,
      recommenderName,
      recommenderNIN,
      contact,
      createdAt: new Date(),
    });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Register token set:", token); // Debug log
    res.cookie("token", token, { httpOnly: true });
    if (role === "manager") res.redirect("/manager/dashboard");
    else if (role === "rep") res.redirect("/rep/dashboard");
    else res.redirect("/customer/dashboard");
  } catch (err) {
    console.error("Registration error:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("POST /auth/login received:", req.body); // Debug log
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Login token set:", token); // Debug log
    res.cookie("token", token, { httpOnly: true });
    if (user.role === "manager") res.redirect("/manager/dashboard");
    else if (user.role === "rep") res.redirect("/rep/dashboard");
    else res.redirect("/customer/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register", error: null });
});

router.post("/register", exports.register);

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login", error: null });
});

router.post("/login", exports.login);

module.exports = router;
