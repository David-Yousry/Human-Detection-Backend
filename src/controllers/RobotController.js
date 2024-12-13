const catchAsync = require("../utils/catchAsync");
const Robot = require('../models/robotModel');
const mongoose = require('mongoose');
const Detection = require('../models/detections');
const redisController = require('./redisController');

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
    redisController.incrementRobotsCount();
    

});

exports.deleteRobot = catchAsync(async (req, res, next) => {

    await Robot.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: "success",
        data: null,
    });
    redisController.decrementRobotsCount();
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
            $match: {
                detectionType: 'humanDetection'
            }
        },
        {
            $project: {
                //dividing latitude and longitude by 5 and flooring values to make range to group by
                latitudeBucket: { $floor: { $divide: ['$location.latitude', 5] } },
                longitudeBucket: { $floor: { $divide: ['$location.longitude', 5] } },
                latitude: '$location.latitude',
                longitude: '$location.longitude'
            }
        },
        {
            $group: {
                _id: { latitudeBucket: '$latitudeBucket', longitudeBucket: '$longitudeBucket' },
                count: { $sum: 1 },
                avgLatitude: { $avg: '$latitude' },
                avgLongitude: { $avg: '$longitude' }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 5
        },
        {
            $project: {
                _id: 0,
                // latitudeBucket: '$_id.latitudeBucket',
                // longitudeBucket: '$_id.longitudeBucket',
                avgLatitude: 1,
                avgLongitude: 1,
                count: 1
            }
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
        },
        {
            $limit: 5
        }
    ]).toArray();

    res.status(200).json({
        status: 'success',
        data: {
            robotBehavior,
        },
    });
});

exports.getAllDetections = catchAsync(async (req, res, next) => {
    try {
        const detections = await Detection.find();
    
        res.status(200).json({
          status: "success",
          results: detections.length,
          data: {
            detections,
          },
        });
      } catch (err) {
        res.status(404).json({
          status: "failed",
          message: err,
        });
      }
});

