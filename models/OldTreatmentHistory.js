const mongoose = require('mongoose');


const oldtreatmenthistorySchema = mongoose.Schema({
    Gender: String,
    Age: Number,
    Email: String,
    Phone: String,
    Patient: String,
    Treatment: String,
    Details: String,
    Weight: String,
    Clinic: String,
});


module.exports = mongoose.model("oldtreatmenthistory", oldtreatmenthistorySchema);