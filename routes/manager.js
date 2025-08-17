const express = require("express");
const router = express.Router();
const managerController = require("../controllers/managerController");

router.get("/dashboard", managerController.getDashboard);
router.get("/approve", managerController.getApprove);
router.post("/approve", managerController.postApprove);
router.get("/requests", managerController.getRequests);
router.get("/stock", managerController.getStock);
router.post("/stock", managerController.postStock);
router.get("/stocks", managerController.getStocks);

module.exports = router;
