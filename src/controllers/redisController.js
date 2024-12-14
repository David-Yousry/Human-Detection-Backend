const redis = require('redis');
const Robot = require('./../models/robotModel');
const Detection = require('./../models/detections');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');


const client = redis.createClient();
client.connect();


exports.initializeRedis = catchAsync(async () => {

// Event listeners for client
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});
return client;
});

exports.cachingInitialValues =  catchAsync(async () => {
    try {
        // Connect to the Redis server

  
        const robotsCount = await Robot.countDocuments();
        const humanDetectionsCount = await Detection.find({detectionType:"humanDetection"}).countDocuments();
        const obstacleDetectionsCount = await Detection.find({detectionType:"obstacleDetection"}).countDocuments();
  
        // Set a key
        await client.set('robotsCount', robotsCount);
        await client.set('humanDetectionsCount',humanDetectionsCount);
        await client.set('obstacleDetectionsCount', obstacleDetectionsCount);
        
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.incrementRobotsCount = catchAsync(async () => {
    try {
        // Connect to the Redis server

  
        // Increment the key
        await client.incr('robotsCount');
  
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.incrementHumanDetectionsCount = catchAsync(async () => {
    try {
        // Connect to the Redis server

  
        // Increment the key
        await client.incr('humanDetectionsCount');
  
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.incrementObstacleDetectionsCount = catchAsync(async () => {
    try {
        // Connect to the Redis server

  
        // Increment the key
        await client.incr('obstacleDetectionsCount');

    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.decrementRobotsCount = catchAsync(async () => {

    try {
        // Decrement the key
        await client.decr('robotsCount');
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.decrementHumanDetectionsCount = catchAsync(async () => {
    try {
        // Connect to the Redis server

  
        // Decrement the key
        await client.decr('humanDetectionsCount');
  
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.decrementObstacleDetectionsCount = catchAsync(async () => {
    try {
        // Connect to the Redis server

  
        // Decrement the key
        await client.decr('obstacleDetectionsCount');
  
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.getAllValues = async () => {
    
    try {
        // Connect to the Redis server
  
        // Get all keys
        const robotsCount = await client.get('robotsCount');
        const humanDetectionsCount = await client.get('humanDetectionsCount');
        const obstacleDetectionsCount = await client.get('obstacleDetectionsCount');
  
        return {
            robotsCount,
            humanDetectionsCount,
            obstacleDetectionsCount,
          };
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  };