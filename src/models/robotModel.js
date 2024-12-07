const mongoose = require('mongoose');
const validator = require('validator');
const Location = require('./locationModel');
const bcrypt = require('bcryptjs');

const robotSchema = new mongoose.Schema({

    id: {
        type: Number,
        //required: [true, 'Please enter the id!']
    },

    username: {
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

robotSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});



const Robot = mongoose.model('Robot', robotSchema);

module.exports = Robot;