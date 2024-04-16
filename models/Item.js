const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require("./user");

function defaultDate()
{
    return new Date(Date.now()).toLocaleDateString('en-IN');
    //return new Date();
}

const ItemSchema = new Schema ({
    name: { type: String, required: true },
    amount: { type: Number, required: true, default: 0, min: 0 },
    date: { type: String, default: defaultDate},
    type: { type: Boolean, required: true},
    user: { type: Schema.Types.ObjectId, ref: 'User'}
});
const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
module.exports.ItemSchema=ItemSchema;


