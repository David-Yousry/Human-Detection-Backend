const mqtt = require('mqtt');
const redisController = require('../controllers/redisController');
// const User = require("../models/userModel");
const catchAsync = require("./catchAsync");

const clientMqtt = mqtt.connect('mqtt://localhost:1883'); // Connect to Mosquitto

const detectionTopic = 'device/Detection';

// when connection is established
clientMqtt.on('connect', () => {
  console.log('Connected to MQTT broker');
});


clientMqtt.subscribe(detectionTopic, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Subscribed to ${detectionTopic}`);
});




clientMqtt.on('message', (topic, message) => {
  if(topic === detectionTopic){
    console.log(`Received message from ${topic}: ${message.toString()}`);
    if(message.toString().substring(19,20) === "h"){
      redisController.incrementHumanDetectionsCount();
    }
    else{
      redisController.incrementObstacleDetectionsCount();
    }
  }
});