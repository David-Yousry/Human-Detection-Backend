const mongoose = require('mongoose');

const locationSchema = require('./locationSchema');

const Location = mongoose.model('Location',locationSchema);

module.exports = Location;