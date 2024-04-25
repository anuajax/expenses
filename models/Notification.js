const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    date: {type: Date, default: Date.now},
    read: { type: Boolean, default: false }
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;