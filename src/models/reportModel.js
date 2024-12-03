const mongoose = require('mongoose');


const reportSchema = new mongoose.Schema({

     //TODO: check if we need a report class or no



},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


const Report = mongoose.model('Report',reportSchema);

module.exports = Report;