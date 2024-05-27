const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const clinicSchema = mongoose.Schema({
    clinicname: String,
    cliniccity: String,
    clinicstate: String,
    openTime: String,
    closeTime: String,
    Details: String,
    imgarry: Array,
    doctorID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentaldoctors'
    }]

});



module.exports = mongoose.model("clinic", clinicSchema);