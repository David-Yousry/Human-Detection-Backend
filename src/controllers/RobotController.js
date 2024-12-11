const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Robot = require('../models/robotModel');

exports.getAllRobots = async (req, res, next) => {
    try {
        const robots = await Robot.find();

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: robots.length,
            data: {
                robots,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "failed",
            message: err,
        });
    }
};

exports.createRobot = catchAsync(async (req, res, next) => {
    const newRobot = await Robot.create({
        id: req.body.id
    });

    res.status(201).json({
        status: "success",
        data: {
            robot: newRobot,
        },

    });
});

exports.deleteRobot = catchAsync(async (req, res, next) => {

    await Robot.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: "success",
        data: null,
    });
});



