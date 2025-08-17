const express = require("express");
const router = express.Router();
const repController = require("../controllers/repController");

router.get("/dashboard", repController.getDashboard);
router.get("/request", repController.getRequest);
router.post("/request", repController.postRequest);
router.get("/requests", repController.getRequests);
router.get("/complete", repController.getComplete);
router.post("/complete", repController.postComplete);

module.exports = router;
