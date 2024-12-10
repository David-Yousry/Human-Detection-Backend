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


router.post('/maintenanceReport/:jobId',
    authController.protect,
    authController.restrictTo("observer"),
    reportController.createMaintenanceReport
)

router.get('allMaintenanceReports',
    authController.protect,
    authController.restrictTo("observer"),
    reportController.getAllMaintenanceReports
)

router.get('/maintenanceReport/:id',
    authController.protect,
    authController.restrictTo("observer"),
    reportController.getMaintenanceReportById
)



module.exports = router;