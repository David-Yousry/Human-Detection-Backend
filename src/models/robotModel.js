const mongoose = require('mongoose');
const validator = require('validator');

const robotSchema = new mongoose.Schema({

    id: {
        type: Number,
        required: [true, 'Please enter the id!']
    },

    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },

    batteryLevel: {
        type: Number,
        default: 100,
    },

    status: {
        type: String,
        enum: ['active', 'inActive', 'lowBattery', 'maintenance'],
        default: 'active'
    },

    lastMaintenanceDate: {
        type: Date,
        default: Date.now(),
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const Robot = mongoose.model('Robot', robotSchema);

module.exports = Robot;