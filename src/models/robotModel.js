const mongoose = require('mongoose');
const validator = require('validator');
const Location = require('./locationModel');


const userSchema = new mongoose.Schema({

    id: {
        type: Number,
        required: [true, 'Please enter the id!']
    },

    userName: {
        type: String,
        required: [true, 'Please enter the name!']
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



    //TODO: check if robot should have a password
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


const User = mongoose.model('User', userSchema);

module.exports = User;