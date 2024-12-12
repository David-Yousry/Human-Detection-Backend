const mongoose = require('mongoose');
const locationSchema = require('./locationSchema');

const detectionsSchema = new mongoose.Schema({

    robotId: {
        type: String,
        required: [true, 'Please enter the id!']
    },

    location: {
        type: locationSchema,
        required: [true, 'Please enter the id!']
    },

    detectionTime: {
        type: String,
    },

    detectionType: {
        type: String,
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const Detection = mongoose.model('Detection', detectionsSchema);

module.exports = Detection;