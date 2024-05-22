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
    status: {
        type: String,
        default: "login"
    },
    appointmentID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalappointment'
    }],
    role: {
        type: String,
        default: "user"
    },
    notificationarrayID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notificationarray'
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
});




module.exports = mongoose.model("dentalusers", dentalusersSchema);