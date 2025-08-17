const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/dashboard", customerController.getDashboard);
router.get("/request", customerController.getRequest);
router.post("/request", customerController.postRequest);
router.get("/requests", customerController.getRequests);

module.exports = router;
