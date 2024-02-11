const mongoose = require('mongoose');
const ExpenseItem = require('./Item');
const { Schema } = mongoose;
const MonthlySheetSchema = new Schema ({

    month: {
             type: String,
             required: true,
             enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 
             'October', 'November', 'December']
           },
    year: {
        type: Number,
        required: true
    },
    //entries: [ExpenseItem]
    entries: [{ type: Schema.Types.ObjectId, ref: 'ExpenseItem'}]
});
const MonthlySheet = mongoose.model('MonthlySheet', MonthlySheetSchema);
module.exports = MonthlySheet;