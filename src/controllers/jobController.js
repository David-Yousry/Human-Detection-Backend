const Job = require("../models/jobModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


exports.getAllJobs = catchAsync(async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({
            status: 'success',
            results: jobs.length,
            data: { jobs },
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
});