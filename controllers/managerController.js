const Request = require("../models/Request");
const Notification = require("../models/Notification");
const Stock = require("../models/Stock");

exports.getDashboard = async (req, res) => {
  try {
    console.log("GET /manager/dashboard accessed, user:", req.user || "None");
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const notifications = await Notification.find({
      user: userId,
      read: false,
    });
    res.render("manager/dashboard", {
      title: "Manager Dashboard",
      user: req.user || { _id: userId, name: "John Denis" },
      notifications,
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.getApprove = async (req, res) => {
  try {
    console.log("GET /manager/approve accessed, user:", req.user || "None");
    const requests = await Request.find({ status: "pending" }).populate("user");
    res.render("manager/approve", {
      title: "Approve Requests",
      user: req.user || { _id: "689f2332d1d614a142cda8e2", name: "John Denis" },
      requests: requests || [],
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.postApprove = async (req, res) => {
  try {
    console.log(
      "POST /manager/approve received:",
      req.body,
      "User:",
      req.user || "None"
    );
    const { requestId, action } = req.body;
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const status = action === "approve" ? "approved" : "rejected";
    await Request.updateOne(
      { _id: requestId },
      { status, approvedAt: new Date() }
    );
    await Notification.create({
      user: userId,
      message: `Request ${requestId} ${status}`,
    });
    res.redirect("/manager/approve");
  } catch (err) {
    console.error("Approve request error:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.getRequests = async (req, res) => {
  try {
    console.log("GET /manager/requests accessed, user:", req.user || "None");
    const requests = await Request.find().populate("user");
    res.render("manager/requests", {
      title: "All Requests",
      user: req.user || { _id: "689f2332d1d614a142cda8e2", name: "John Denis" },
      requests: requests || [],
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.getStock = (req, res) => {
  console.log("GET /manager/stock accessed, user:", req.user || "None");
  res.render("manager/stock", {
    title: "Add Stock",
    user: req.user || { _id: "689f2332d1d614a142cda8e2", name: "John Denis" },
    error: null,
  });
};

exports.postStock = async (req, res) => {
  try {
    console.log(
      "POST /manager/stock received:",
      req.body,
      "User:",
      req.user || "None"
    );
    const { type, breed, quantity } = req.body;
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const stock = new Stock({
      type,
      breed,
      quantity,
      addedBy: userId,
    });
    await stock.save();
    await Notification.create({
      user: userId,
      message: `Added ${quantity} ${type} (${breed}) to stock`,
    });
    res.redirect("/manager/stocks");
  } catch (err) {
    console.error("Stock error:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.getStocks = async (req, res) => {
  try {
    console.log("GET /manager/stocks accessed, user:", req.user || "None");
    const stocks = await Stock.find().populate("addedBy");
    res.render("manager/stocks", {
      title: "View Stock",
      user: req.user || { _id: "689f2332d1d614a142cda8e2", name: "John Denis" },
      stocks: stocks || [],
    });
  } catch (err) {
    console.error("Error fetching stocks:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};
