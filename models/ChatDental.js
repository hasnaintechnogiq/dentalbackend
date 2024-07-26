const mongoose = require('mongoose');


const chatdentalSchema = mongoose.Schema({
    textdiscription: String,
    chatTime: { type: Date, default: Date.now },
    seenStatus: {
        type: String,
        default: "Unseen"
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalusers'
    },
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentaldoctors'
    },
    senderID: String,

});

module.exports = mongoose.model("chatdental", chatdentalSchema);