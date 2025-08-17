const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

router.use(protect);

router.post("/mark-read/:id", notificationController.markRead);

module.exports = router;
