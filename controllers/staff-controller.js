const mongoose = require('mongoose');
const DentalUser = require('../models/DentalUser.js');
const DentalDoctors = require('../models/DentalDoctors.js');
const NotificationArray = require('../models/NotificationArray.js');
const DentalAppointment = require('../models/DentalAppointment.js');
const Clinic = require('../models/Clinic.js');
const OldTreatmentHistory = require('../models/OldTreatmentHistory.js');
const Staffs = require('../models/Staffs.js');









const addStaffFunction = async (req, res) => {
    console.log(req.body)
    try {

        const newDocument = new Staffs(req.body);
        const result = await newDocument.save();

        const doctorIDnew = new mongoose.Types.ObjectId(req.body.doctorID);
        const appointmentIDnew = new mongoose.Types.ObjectId(newDocument.id);

        await DentalDoctors.updateOne(
            { _id: doctorIDnew },
            {
                $push: {
                    staffIDs: appointmentIDnew
                }
            }
        )
        res.send(result);

    } catch (err) {
        res.status(500).json(err);
    }
};






const findAllStaffofDoctorByID = async (req, resp) => {
    try {
        let single = await DentalDoctors.findById(req.params._id).populate({
            path: 'staffIDs',
            populate: [
                { path: 'clinicID', model: 'clinic' }
            ]
        });
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};





const findOneStaffByID = async (req, resp) => {
    try {
        let single = await Staffs.findById(req.params._id).populate("clinicID");
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};



module.exports = { addStaffFunction, findAllStaffofDoctorByID, findOneStaffByID };