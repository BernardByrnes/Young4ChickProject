const Request = require("../models/Request");
const Notification = require("../models/Notification");

exports.getDashboard = async (req, res) => {
  try {
    console.log("GET /rep/dashboard accessed, user:", req.user || "None");
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const notifications = await Notification.find({
      user: userId,
      read: false,
    });
    res.render("rep/dashboard", {
      title: "Rep Dashboard",
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

exports.getRequest = (req, res) => {
  console.log("GET /rep/request accessed, user:", req.user || "None");
  res.render("rep/request", {
    title: "Record Request",
    user: req.user || { _id: "689f2332d1d614a142cda8e2", name: "John Denis" },
    error: null,
  });
};

exports.postRequest = async (req, res) => {
  try {
    console.log(
      "POST /rep/request received:",
      req.body,
      "User:",
      req.user || "None"
    );
    const { type, breed, quantity, farmerType } = req.body;
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const request = new Request({
      user: userId,
      type,
      breed,
      quantity,
      farmerType,
      status: "pending",
    });
    await request.save();
    await Notification.create({
      user: userId,
      message: `Rep recorded request for ${quantity} ${type} (${breed})`,
    });
    res.redirect("/rep/requests");
  } catch (err) {
    console.error("Request error:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.getRequests = async (req, res) => {
  try {
    console.log("GET /rep/requests accessed, user:", req.user || "None");
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const requests = await Request.find({ user: userId }).populate("user");
    res.render("rep/requests", {
      title: "Rep Requests",
      user: req.user || { _id: userId, name: "John Denis" },
      requests: requests || [],
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.getComplete = async (req, res) => {
  try {
    console.log("GET /rep/complete accessed, user:", req.user || "None");
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const requests = await Request.find({ user: userId, status: "approved" });
    res.render("rep/complete", {
      title: "Complete Requests",
      user: req.user || { _id: userId, name: "John Denis" },
      requests: requests || [],
    });
  } catch (err) {
    console.error("Error fetching complete requests:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.postComplete = async (req, res) => {
  try {
    console.log(
      "POST /rep/complete received:",
      req.body,
      "User:",
      req.user || "None"
    );
    const { requestId } = req.body;
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    await Request.updateOne(
      { _id: requestId, user: userId },
      { status: "completed", completedAt: new Date() }
    );
    await Notification.create({
      user: userId,
      message: `Request ${requestId} marked as completed`,
    });
    res.redirect("/rep/requests");
  } catch (err) {
    console.error("Complete request error:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};
