const mongoose = require('mongoose');
const User = require('./user');
const {ItemSchema} = require('./Item');
const {Schema} = mongoose;
const TaskSchema = new Schema ({
   startDate: Date,
    recurrence: {
        frequency: { type: String, enum: ['Minute', 'Day', 'Month', 'Week', 'Year'], required: true},
        interval: {type: Number, default: 1},
        month: {type: Number, default: 1},
        dayOfWeek: {type: [Number], default: 1},
        dayOfMonth: {type: Number, default: 1},
    },
    nextRun : {type: Date , default: new Date().toLocaleDateString('en-IN')},
    taskDetails: {type: ItemSchema, default: {}},
    user: { type: Schema.Types.ObjectId, ref: 'User'}
})
const Task = mongoose.model('Task', TaskSchema);
module.exports=Task; 