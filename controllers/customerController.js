const Request = require("../models/Request");
const Notification = require("../models/Notification");

exports.getDashboard = async (req, res) => {
  try {
    console.log("GET /customer/dashboard accessed, user:", req.user || "None");
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const notifications = await Notification.find({
      user: userId,
      read: false,
    });
    res.render("customer/dashboard", {
      title: "Customer Dashboard",
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
  console.log("GET /customer/request accessed, user:", req.user || "None");
  res.render("customer/request", {
    title: "Submit Request",
    user: req.user || { _id: "689f2332d1d614a142cda8e2", name: "John Denis" },
    error: null,
  });
};

exports.postRequest = async (req, res) => {
  try {
    console.log(
      "POST /customer/request received:",
      req.body,
      "User:",
      req.user || "None"
    );
    const { type, breed, quantity, farmerType } = req.body;
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const lastRequest = await Request.findOne({ user: userId }).sort({
      createdAt: -1,
    });
    if (
      lastRequest &&
      new Date() - lastRequest.createdAt < 120 * 24 * 60 * 60 * 1000
    ) {
      return res.render("customer/request", {
        title: "Submit Request",
        user: req.user || { _id: userId, name: "John Denis" },
        error: "You can only make one request every 4 months",
      });
    }
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
      message: `Your request for ${quantity} ${type} (${breed}) has been submitted`,
    });
    res.redirect("/customer/requests");
  } catch (err) {
    console.error("Request error:", err);
    res
      .status(500)
      .render("error", { title: "Error", message: "Server error" });
  }
};

exports.getRequests = async (req, res) => {
  try {
    console.log("GET /customer/requests accessed, user:", req.user || "None");
    const userId = req.user ? req.user._id : "689f2332d1d614a142cda8e2"; // john denis
    const requests = await Request.find({ user: userId }).populate("user");
    res.render("customer/requests", {
      title: "My Requests",
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
