const mqtt = require('mqtt');
const User = require("../models/userModel");
const catchAsync = require("./catchAsync");

const clientMqtt = mqtt.connect('mqtt://localhost:1883'); // Connect to Mosquitto

const topic = 'device/data';
const robotCountTopic = 'device/robotCount';
const techsTopic = 'device/technicians';

// when connection is established
clientMqtt.on('connect', () => {
  console.log('Connected to MQTT broker');
});


const getTechnicians = catchAsync(async () => {
  // select the id only of all technicians
  //TODO: when the id was returned twice sometimes this was because of the virtuals
  const techs = await User.find({role: "technician"}, { _id: 1 } ).lean(); // .lean() to convert to plain JS object to disable the virtuals to not return _id twice
  
  console.log(techs);
  clientMqtt.publish(techsTopic, JSON.stringify(techs)); 
});

getTechnicians();
// publish technicians to the simulation
// clientMqtt.publish(robotCountTopic, '3');



clientMqtt.subscribe(topic, (err) => {

});

clientMqtt.subscribe('hi', (err) => {
});



// when a message is received
clientMqtt.on('message', (topic, message) => {
  console.log(`Received message from ${topic}:`, message.toString());
  // testRedis(message.toString());
  // Process message and save to Redis/MongoDB here
});