const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const dentaldoctorsSchema = mongoose.Schema({
    drname: String,
    designation: String,
    biography: String,
    yearsofexperience: Number,
    patientchecked: Number,
    drnumber: Number,
    dremail: String,
    drcity: String,
    drdistrict: String,
    drstate: String,
    drpassword: String,
    fcmToken: String,
    drotp: String,
    profile_url: String,
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
    oldtreatmenthistoryID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'oldtreatmenthistory'
    }],
    clinicID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clinic'
    }],
    chatArrayID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'secondaryarrayofchats'
    }],
    ratingIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ratingCounter'
    }],
    staffIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staffs'
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