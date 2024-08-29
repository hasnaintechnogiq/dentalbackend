const mongoose = require('mongoose');

const dentalappointmentSchema = mongoose.Schema({
    gender: String,
    age: Number,
    Bookdate: String,
    BookTime: String,
    patientName: String,
    imgarryforUser: Array,
    imgarryforDoctor: Array,
    Treatmentfor: String,
    ProblemDetails: String,
    Plan: String,
    Bloodpressure: String,
    diabetes: String,
    Weight: Number,
    PayStatus: {
        type: String,
        default: "Pending"
    },
    PayAmount: {
        type: Number,
        default: 0
    },
    PayType: {
        type: String,
        default: "Online"
    },
    secondarychatArrayID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'secondaryarrayofchats'
    },
    Bookingfor: {
        type: String,
        default: "Self"
    },
    remindMe: {
        type: String,
        default: "No"
    },
    Emergency: {
        type: String,
        default: "No"
    },
    requestStatus: {
        type: String,
        default: "Pending"
    },
    checkInStatus: {
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
    ratingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ratingCounter'
    },
    documentsformDocotorID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DocumentPDF'
    }],
    documentsformPatientsID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DocumentPDF'
    }]
});


module.exports = mongoose.model("dentalappointment", dentalappointmentSchema);