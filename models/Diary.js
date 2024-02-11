const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require("./user");

const DiarySchema = new Schema({
    year: { type: Number, required: true, default: new Date().getFullYear },
    user: { type: Schema.Types.ObjectId, ref: 'User'}
    //monthlySheets: [MonthlySheet],
    //monthlySheets: [{type: Schema.Types.ObjectId, ref: 'MonthlySheet'}]
},
{
   timestamps: {
    createdAt: 'createdOn',
    updatedAt: 'lastUpdated'
    }
});
const Diary = mongoose.model('Diary', DiarySchema);
module.exports = Diary;

