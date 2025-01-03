const mongoose = require('mongoose');
const validator = require('validator');
const locationSchema = require('./locationSchema');

const robotSchema = new mongoose.Schema({

    id: {
        type: String,
        unique: true,
        required: [true, 'Please enter the id!']
    },

    location: {
        type: locationSchema,
        default: null,
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const Robot = mongoose.model('Robot', robotSchema);

module.exports = Robot;