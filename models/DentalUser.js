const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const dentalusersSchema = mongoose.Schema({
    name: String,
    number: Number,
    email: {
        type: String,
        maxlength: 1024,
        required: [true, "Please provide an email"],
        unique: [true, "email already exists"],
      },
    city: String,
    state: String,
    password: String,
    otp: String,
    fcmToken: String,
    profile_url: String,
    status: {
        type: String,
        default: "login"
    },
    appointmentID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalappointment'
    }],
    sendrequestID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sendrequest'
    }],
    role: {
        type: String,
        default: "user"
    },
    notificationarrayID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notificationarray'
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




module.exports = mongoose.model("dentalusers", dentalusersSchema);