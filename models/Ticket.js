const mongoose = require('mongoose');

const ticketschema = mongoose.Schema({
    heading: String,
    description: String,
    status: {
        type: String,
        default: "Pending"
    },
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentaldoctors'
    },
    date: { type: Date, default: Date.now },

});

module.exports = mongoose.model("tickets", ticketschema);