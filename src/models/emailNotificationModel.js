const mongoose = require('mongoose');

const emailNotificationSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'Please provide the email Id!']
    },
    sentTime: {
        type: String,
        required: [true, 'please provide the sent time!']
    },
    senderEmail: {
        type: String,
        required: [true, 'please provide the sender email!']
    },
    recipientEmail: {
        type: String,
        required: [true, 'please provide the recipient email!']
    },
    senderID: {
        type: String,
        required: false
    },
    recipientID: {
        type: String,
        required: false
    },
    emailContent: {
        type: String,
        required: [true, 'please provide the email content!']
    },
});

const EmailNotification = mongoose.model('EmailNotification', emailNotificationSchema);
module.exports = EmailNotification;