const mongoose = require('mongoose');
const validator = require('validator');
const locationSchema = require('./locationSchema');

const robotSchema = new mongoose.Schema({

    id: {
        type: String,
        required: [true, 'Please enter the id!']
    },

    location: {
        type: locationSchema,
        default: null,
    },

    isMalfunctioned: {
        type: Boolean,
        default: false,
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const Robot = mongoose.model('Robot', robotSchema);

module.exports = Robot;