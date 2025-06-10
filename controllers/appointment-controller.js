const mongoose = require('mongoose');
const DentalUser = require('../models/DentalUser.js');
const DentalDoctors = require('../models/DentalDoctors.js');
const NotificationArray = require('../models/NotificationArray.js');
const DentalAppointment = require('../models/DentalAppointment.js');
const Clinic = require('../models/Clinic.js');
const OldTreatmentHistory = require('../models/OldTreatmentHistory.js');
const Prescription = require('../models/Prescription.js');

/**
 * Creates a new appointment and updates related doctor and user records
 * @param {Object} req - Express request object containing appointment details
 * @param {Object} res - Express response object
 * @returns {Object} Response with appointment details or error message
 */
const addAppointmentFunction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { doctorID, userID, ...appointmentData } = req.body;

        // Validate required fields
        if (!doctorID || !userID) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID and User ID are required'
            });
        }

        // Create new appointment
        const newAppointment = new DentalAppointment({
            ...appointmentData,
            doctorID,
            userID
        });

        const savedAppointment = await newAppointment.save({ session });

        // Update user's appointments
        await DentalUser.updateOne(
            { _id: userID },
            { $push: { appointmentID: savedAppointment._id } },
            { session }
        );

        // Update doctor's appointments and notification
        await DentalDoctors.updateOne(
            { _id: doctorID },
            { 
                $push: { appointmentID: savedAppointment._id },
                NotificationNewAppoint: "Unseen"
            },
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: savedAppointment
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error creating appointment:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Failed to create appointment',
            error: error.message
        });
    } finally {
        session.endSession();
    }
};

/**
 * Creates a new appointment without user association and updates doctor's records
 * @param {Object} req - Express request object containing appointment details
 * @param {Object} res - Express response object
 * @returns {Object} Response with appointment details or error message
 */
const addAppointmentWithoutUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { doctorID, ...appointmentData } = req.body;

        // Validate required fields
        if (!doctorID) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID is required'
            });
        }

        // Create new appointment
        const newAppointment = new DentalAppointment({
            ...appointmentData,
            doctorID
        });

        const savedAppointment = await newAppointment.save({ session });

        // Update doctor's appointments
        await DentalDoctors.updateOne(
            { _id: doctorID },
            { 
                $push: { appointmentID: savedAppointment._id },
                NotificationNewAppoint: "Unseen"
            },
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: savedAppointment
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error creating appointment:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Failed to create appointment',
            error: error.message
        });
    } finally {
        session.endSession();
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

const deletePrescription = async (req, res) => {
    try {
        const { _id } = req.params;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Prescription ID is required'
            });
        }

        const result = await Prescription.deleteOne({ _id });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Prescription deleted successfully',
            data: result
        });
    } catch (error) {
        console.error('Error deleting Prescription:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getBookedSlots = async (req, res) => {
    try {
        const { doctorID, date } = req.params;
        
        const appointments = await DentalAppointment.find({
            doctorID: doctorID,
            Bookdate: date,
            requestStatus: { $ne: "Cancelled" }
        }).select('BookTime');

        return res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch booked slots',
            error: error.message
        });
    }
};

module.exports = { addnoePrescription, findOneOldTreatmentByID, updateAppointmentDetails, addAppointmentFunction, addAppointmentWithoutUser, findAllAppointofUserByID, findAllAppointofDoctorByID, getSingleAppointmwntWithDetails, deletePrescription, getBookedSlots };