const MaintenanceReport = require('../models/maintenanceReportModel');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Job = require("../models/jobModel");

exports.createMaintenanceReport = catchAsync(async (req, res, next) => {

    const job = await Job.findById(req.params.jobId);
    if (!job) {
        return next(new AppError('Job not found!', 404));
    }



    const maintenanceReport = await MaintenanceReport.create({
        // job: req.body.jobId,
        maintenanceDate: req.body.maintenanceDate,
        details: req.body.details
    });

    job.maintenanceReport = (maintenanceReport._id);
    await job.save();

    res.status(201).json({
        status: 'success',
        data: { maintenanceReport },
    });
});

exports.getAllMaintenanceReports = catchAsync(async (req, res, next) => {
    const maintenanceReports = await MaintenanceReport.find();

    if (maintenanceReports.length === 0) {
        return next(new AppError('No maintenance reports found!', 404));
    }

    res.status(200).json({
        status: 'success',
        results: maintenanceReports.length,
        data: { maintenanceReports },
    });
});

exports.getMaintenanceReportByJobId = catchAsync(async (req, res, next) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
        return next(new AppError('Maintenance report not found!', 404));
    }
    const maintenanceReport = await MaintenanceReport.findById(job.maintenanceReport);

    res.status(200).json({
        status: 'success',
        data: { maintenanceReport },
    });
});
