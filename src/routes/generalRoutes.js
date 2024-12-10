const express = require("express");
const reportController = require("../controllers/reportController");
const authController = require("../controllers/authController");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.get('/allJobs',
    authController.protect,
    authController.restrictTo("admin", "technician", "observer"),
    jobController.getAllJobs
)


router.route('/maintenanceReport/:jobId')
    .post(authController.protect,
        authController.restrictTo("observer"),
        reportController.createMaintenanceReport)
    .get(authController.protect,
        authController.restrictTo("observer"),
        reportController.getMaintenanceReportByJobId)

router.get('/allMaintenanceReports',
    authController.protect,
    authController.restrictTo("observer"),
    reportController.getAllMaintenanceReports
)

module.exports = router;