const mongoose = require('mongoose');
const DentalUser = require('../models/DentalUser.js');
const DentalDoctors = require('../models/DentalDoctors.js');
const NotificationArray = require('../models/NotificationArray.js');
const Clinic = require('../models/Clinic.js');

var nodemailer = require('nodemailer');





const addDoctorProfile = async (req, res) => {
    const { dremail } = req.body;
    try {
        let existingTeacherByEmail = await DentalDoctors.find({ dremail })
        let user = new DentalDoctors(req.body);
        if (existingTeacherByEmail.length > 0) {
            res.send('Email already exists');
            console.log("Email already exists")
        } else {

            const newDocument = new NotificationArray();
            const notifiArray = await newDocument.save();

            let objID = new mongoose.Types.ObjectId(newDocument.id)

            user.notificationarrayID = objID;
            const result = await user.save();

            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const searchDoctorsByCity = async (req, res) => {
    try {
        const { drcity } = req.body;
        const ourUser = await DentalDoctors.find({
            drcity: drcity
        });
        if (!ourUser)
            return res.status(200).json(error("City Not Found"));

        res.send(ourUser);

    } catch (err) {
        console.log(err);
        res.status(400).json(error("error"));
    }
};


const searchDoctorsByName = async (req, res) => {
    try {
        const result = await DentalDoctors.find({
            "$or": [
                { drname: { $regex: req.params.key, $options: "i" } },
                { dremail: { $regex: req.params.key, $options: "i" } }
            ]
        });
        res.send(result);

    } catch (err) {
        console.log(err);
        res.status(400).json(error("error"));
    }
};



const findOneDoctorByID = async (req, resp) => {
    try {
        let single = await DentalDoctors.findById(req.params._id)
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};


const getAllDoctors = async (req, res) => {
    try {
        let project = await DentalDoctors.find()
        const firstTenObjects = project.slice(0, 6);
        res.send(firstTenObjects)
    } catch (err) {
        res.status(500).json(err);
    }
};

// const addNewClinicinDoctor = async (req, res) => {
//     console.log(req.body)
//     try {
//         const doctorfound = await DentalDoctors.findById(req.body.doctorID);
//         if (!doctorfound)
//             return res.send("No doctor found");
//         const newDocument = new Clinic(req.body);
//         const result = await newDocument.save();
//         const addaclinic = new mongoose.Types.ObjectId(newDocument.id);
//         let single = await DentalDoctors.findByIdAndUpdate(req.body.doctorID, {
//             $push: {
//                 clinicID: addaclinic
//             }
//         });
//         res.send(result);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };




module.exports = { addDoctorProfile, searchDoctorsByCity, searchDoctorsByName, findOneDoctorByID, getAllDoctors };