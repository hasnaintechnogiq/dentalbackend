const mongoose = require('mongoose');
const notificationarraySchema = mongoose.Schema({
    notificationsforallID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notificationsforall'
    }],
    role: String,
});

module.exports = mongoose.model("notificationarray", notificationarraySchema);