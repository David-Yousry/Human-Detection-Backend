const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({

    latitude: {
        type: String,
        required: [true, 'Please enter the latitude!']
    },

    longitude: {
        type: String,
        required: [true, 'Please enter the longitude!']
    },
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


const Location = mongoose.model('Location',locationSchema);

module.exports = Location;