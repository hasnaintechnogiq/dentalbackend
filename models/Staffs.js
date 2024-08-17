const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const staffsSchema = mongoose.Schema({
    name: String,
    number: Number,
    email: {
        type: String,
        maxlength: 1024,
        required: [true, "Please provide an email"],
        unique: [true, "email already exists"],
    },
    city: String,
    age: String,
    gender: String,
    state: String,
    password: String,
    otp: String,
    fcmToken: String,
    profile_url: String,
    checkInTime: String,
    checkOutTime: String,
    assignAs: {
        type: String,
        default: "Receptionist"
    },
    CanAcceptAppointment: {
        type: String,
        default: "No"
    },
    CanAddAppointment: {
        type: String,
        default: "No"
    },
    CanUpdateRecivedPaymentAppointment: {
        type: String,
        default: "No"
    },
    CanSendTickets: {
        type: String,
        default: "No"
    },
    status: {
        type: String,
        default: "login"
    },
    role: {
        type: String,
        default: "staff"
    },
    clinicID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clinic'
    },
    notificationarrayID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notificationarray'
    },
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentaldoctors'
    },
    chatArrayID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'secondaryarrayofchats'
    }],
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
});




module.exports = mongoose.model("staffs", staffsSchema);