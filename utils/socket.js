// const { Server } = require("socket.io");
// const Notification = require('../models/Notification');

// const io = new Server({
//     cors : {
//         origin: "http://localhost:5000",
//         credentials: true
//     }
// });

// function createNotification(userId, text) {
//     const newNotification = new Notification({
//         userId,
//         text,
//         date: new Date(),
//         read: false
//     });
//     newNotification.save().then(() => {
//         io.to(userId).emit('newNotification', newNotification);
//     }).catch(err => console.error("Failed to save notification", err));
// }

// module.exports = {createNotification, io};