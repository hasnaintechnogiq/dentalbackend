const mongoose = require('mongoose');


const secondaryarrayofchatsSchema = mongoose.Schema({
    chatAllID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chatdental'
    }],
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalusers'
    },
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentaldoctors'
    },
});

module.exports = mongoose.model("secondaryarrayofchats", secondaryarrayofchatsSchema);