const express = require("express");
const userController = require("../controllers/userController");
const robotController = require("../controllers/RobotController");
const authController = require("../controllers/authController");
const router = express.Router();


router
    .route('/')
    .get(authController.protect,
        authController.restrictTo("admin"),
        robotController.getAllRobots

    )

router.post(
    "/",
    authController.protect,
    authController.restrictTo("admin"),
    authController.createRobot
);

router.delete(
    "/deleteRobot/:id",
    authController.protect,
    authController.restrictTo("admin"),
    robotController.deleteRobot
);
module.exports = router;