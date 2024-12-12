const express = require("express");
const router = express.Router();

const robotController = require("../controllers/RobotController");

router.get('/eventTypeAnalysis', robotController.getEventTypeAnalysis);
router.get('/recentEventsAnalysis', robotController.getRecentEventsAnalysis);
router.get('/top-5-freqLocations', robotController.topFiveFrequentLocations);
router.get('/robotBehaviorRanks', robotController.RobotBehaviorRanks);

module.exports = router;