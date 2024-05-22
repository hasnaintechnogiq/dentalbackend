const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const clinicSchema = mongoose.Schema({
    clinicname : String,
    clinicaddress : Number,
    openTime: String,
    closeTime: String,
    Details: String,
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentaldoctors'
    }

});



module.exports = mongoose.model("clinic", clinicSchema);