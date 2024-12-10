const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({

    latitude: {
        type: Number,
        required: [true, 'Please enter the latitude!']
    },

    longitude: {
        type: Number,
        required: [true, 'Please enter the longitude!']
    },
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

exports.locationSchema;