const mongoose = require('mongoose');
const Job = require('./jobModel');

const maintenanceReportSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'Please provide the report ID!']
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'please provide the job!']
    },
    robotID: {
        type: Number,
        required: [true, 'please provide the robot Id!']
    },
    maintenanceDate: {
        type: Date,
        required: [true, 'please provide the maintenance date!']
    },
    maintenanceType: {
        type: String,
        enum: ['BatteryReplacement', "maintenance"],
        required: [true, 'please specify the maintenance type!']
    },
    technicianID: {
        type: Number,
        required: [true, 'please provide the technician Id!']
    },
    details: {
        type: String,
        required: false
    },
});
const MaintenanceReport = mongoose.model('MaintenanceReport', maintenanceReportSchema);
module.exports = MaintenanceReport;