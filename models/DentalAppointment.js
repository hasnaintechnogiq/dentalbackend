const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const dentalappointmentSchema = mongoose.Schema({
    gender: String,
    age: Number,
    Bookdate: String,
    BookTime: String,
    Treatment: String,
    Details: String,
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentaldoctors'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalusers'
    },

});



module.exports = mongoose.model("dentalappointment", dentalappointmentSchema);