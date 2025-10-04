const mongoose = require('mongoose');
const DentalUser = require('../models/DentalUser.js');
const DentalDoctors = require('../models/DentalDoctors.js');
const NotificationArray = require('../models/NotificationArray.js');
const DentalAppointment = require('../models/DentalAppointment.js');
const Clinic = require('../models/Clinic.js');
const OldTreatmentHistory = require('../models/OldTreatmentHistory.js');
const Staffs = require('../models/Staffs.js');









// const addStaffFunction = async (req, res) => {
//     console.log(req.body)
//     try {

//         const newDocument = new Staffs(req.body);
//         const result = await newDocument.save();

//         const doctorIDnew = new mongoose.Types.ObjectId(req.body.doctorID);
//         const appointmentIDnew = new mongoose.Types.ObjectId(newDocument.id);

//         await DentalDoctors.updateOne(
//             { _id: doctorIDnew },
//             {
//                 $push: {
//                     staffIDs: appointmentIDnew
//                 }
//             }
//         )
//         res.send(result);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

const addStaffFunction = async (req, res) => {
    console.log('req body', req.body)
    console.log('req file', req.file)
    try {
        const { body, file } = req;

        const profileImageUrl = file
            ? `${req.protocol}://${req.get('host')}/upload/${file.filename}`
            : null;

        const newStaffData = {
            ...body,
            ...(profileImageUrl && { profile_url: profileImageUrl }),
        };

        const newDocument = new Staffs(newStaffData);
        const result = await newDocument.save();

        const doctorIDnew = new mongoose.Types.ObjectId(body.doctorID);
        const staffIDnew = new mongoose.Types.ObjectId(result._id);

        await DentalDoctors.updateOne(
            { _id: doctorIDnew },
            { $push: { staffIDs: staffIDnew } }
        );

        res.status(201).json(result);
    } catch (error) {
        console.error('Error in addNewStaff:', error);
        res.status(500).json({ error: 'Failed to add new staff' });
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

// const updateStaffFunction = async (req, res) => {
//     try {
//         const staffId = req.params._id;
//         const updatedData = req.body;
        
//         const result = await Staffs.findByIdAndUpdate(
//             staffId,
//             { $set: updatedData },
//             { new: true }
//         ).populate("clinicID");

//         if (!result) {
//             return res.status(404).json({ message: "Staff not found" });
//         }

//         res.send(result);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };
const updateStaffFunction = async (req, res) => {
    try {
        const staffId = req.params._id;
        const { body, file } = req;

        // Construct new image URL if a file was uploaded
        const profileImageUrl = file
            ? `${req.protocol}://${req.get('host')}/upload/${file.filename}`
            : null;

        // Prepare updated data
        const updatedData = {
            ...body,
            ...(profileImageUrl && { profile_url: profileImageUrl }),
        };

        const result = await Staffs.findByIdAndUpdate(
            staffId,
            { $set: updatedData },
            { new: true }
        ).populate('clinicID');

        if (!result) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        res.send(result);
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ error: 'Failed to update staff' });
    }
};
module.exports = { addStaffFunction, findAllStaffofDoctorByID, findOneStaffByID, updateStaffFunction };