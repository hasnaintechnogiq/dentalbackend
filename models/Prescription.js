const mongoose = require('mongoose');


const prescriptionSchema = mongoose.Schema({
    medicinename: String,
    morningdos: String,
    afternoon: String,
    evening: String,
    night: String,
    foodtime: String,
    medicinetype: String,
    quantity: String,
    count: Number,
    days: String,
});

module.exports = mongoose.model("prescription", prescriptionSchema);