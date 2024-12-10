const mongoose = require('mongoose');
const Location = require('./locationModel');

const jobSchema = new mongoose.Schema({

    id: {
        type: Number,
        required: [true, 'Please enter the id!']
    },
    jobDescription: {
        type: String,
        required: [true, 'Please enter the job description!']
    },
    technicianID: {
        type: Number,
        required: [true, 'Please enter the technician id!']
    },
    robotID: {
        type: Number,
        required: [true, 'Please enter the robot id!']
    },
    startTime: {
        type: Date,
        default: Date.now(),
    },
    endTime: {
        type: Date,
        default: Date.now(),
    },
    status: {
        type: String,
        enum: ['active', 'inActive', 'completed'],
        default: 'inActive'
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    maintenanceReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceReport'
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


const Job = mongoose.model('Job', jobSchema);

module.exports = Job;