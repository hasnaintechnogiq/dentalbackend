const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const http = require('http');
const socketIo = require('socket.io');
require("./config");
var cors = require('cors')
const DentalUser = require('./models/DentalUser.js');
const DentalDoctors = require('./models/DentalDoctors.js');
const Clinic = require('./models/Clinic.js');
const DentalAppointment = require('./models/DentalAppointment.js');
const DocumentPDF = require('./models/DocumentPDF.js');
const OldTreatmentHistory = require('./models/OldTreatmentHistory.js');
const Staffs = require('./models/Staffs.js');
// const BASE_URL = process.env.BASE_URL;
const XLSX = require('xlsx');
const fs = require('fs');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');



const { firebase } = require('./firebase/index.js');



const authenticate = require('./authenticate');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);

const Routes = require("./routes/route.js")

const multer = require("multer");
const path = require("path");
const crypto = require('crypto');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/images');
    },
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    },
});

// Shubham's code
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './upload/images');
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
//         const extension = path.extname(file.originalname);
//         cb(null, `${file.fieldname}_${uniqueSuffix}${extension}`);

//     },
// });
const upload = multer({ storage: storage });
app.use('/profile', express.static('upload/images'));
// Shubham's code
// app.use('/profile', express.static(path.join(__dirname, 'upload/images')));  // for clinic images
// app.use('/upload', express.static(path.join(__dirname, 'upload')));  // for staff profile picture

