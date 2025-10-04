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

        if (existingTeacherByEmail.length > 0) {
            res.send('Email already exists');
            console.log("Email already exists")
        } else {
            let user = new DentalDoctors(req.body);
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
        res.status(400).json(err("error"));
    }
};


const searchDoctorsByName = async (req, res) => {
    try {
        const result = await DentalDoctors.find({
            "$or": [
                { drname: { $regex: req.params.key, $options: "i" } },
                { dremail: { $regex: req.params.key, $options: "i" } }
            ]
        }).populate("ratingIDs");
        res.send(result);

    } catch (err) {
        console.log(err);
        res.status(400).json(err("error"));
    }
};



const findOneDoctorByID = async (req, resp) => {
    try {
        let single = await DentalDoctors.findById(req.params._id).populate("clinicID");
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};


const getAllDoctors = async (req, res) => {
    try {
        let project = await DentalDoctors.find().populate("ratingIDs");
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
const updateDoctorDetail = async (req, res) => {
    try {
        console.log(req.params)
        let data = await DentalDoctors.updateOne(
            req.params,
            { $set: req.body }
        );
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};




const findOneClinicByID = async (req, resp) => {
    try {
        let single = await Clinic.findById(req.params._id);
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
};

const searchAllAppointmentsByDoctorID = async (req, res) => {
    const { drID } = req.params;
    const searchTerm = req.query.q?.trim();
    if (!searchTerm) return res.status(400).json({ error: 'Search term required' });

    const regex = new RegExp(searchTerm, 'i'); // case-insensitive

    try {
        // Step 1: Find doctor by ID and populate related fields
        const doctor = await DentalDoctors
            .findById(drID)
            .populate({
                path: 'appointmentID',
                populate: [
                    { path: 'userID', model: 'dentalusers' },
                    { path: 'clinicID', model: 'clinic' },
                    { path: 'ratingID', model: 'ratingCounter' },
                ]
            })
            .populate('staffIDs');

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Step 2: If there's a search query, filter results
        let appointments = doctor.appointmentID || [];
        let staffs = doctor.staffIDs || [];

        if (regex) {
            appointments = appointments.filter(app =>
                regex.test(app?.patientName) ||
                regex.test(app?.Treatmentfor) ||
                regex.test(app?.userID?.name) ||
                regex.test(app?.userID?.email)
            );

            staffs = staffs.filter(staff =>
                regex.test(staff?.name) || regex.test(staff?.email)
            );
        }

        const users = [...new Set(appointments.map(app => app.userID))];

        // Step 3: Return response
        res.json({
            appointments,
            patients: users,
            staffs,
        });

    } catch (error) {
        console.error('Search API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Search Doctors by Specialities with pagination
const searchDoctorsBySpecialities = async (req, res) => {
    try {
        const { specialities } = req.body;
        const { page = 1, limit = 10 } = req.query;


        if (!Array.isArray(specialities) || specialities.length === 0) {
            return res.status(400).json({ error: 'Specialities must be a non-empty array' });
        }

        // Convert pagination params to numbers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        // Build filter with no validation
        const filter = {
            $or: specialities.map((spec) => ({ [spec]: "Yes" }))
        };

        console.log("filter", filter)

        const [doctors, total] = await Promise.all([
            DentalDoctors
                .find(filter)
                .populate('staffIDs', 'name designation')
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum),

            DentalDoctors
                .countDocuments(filter)
        ])

        const totalPages = Math.ceil(total / limitNum);

        res.json({
            page: pageNum,
            limit: limitNum,
            totalDoctors: total,
            totalPages,
            doctors
        });
    } catch (err) {
        console.error('Error in /doctors/search:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// All Patients by DoctorID with Pagination
const getUniquePatientsByDoctorID = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1 } = req.query;
        const limit = 9;
        const skip = (page - 1) * limit;

        // 1. Find doctor by ID
        const doctor = await DentalDoctors
            .findById(id)
            .populate({
                path: 'appointmentID',
                populate: [
                    { path: 'userID', select: 'name email number profile_url' },
                    { path: 'clinicID', select: 'clinicAddress clinicname' }
                ]
            })

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // console.log("doc", doctor)
        // 2. Get all appointments from this doctor
        let appointments = doctor.appointmentID || [];

        // console.log("appotn", appointments)

        // 3. Remove duplicates (userID._id if present, else patientname)
        const uniqueMap = new Map();
        appointments.forEach(app => {
            const key = app.userID?._id ? app.userID._id.toString() : app.patientName;
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, app);
            } else {
                // Keep newest appointment if duplicate
                if (new Date(app.createdAt || app.Bookdate) > new Date(uniqueMap.get(key).createdAt || uniqueMap.get(key).Bookdate)) {
                    uniqueMap.set(key, app);
                }
            }
        });

        // console.log("app uniq", uniqueMap)
        // 4. Convert map to array
        let uniqueAppointments = Array.from(uniqueMap.values());

        // 5. Sort by Bookdate descending
        uniqueAppointments.sort((a, b) => new Date(b.Bookdate) - new Date(a.Bookdate));

        // 6. Pagination
        const totalItems = uniqueAppointments.length;
        const totalPages = Math.ceil(totalItems / limit);
        const paginatedAppointments = uniqueAppointments.slice(skip, skip + limit);

        // 7. Return response
        res.json({
            totalPages,
            currentPage: parseInt(page),
            limit,
            patients: paginatedAppointments
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }

}









module.exports = {updateDoctorDetail, addDoctorProfile, searchDoctorsByCity, searchDoctorsByName, findOneDoctorByID, getAllDoctors , findOneClinicByID, searchAllAppointmentsByDoctorID,
    searchDoctorsBySpecialities, getUniquePatientsByDoctorID};