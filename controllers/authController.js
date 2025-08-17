const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  res.render("auth/login", { title: "Login - Young4ChickS", error: null });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: User not found");
      return res.render("auth/login", {
        title: "Login - Young4ChickS",
        error: "Invalid email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed: Incorrect password");
      return res.render("auth/login", {
        title: "Login - Young4ChickS",
        error: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Login successful, token generated");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    if (user.role === "customer") {
      return res.redirect("/customer/dashboard");
    } else if (user.role === "rep") {
      return res.redirect("/rep/dashboard");
    } else if (user.role === "manager") {
      return res.redirect("/manager/dashboard");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.render("error", {
      title: "Error",
      message: "Server error during login",
    });
  }
};

exports.getRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register - Young4ChickS",
    error: null,
  });
};

exports.postRegister = async (req, res) => {
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
  } = req.body;
  console.log("Registration attempt:", {
    name,
    email,
    age,
    gender,
    nin,
    recommenderName,
    recommenderNIN,
    contact,
  });
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { nin }] });
    if (existingUser) {
      console.log("Registration failed: Email or NIN already exists");
      return res.render("auth/register", {
        title: "Register - Young4ChickS",
        error: "Email or NIN already registered",
      });
    }
    if (age < 18 || age > 30) {
      console.log("Registration failed: Invalid age");
      return res.render("auth/register", {
        title: "Register - Young4ChickS",
        error: "Age must be between 18 and 30",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      age,
      gender,
      nin,
      recommenderName,
      recommenderNIN,
      contact,
    });
    console.log("User object to save:", user);
    await user.save();
    console.log("User saved successfully");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Registration successful, token generated");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.redirect("/customer/dashboard");
  } catch (err) {
    console.error("Registration error:", err);
    res.render("auth/register", {
      title: "Register - Young4ChickS",
      error: "Server error during registration: " + err.message,
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};
