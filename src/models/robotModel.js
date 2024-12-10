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
//TODO
// const robotNotifies = catchAsync(async () => {
//   const event1 = await Event.create({
//     id: 1,
//     robotID: 1,
//     eventType: "lowBattery"
//   })

//   const robotNotification1 = RobotNotification.create({
//     event: event1,
//     status: 'status1',
//     observerID: 1
//   })
// }
// )

// robotNotifies();

const Robot = mongoose.model('Robot', robotSchema);

module.exports = Robot;