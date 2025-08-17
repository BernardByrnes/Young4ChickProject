const mongoose = require("mongoose");
const StockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  breed: { type: String, required: true },
  quantity: { type: Number, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Stock", StockSchema);
