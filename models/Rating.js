const mongoose = require('mongoose');


const ratingCounterSchema = mongoose.Schema({
    ratingCount: Number,
    RateTime: { type: Date, default: Date.now },
    DiscriptionAppare: {
        type: String,
        default: "UnseenAndUncheckedTo"
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentalusers'
    },
});

module.exports = mongoose.model("ratingCounter", ratingCounterSchema);