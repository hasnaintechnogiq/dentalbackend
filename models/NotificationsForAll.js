const mongoose = require('mongoose');
const notificationsforallSchema = mongoose.Schema({
    pathtoredirect: String,
    notificationtypeorsection: String,
    iconname: String,
    ndate: { type: Date, default: Date.now },
    idtogetdata: String,
    seenstatus: {
        type: String,
        default: "Unseen"
    },
    param2orlocationname: String,
    param2userID: String,
});

module.exports = mongoose.model("notificationsforall", notificationsforallSchema);