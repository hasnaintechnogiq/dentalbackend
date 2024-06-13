const mongoose = require('mongoose');
const DentalUser = require('../models/DentalUser.js');
const DentalDoctors = require('../models/DentalDoctors.js');
const NotificationArray = require('../models/NotificationArray.js');
const DentalAppointment = require('../models/DentalAppointment.js');
const Clinic = require('../models/Clinic.js');


var nodemailer = require('nodemailer');





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
                { path: 'clinicID', model: 'clinic' }
            ]
        });
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};


const getSingleAppointmwntWithDetails = async (req, res) => {
    try {
        let single = await DentalAppointment.findById(req.params._id).populate("doctorID").populate("userID").populate("documentsformPatientsID").populate("documentsformDocotorID").populate("clinicID");
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







module.exports = { updateAppointmentDetails, addAppointmentFunction, findAllAppointofUserByID, findAllAppointofDoctorByID, getSingleAppointmwntWithDetails};