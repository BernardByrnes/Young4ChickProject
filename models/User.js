const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["customer", "rep", "manager"] },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  nin: { type: String, required: true, unique: true },
  recommenderName: { type: String, required: true },
  recommenderNIN: { type: String, required: true },
  contact: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", UserSchema);
