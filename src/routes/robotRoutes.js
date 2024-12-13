const express = require("express");
const robotController = require("../controllers/RobotController");
const authController = require("../controllers/authController");
const router = express.Router();


router
    .route("/")
    .get(authController.protect,
        authController.restrictTo("admin"),
        robotController.getAllRobots)
    .post(authController.protect,
        authController.restrictTo("admin"),
        robotController.createRobot)



router.delete(
    "/deleteRobot/:id",
    authController.protect,
    authController.restrictTo("admin"),
    robotController.deleteRobot
);
router.get('/detections', 
    authController.protect,
    robotController.getAllDetections);
module.exports = router;