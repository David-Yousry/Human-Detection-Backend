const redis = require('redis');
const Robot = require('./../models/robotModel');
const Detection = require('./../models/detections');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');


const client = redis.createClient();



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
    const client = redis.createClient();
    try {
        // Connect to the Redis server
        await client.connect();
  
        const robotsCount = await Robot.countDocuments();
        const humanDetectionsCount = await Detection.find({detectionType:"humanDetection"}).countDocuments();
        const obstacleDetectionsCount = await Detection.find({detectionType:"obstacleDetection"}).countDocuments();
  
        // Set a key
        await client.set('robotsCount', robotsCount);
        await client.set('humanDetectionsCount',humanDetectionsCount);
        await client.set('obstacleDetectionsCount', obstacleDetectionsCount);
        
  
        // Disconnect the client
        console.log('Redis client disconnected');
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.incrementRobotsCount = catchAsync(async () => {
    const client = redis.createClient();
    try {
        // Connect to the Redis server
        await client.connect();
  
        // Increment the key
        await client.incr('robotsCount');
  
        // Disconnect the client
        await client.disconnect();
        console.log('Redis client disconnected');
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.incrementHumanDetectionsCount = catchAsync(async () => {
    const client = redis.createClient();
    try {
        // Connect to the Redis server
        await client.connect();
  
        // Increment the key
        await client.incr('humanDetectionsCount');
  
        // Disconnect the client
        await client.disconnect();
        console.log('Redis client disconnected');
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.incrementObstacleDetectionsCount = catchAsync(async () => {
    const client = redis.createClient();
    try {
        // Connect to the Redis server
        await client.connect();
  
        // Increment the key
        await client.incr('obstacleDetectionsCount');
  
        // Disconnect the client
        await client.disconnect();
        console.log('Redis client disconnected');
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.decrementRobotsCount = catchAsync(async () => {

    const client = redis.createClient();
    try {
        // Connect to the Redis server
        await client.connect();
  
        // Decrement the key
        await client.decr('robotsCount');
  
        // Disconnect the client
        console.log('Redis client disconnected');
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.decrementHumanDetectionsCount = catchAsync(async () => {
    const client = redis.createClient();
    try {
        // Connect to the Redis server
        await client.connect();
  
        // Decrement the key
        await client.decr('humanDetectionsCount');
  
        // Disconnect the client
        await client.disconnect();
        console.log('Redis client disconnected');
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);

exports.decrementObstacleDetectionsCount = catchAsync(async () => {
    const client = redis.createClient();
    try {
        // Connect to the Redis server
        await client.connect();
  
        // Decrement the key
        await client.decr('obstacleDetectionsCount');
  
        // Disconnect the client
        await client.disconnect();
        console.log('Redis client disconnected');
    } catch (err) {
        console.error('Error in Redis operations:', err);
    }
  }
);