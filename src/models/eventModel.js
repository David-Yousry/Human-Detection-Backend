const mongoose = require('mongoose');
const Location = require('./locationModel');

const eventSchema = new mongoose.Schema({

    id:{
        type: Number,
        required: [true, 'Please enter the id!']
    },
    robotID:{
        type: Number,
        required: [true, 'Please enter the robot id!']
    },
    eventType:{
        type: String,
        enum: ['human Detected', 'lowBattery', 'maintenance'],
    },
    eventTime:{
        type: Date,
        default: Date.now(),
    },
    location:{
        type: Location,
        required: [true, 'Please enter the location!']
    },



},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


const Event = mongoose.model('Event',eventSchema);

module.exports = Event;