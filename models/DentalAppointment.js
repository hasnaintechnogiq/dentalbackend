const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const dentalappointmentSchema = mongoose.Schema({
    gender: String,
    age: Number,
    Bookdate: String,
    BookTime: String,
    Treatment: String,
    Emergency: {
        type: String,
        default: "No"
    },
    Details: String,
    requestStatus: {
        type: String,
        default: "Pending"
    },
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentaldoctors'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalusers'
    },
    clinicID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clinic'
    },
});



module.exports = mongoose.model("dentalappointment", dentalappointmentSchema);