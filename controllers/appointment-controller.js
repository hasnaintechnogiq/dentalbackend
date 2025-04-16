const mongoose = require('mongoose');
const DentalUser = require('../models/DentalUser.js');
const DentalDoctors = require('../models/DentalDoctors.js');
const NotificationArray = require('../models/NotificationArray.js');
const DentalAppointment = require('../models/DentalAppointment.js');
const Clinic = require('../models/Clinic.js');
const OldTreatmentHistory = require('../models/OldTreatmentHistory.js');
const Prescription = require('../models/Prescription.js');







const addAppointmentFunction = async (req, res) => {
    try {

        const newDocument = new DentalAppointment(req.body);
        const result = await newDocument.save();


        const doctorIDnew = new mongoose.Types.ObjectId(req.body.doctorID);
        const userIDnew = new mongoose.Types.ObjectId(req.body.userID);
        const appointmentIDnew = new mongoose.Types.ObjectId(newDocument.id);


        await DentalUser.updateOne(
            { _id: userIDnew },
            {
                $push: {
                    appointmentID: appointmentIDnew
                }
            }
        )

        await DentalDoctors.updateOne(
            { _id: doctorIDnew },
            {
                $push: {
                    appointmentID: appointmentIDnew
                }
            }
        )

        let single = await DentalDoctors.findById(req.body.doctorID)

        single.NotificationNewAppoint = "Unseen";
        await single.save();





        res.send(result);

    } catch (err) {
        res.status(500).json(err);
    }
};





const addAppointmentWithoutUser = async (req, res) => {
    try {

        const newDocument = new DentalAppointment(req.body);
        const result = await newDocument.save();


        const doctorIDnew = new mongoose.Types.ObjectId(req.body.doctorID);

        const appointmentIDnew = new mongoose.Types.ObjectId(newDocument.id);

        await DentalDoctors.updateOne(
            { _id: doctorIDnew },
            {
                $push: {
                    appointmentID: appointmentIDnew
                }
            }
        )
        res.send(result);

    } catch (err) {
        res.status(500).json(err);
    }
};



const findAllAppointofUserByID = async (req, resp) => {
    try {
        let single = await DentalUser.findById(req.params._id).populate({
            path: 'appointmentID',
            populate: [
                { path: 'userID', model: 'dentalusers' },
                { path: 'doctorID', model: 'dentaldoctors' },
                { path: 'clinicID', model: 'clinic' }
            ]
        });
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};


const findAllAppointofDoctorByID = async (req, resp) => {
    try {
        let single = await DentalDoctors.findById(req.params._id).populate({
            path: 'appointmentID',
            populate: [
                { path: 'userID', model: 'dentalusers' },
                { path: 'doctorID', model: 'dentaldoctors' },
                { path: 'clinicID', model: 'clinic' },
                { path: 'ratingID', model: 'ratingCounter' }
            ]
        }).populate("oldtreatmenthistoryID");
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};


const getSingleAppointmwntWithDetails = async (req, res) => {
    try {
        let single = await DentalAppointment.findById(req.params._id).populate("doctorID").populate("userID").populate("documentsformPatientsID").populate("documentsformDocotorID").populate("clinicID").populate("ratingID").populate("prescriptionID");
        res.send(single);
    } catch (err) {
        res.status(500).json(err);
    }
};



const updateAppointmentDetails = async (req, res) => {
    try {
        console.log(req.params)
        let data = await DentalAppointment.updateOne(
            req.params,
            { $set: req.body }
        );
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};


const findOneOldTreatmentByID = async (req, resp) => {
    try {
        let single = await OldTreatmentHistory.findById(req.params._id);
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};



const addnoePrescription = async (req, resp) => {
    try {

        let single = await DentalAppointment.findById(req.body.appointmentID);
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhh', single)

        single.advice = req.body.advice;

        single.note = req.body.note;
        await single.save();

        async function SpriscriptinfunCall() {
            for (let i = 0; i < req.body.valuable.length; i++) {
                try {
                    const newDatanewtask = new Prescription(req.body.valuable[i]);
                    const savedData = await newDatanewtask.save();

                    let objID = new mongoose.Types.ObjectId(newDatanewtask.id)
                    let newss = new mongoose.Types.ObjectId(req.body.appointmentID)
                    console.log(objID);
                    await DentalAppointment.updateOne(
                        { _id: newss },
                        {
                            $push: {
                                prescriptionID: objID
                            }
                        }
                    )
                    console.log('Data saved:', savedData);
                } catch (error) {
                    console.error('Error saving data:', error);
                }
            }
        }
        SpriscriptinfunCall();

        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};






module.exports = {addnoePrescription, findOneOldTreatmentByID, updateAppointmentDetails, addAppointmentFunction, addAppointmentWithoutUser, findAllAppointofUserByID, findAllAppointofDoctorByID, getSingleAppointmwntWithDetails };