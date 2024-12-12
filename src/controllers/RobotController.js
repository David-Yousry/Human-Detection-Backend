const catchAsync = require("../utils/catchAsync");
const Robot = require('../models/robotModel');
const mongoose = require('mongoose');

exports.getAllRobots = catchAsync(async (req, res, next) => {
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
});

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


//dashboard
//1. pie chart
exports.getEventTypeAnalysis = catchAsync(async (req, res, next) => {
    const events = await mongoose.connection.collection('detections').aggregate([
        { $group: { _id: '$detectionType', count: { $sum: 1 } } }
    ]).toArray();

    res.status(200).json({
        status: 'success',
        data: events,
    });
});
//2. multi axis line chart(2 line charts each represents the analysis dependent on the event type)
//alt: column chart
exports.getRecentEventsAnalysis = catchAsync(async (req, res, next) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentEvents = await mongoose.connection.collection('detections')
        .find({
            detectionTime: { $gte: oneDayAgo }
        }).toArray();

    const recentEventCount = recentEvents.length;

    res.status(200).json({
        status: 'success',
        data: {
            count: recentEventCount,
            events: recentEvents
        },
    });
});
//3. horizontal bar Chart
exports.topFiveFrequentLocations = catchAsync(async (req, res, next) => {
    const frequentLocations = await mongoose.connection.collection('detections').aggregate([
        {
            $match: { detectionType: 'humanDetection' }
        },
        {
            $group: {
                _id: { latitude: '$location.latitude', longitude: '$location.longitude' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 5
        }
    ]).toArray();

    res.status(200).json({
        status: 'success',
        data: {
            locations: frequentLocations
        },
    });
});
//4. bar or column chart
exports.RobotBehaviorRanks = catchAsync(async (req, res, next) => {
    const robotBehavior = await mongoose.connection.collection('detections').aggregate([
        {
            $group: {
                _id: '$robotId',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]).toArray();

    res.status(200).json({
        status: 'success',
        data: {
            robotBehavior,
        },
    });
});

