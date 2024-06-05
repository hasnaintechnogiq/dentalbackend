const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const clinicSchema = mongoose.Schema({
    clinicname: String,
    clinicAddress: String,
    openTime: String,
    closeTime: String,
    Details: String,
    latitude: Number,
    longitude: Number,
    imgarry: Array,
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentaldoctors'
    }

});

module.exports = mongoose.model("clinic", clinicSchema);