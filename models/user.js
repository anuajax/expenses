const mongoose = require('mongoose');
const {Schema} = mongoose;
const userModel = new Schema({

    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
   // age: { type: String, required: true, min: [13, 'Age must be more than 12 years']},
    tel: { type: String },
    resetPasswordToken: String,
    resetPasswordExpiration: Date
    // kharcha: [ { type: Schema.Types.ObjectId, ref: 'Kharcha' } ]
});
const User = mongoose.model('User', userModel);
module.exports = User;
    