// Initialize Socket.IO on top of the HTTP server
const io = socketIo(server, {
    cors: {
        origin: '*', // replace with your frontend URL in production
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('New socket connected:', socket.id);

    socket.on('joinRoom', (roomID) => {
        socket.join(roomID);
        console.log(`Socket ${socket.id} joined room ${roomID}`);
    });

    socket.on('sendMessage', async (data) => {
        try {
            // Save the message like before
            const ChatDental = require('./models/ChatDental');
            const SecondaryArrayOfChats = require('./models/SecondaryArrayOfChats');

            const newChat = new ChatDental(data);
            const savedChat = await newChat.save();

            await SecondaryArrayOfChats.updateOne(
                { _id: data.SecondaryArrayOfChatsID },
                { $push: { chatAllID: savedChat._id } }
            );

            io.to(data.SecondaryArrayOfChatsID).emit('newMessage', savedChat);
        } catch (err) {
            console.error('Error handling sendMessage:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start the HTTP server (not just app.listen anymore!)
 




app.post('/excel-to-appointment', upload.single('file'), async (req, res) => {
    const formData = req.body;
    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const doctorIDnew = new mongoose.Types.ObjectId(formData.doctorID);

        async function sitevisitcallnowChacks() {
            for (let i = 0; i < jsonData.length; i++) {
                const entry = jsonData[i];
                const newDocument = new OldTreatmentHistory(entry);
                const result = await newDocument.save();
                const appointmentIDnew = new mongoose.Types.ObjectId(newDocument.id);
    
                await DentalDoctors.updateOne(
                    { _id: doctorIDnew },
                    {
                        $push: {
                            oldtreatmenthistoryID: appointmentIDnew
                        }
                    }
                )
    
            }
        }
        sitevisitcallnowChacks();


        res.status(200).send('File uploaded and data imported successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while uploading the file');
    }
});


















app.post('/add-previus-images-documents', upload.array('images', 5), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const formData = req.body;


        const imgarry = files.map((file) => ({
            originalname: file.originalname,
            filename: file.filename,
            path: file.path,
            profile_url: `https://dentalbackend-3gjq.onrender.com/profile/${file.filename}`
        }));


        let singleUser = await DentalAppointment.findById(formData.appointmentID)

        singleUser.imgarryforUser = imgarry

        singleUser.save();

        console.log(singleUser)

        res.json('Done');
    } catch (error) {
        console.log(error)
    }
});








// Upload image for profile for Doctor start


app.post('/upload-profile-image-for-doctor-new', upload.single('image'), async (req, res) => {
    const files = req.file;
    try {
        if (!files || files.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const formData = req.body;
        const profile_url = `https://dentalbackend-3gjq.onrender.com/profile/${files.filename}`;
        console.log(profile_url)
        let singleUser = await DentalDoctors.findById(formData.doctorID)

        singleUser.profile_url = profile_url

        singleUser.save();

        res.json({ message: 'Image uploaded successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
});


// Upload image for profile for Doctor end








// Upload image for profile for patients start


app.post('/upload-profile-image-for-patient', upload.single('image'), async (req, res) => {
    const files = req.file;
    try {
        if (!files || files.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const formData = req.body;
        const profile_url = `https://dentalbackend-3gjq.onrender.com/profile/${files.filename}`;
        console.log(profile_url)
        let singleUser = await DentalUser.findById(formData.userID)

        singleUser.profile_url = profile_url

        singleUser.save();

        res.json({ message: 'Image uploaded successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
});


// Upload image for profile for patients end



app.get("/doctor-profile-picture/:_id", async (req, resp) => {
    try {
        let single = await DentalDoctors.findOne({ _id: req.params._id }).select("-password")
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
});

app.get("/patients-profile-picture/:_id", async (req, resp) => {
    try {
        let single = await DentalUser.findOne({ _id: req.params._id }).select("-password")
        resp.send(single);
    } catch (err) {
        resp.status(500).json(err);
    }
});



















app.post('/add-treament-images-from-doctor', upload.array('images', 5), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const formData = req.body;

        const imgarry = files.map((file) => ({
            originalname: file.originalname,
            filename: file.filename,
            path: file.path,
            profile_url: `https://dentalbackend-3gjq.onrender.com/profile/${file.filename}`
        }));

        let singleUser = await DentalAppointment.findById(formData.appointmentID)

        singleUser.imgarryforDoctor = imgarry

        singleUser.save();

        console.log(singleUser)

        res.json('Done');
    } catch (error) {
        console.log(error)
    }
}
);




app.post('/upload-documents-form-patients', upload.single('document'), async (req, res) => {
    const formData = req.body;
    console.log(formData)
    try {
        const { originalname, size, mimetype, filename } = req.file;
        const newDocument = new DocumentPDF({
            name: originalname,
            uri: filename,
            type: mimetype,
            size: size
        });

        const result = await newDocument.save();

        let objID = new mongoose.Types.ObjectId(result.id);
        let newss = new mongoose.Types.ObjectId(req.body.appointmentID)
        console.log(objID);
        await DentalAppointment.updateOne(
            { _id: newss },
            {
                $push: {
                    documentsformPatientsID: objID
                }
            }
        )

        res.json({ message: 'Document uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading document' });
    }
});











app.post('/upload-documents-form-doctor', upload.single('document'), async (req, res) => {
    const formData = req.body;
    console.log(formData)
    try {
        const { originalname, size, mimetype, filename } = req.file;
        const newDocument = new DocumentPDF({
            name: originalname,
            uri: filename,
            type: mimetype,
            size: size
        });

        const result = await newDocument.save();

        let objID = new mongoose.Types.ObjectId(result.id);
        let newss = new mongoose.Types.ObjectId(req.body.appointmentID)
        console.log(objID);
        await DentalAppointment.updateOne(
            { _id: newss },
            {
                $push: {
                    documentsformDocotorID: objID
                }
            }
        )

        res.json({ message: 'Document uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading document' });
    }
});


// Shubham's code
// app.post('/add-clinic-in-doctor-profile', upload.array('images', 5), async (req, res) => {
//     const files = req.files;
//     if (!files || files.length === 0) {
//         const formData = req.body;
//         const result = await Clinic.create({ ...formData });

//         let objID = new mongoose.Types.ObjectId(result.id);
//         let newss = new mongoose.Types.ObjectId(req.body.doctorID);
//         console.log(objID);
//         await DentalDoctors.updateOne(
//             { _id: newss },
//             { $push: { clinicID: objID } },
//         )
//         return res.send(result);
//     }

//     const formData = req.body;
//     console.log(files)
//     const imgarry = files.map((file) => ({
//         originalname: file.originalname,
//         filename: file.filename,
//         path: file.path.replace(/\\/g, '/'),
//         profile_url: `${req.protocol}://${req.get('host')}/profile/${file.filename}`
//     }));

//     console.log('image arry', imgarry)
//     const result = await Clinic.create({ ...formData, imgarry });

//     let objID = new mongoose.Types.ObjectId(result.id);
//     let newss = new mongoose.Types.ObjectId(req.body.doctorID)
//     console.log(objID);
//     await DentalDoctors.updateOne(
//         { _id: newss },
//         { $push: { clinicID: objID } },
//     )
//     res.send(result);
//     // res.send(imgarry);
// });
app.post('/add-clinic-in-doctor-profile', upload.array('images', 5), async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        const formData = req.body;
        const result = await Clinic.create({ ...formData });

        let objID = new mongoose.Types.ObjectId(result.id);
        let newss = new mongoose.Types.ObjectId(req.body.doctorID)
        console.log(objID);
        await DentalDoctors.updateOne(
            { _id: newss },
            {
                $push: {
                    clinicID: objID
                }
            }
        )

        return res.send(result);
    }

    const formData = req.body;
    console.log(files)
    const imgarry = files.map((file) => ({
        originalname: file.originalname,
        filename: file.filename,
        path: file.path,
        profile_url: `https://dentalbackend-3gjq.onrender.com/profile/${file.filename}`
    }));

    const result = await Clinic.create({ ...formData, imgarry });

    let objID = new mongoose.Types.ObjectId(result.id);
    let newss = new mongoose.Types.ObjectId(req.body.doctorID)
    console.log(objID);
    await DentalDoctors.updateOne(
        { _id: newss },
        {
            $push: {
                clinicID: objID
            }
        }
    )
    res.send(result);
    // res.send(imgarry);
});


// Update clinic details with image handling Shubham's code
// app.post('/update-clinic-details', upload.array('images', 5), async (req, res) => {
//     try {
//         console.log("update clinic", req.body)
//         console.log("update clinic file", req.files)

//         const { clinicId, existingImages, ...formData } = req.body;

//         if (!clinicId) {
//             return res.status(400).json({ error: 'clinicId is required' });
//         }

//         let updateObject = { ...formData };

//         let updateImgArray = false; // flag to check if we should update imgarry
//         let existingImgArr = [];

//         console.log("existing image", existingImages)

//         // Handle kept images
//         if (existingImages) {
//             let parsedImages;
//             if (typeof existingImages === 'string') {
//                 parsedImages = [JSON.parse(existingImages)];
//             } else if (Array.isArray(existingImages)) {
//                 parsedImages = existingImages.map(img =>
//                     typeof img === 'string' ? JSON.parse(img) : img
//                 ).filter(Boolean);
//             }
//             existingImgArr = parsedImages || [];
//             updateImgArray = true;
//         }

//         // Handle new uploaded images
//         if (req.files && req.files.length > 0) {
//             const newImages = req.files.map(file => ({
//                 originalname: file.originalname,
//                 filename: file.filename,
//                 path: file.path.replace(/\\/g, '/'),
//                 profile_url: `${req.protocol}://${req.get('host')}/profile/${file.filename}`,
//             }));

//             // Merge existing and new
//             updateObject.imgarry = [...existingImgArr, ...newImages];
//         } else if (updateImgArray) {
//             // No new uploads, only keep existing ones
//             updateObject.imgarry = existingImgArr;
//         }

//         const updatedClinic = await Clinic.findByIdAndUpdate(
//             clinicId,
//             { $set: updateObject },
//             { new: true }
//         );

//         res.status(200).json(updatedClinic);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

app.delete('/delete-clinic/:clinicId/:doctorID', async (req, res) => {
    try {
        console.log('delete clinic req', req.params)
        const { clinicId, doctorID } = req.params;

        const clinic = await Clinic.findById(clinicId);
        if (!clinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        // Delete associated image files (if stored locally)
        if (clinic.imgarry && clinic.imgarry.length > 0) {
            clinic.imgarry.forEach((img) => {
                if (img.path) {
                    const imagePath = path.join(__dirname, img.path);
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error('Error deleting image:', imagePath, err.message);
                        }
                    });
                }
            });
        }

        // Remove clinic document
        await Clinic.findByIdAndDelete(clinicId);

        // Remove clinicID reference from doctor profile
        await DentalDoctors.updateOne(
            { _id: doctorID },
            { $pull: { clinicID: clinicId } }
        );

        res.status(200).json({ message: 'Clinic deleted successfully' });
    } catch (error) {
        console.error('Delete clinic error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/add-job-to-doctor-profile', upload.array('images', 5), async (req, res) => {
    try {
        const { doctorId, ...updateData } = req.body;
        let updateObject = { ...updateData };

        if (req.files && req.files.length > 0) {
            const imgarry = req.files.map((file) => ({
                originalname: file.originalname,
                filename: file.filename,
                path: file.path,
                profile_url: `https://dentalbackend-3gjq.onrender.com/profile/${file.filename}`
            }));
            updateObject.imgarry = imgarry;
        }

        const updatedDoctor = await DentalDoctors.findByIdAndUpdate(
            doctorId,
            { $set: updateObject },
            { new: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: 'doctor not found' });
        }

        res.json(updatedDoctor);
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ message: 'Error updating doctor details' });
    }
});




















app.post("/login-dental-user", async (req, resp) => {
    if (req.body.email && req.body.password) {
        let user = await DentalUser.findOne(req.body).select("-password")
        if (user) {
            resp.send(user);
        } else { resp.send("no data found") }
    } else { resp.send("enter email and pass") }
});


app.post("/login-dental-doctor", async (req, resp) => {
    if (req.body.dremail && req.body.drpassword) {
        let user = await DentalDoctors.findOne(req.body).select("-drpassword")
        if (user) {
            resp.send(user);
        } else { resp.send("no data found") }
    } else { resp.send("enter email and pass") }
});



app.post("/login-dental-staff", async (req, resp) => {
    if (req.body.email && req.body.password) {
        let user = await Staffs.findOne(req.body).select("-password")
        if (user) {
            resp.send(user);
        } else { resp.send("no data found") }
    } else { resp.send("enter email and pass") }
});





app.post('/create-notification-component', async (req, res) => {
    const { titleNew, messageNew, doctorID, UserIDforFcmToken } = req.body;

    try {

        if (!!doctorID) {
            let singleUser = await DentalDoctors.findById(doctorID)
            var fcmTokenNew = singleUser.fcmToken;
        }

        if (!!UserIDforFcmToken) {
            let singleUser = await DentalUser.findById(UserIDforFcmToken)
            var fcmTokenNew = singleUser.fcmToken;
        }

        await firebase.messaging().send({
            token: fcmTokenNew,
            notification: {
                "title": titleNew,
                "body": messageNew
            }
        })
        console.log(req.body)
        res.send("Done")
    } catch (error) {
        console.log(error)
    }
});








let reminders = [];
console.log(reminders)
// Endpoint to create a reminder
app.post('/reminders', (req, res) => {
    const { time, message, UserIDforFcmToken, doctorID } = req.body;

    const reminder = { time, message, UserIDforFcmToken, doctorID };
    reminders.push(reminder);
    console.log(reminder)
    // Schedule the reminder
    schedule.scheduleJob(new Date(time), async () => {

        if (!!UserIDforFcmToken) {
            let singleUser = await DentalUser.findById(UserIDforFcmToken)
            var fcmTokenNew = singleUser.fcmToken;
        }

        if (!!doctorID) {
            let singleUser = await DentalDoctors.findById(doctorID)
            var fcmTokenNew = singleUser.fcmToken;
        }
        try {
            await firebase.messaging().send({
                token: fcmTokenNew,
                notification: {
                    "title": "Dental Tittle",
                    "body": message
                }
            })
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
        console.log('Reminder:', message);
    });

    res.status(201).send(reminder);
});













// setTimeout(() => {
//     sendMassage()
// }, 2000)




app.post('/update-clinic-details', upload.array('images', 5), async (req, res) => {
    try {
        const { clinicId, ...updateData } = req.body;
        let updateObject = { ...updateData };

        if (req.files && req.files.length > 0) {
            const imgarry = req.files.map((file) => ({
                originalname: file.originalname,
                filename: file.filename,
                path: file.path,
                profile_url: `https://dentalbackend-3gjq.onrender.com/profile/${file.filename}`
            }));
            updateObject.imgarry = imgarry;
        }

        const updatedClinic = await Clinic.findByIdAndUpdate(
            clinicId,
            { $set: updateObject },
            { new: true }
        );

        if (!updatedClinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        res.json(updatedClinic);
     } catch (error) {
        console.error('Error updating clinic:', error);
        res.status(500).json({ message: 'Error updating clinic details' });
    }
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

// GET /api/nearby-clinics?latitude=...&longitude=...&search=...&radius=...
app.get('/nearby-clinics', async (req, res) => {
    try {
        const { latitude, longitude, search = '', radius } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        // const radiusInKm = parseFloat(radius);

        // Text search filter: case-insensitive partial match on name (can extend to address, city, etc.)
        const searchRegex = new RegExp(search, 'i');
        const matchingClinics = await Clinic.find({
            $or: [
                { clinicname: searchRegex },
                { clinicAddress: searchRegex },
                // Add more fields if needed:
                // { city: searchRegex },
                // { specialization: searchRegex },
            ]
        });

        // Calculate distance for filtered clinics
        const clinicsWithDistance = matchingClinics.map((clinic) => {
            const distance = getDistanceFromLatLonInKm(
                lat,
                lon,
                parseFloat(clinic.latitude),
                parseFloat(clinic.longitude)
            );

            return {
                ...clinic.toObject(),
                distance: distance.toFixed(2),
            };
        });

        // Filter by radius
        // const filteredByRadius = clinicsWithDistance.filter(c => c.distance <= radiusInKm);

        // Sort by proximity
        clinicsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(clinicsWithDistance);
    } catch (error) {
        console.error('Error fetching nearby clinics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/search-anything-by-doctorID/:drID', async (req, res) => {
    const { drID } = req.params;
    const searchTerm = req.query.q?.trim();
    if (!searchTerm) return res.status(400).json({ error: 'Search term required' });

    const regex = new RegExp(searchTerm, 'i'); // case-insensitive

    try {
        // Step 1: Find doctor by ID and populate related fields
        const doctor = await DentalDoctors.findById(drID)
            .populate({
                path: 'appointmentID',
                populate: [
                    { path: 'userID', model: 'dentalusers' },
                    { path: 'clinicID', model: 'clinic' },
                    { path: 'ratingID', model: 'ratingCounter' },
                ]
            })
            .populate({
                path: 'staffIDs',
                populate: {
                    path: 'clinicID',
                    model: 'clinic',
                    select: 'clinicname clinicAddress'
                }
            });

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

        // console.log("filtered staff", staffs)

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
});

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})