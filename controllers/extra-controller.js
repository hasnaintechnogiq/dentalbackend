const mongoose = require('mongoose');
const DentalUser = require('../models/DentalUser.js');
const DentalDoctors = require('../models/DentalDoctors.js');
const Rating = require('../models/Rating.js');
const DentalAppointment = require('../models/DentalAppointment.js');




const createArrayforRating = async (req, res) => {
    try {
        let single = await DentalAppointment.findById(req.body.appointmentID);

        if (!single) {
            return res.status(404).json({ error: 'DentalAppointment not found' });
        }

        const newDocument = new Rating(req.body);
        const resultfirst = await newDocument.save();


        const doctorIDnew = single.doctorID;

        const appointmentIDnew = new mongoose.Types.ObjectId(newDocument.id);

        single.ratingID = newDocument.id;

        const result = await single.save();



        await DentalDoctors.updateOne(
            { _id: doctorIDnew },
            {
                $push: {
                    ratingIDs: appointmentIDnew
                }
            }
        )
        res.send(resultfirst);

    } catch (err) {
        res.status(500).json(err);
    }
};





const getOneDoctorAllRatings = async (req, res) => {
    try {
        let single = await DentalDoctors.findById(req.params._id).populate({
            path: 'ratingIDs',
            populate: [
                { path: 'userID', model: 'dentalusers' }
            ]
        })

        if (!single) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.send(single);

    } catch (err) {
        res.status(500).json(err);
    }
};




module.exports = { createArrayforRating, getOneDoctorAllRatings };