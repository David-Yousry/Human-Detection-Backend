const mongoose = require('mongoose');
const Job = require('./jobModel');

const maintenanceReportSchema = new mongoose.Schema({
    maintenanceDate: {
        type: Date,
        required: [true, 'please provide the maintenance date!']
    },
    details: {
        type: String,
        required: false
    },
});
const MaintenanceReport = mongoose.model('MaintenanceReport', maintenanceReportSchema);
module.exports = MaintenanceReport;