const mongoose = require("mongoose");
const customerController = require("../controllers/customerController");
const RequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["layers", "broilers"],
    required: true,
  },
  breed: {
    type: String,
    enum: ["local", "exotic"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  farmerType: {
    type: String,
    enum: ["starter", "returning"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Request", RequestSchema);
