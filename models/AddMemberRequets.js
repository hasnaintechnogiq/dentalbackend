const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const sendrequestSchema = mongoose.Schema({
    requestStatus: {
        type: String,
        default: "Pending"
    },
    relationType: String,
    YouAre: String,
    requaesterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalusers'
    },
    accepterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalusers'
    },
});



module.exports = mongoose.model("sendrequest", sendrequestSchema);