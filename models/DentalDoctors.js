const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const dentaldoctorsSchema = mongoose.Schema({
    drname: String,
    drnumber: Number,
    dremail: String,
    drcity: String,
    drdistrict: String,
    drstate: String,
    drpassword: String,
    fcmToken: String,
    drotp: String,
    status: {
        type: String,
        default: "login"
    },
    role: {
        type: String,
        default: "Doctor"
    },
    notificationarrayID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notificationarray'
    },
    appointmentID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalappointment'
    }],
    clinicID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clinic'
    }],
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
});



module.exports = mongoose.model("dentaldoctors", dentaldoctorsSchema);