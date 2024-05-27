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
            populate: {
                path: 'doctorID',
                model: 'dentaldoctors'
            }
        })
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};


const findAllAppointofDoctorByID = async (req, resp) => {
    try {
        let single = await DentalDoctors.findById(req.params._id).populate({
            path: 'appointmentID',
            populate: {
                path: 'userID',
                model: 'dentalusers'
            }
        })
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};


const getSingleAppointmwntWithDetails = async (req, res) => {
    try {
        let single = await DentalAppointment.findById(req.params._id).populate("doctorID").populate("userID");
        res.send(single);
    } catch (err) {
        res.status(500).json(err);
    }
};











module.exports = { addAppointmentFunction, findAllAppointofUserByID, findAllAppointofDoctorByID, getSingleAppointmwntWithDetails};