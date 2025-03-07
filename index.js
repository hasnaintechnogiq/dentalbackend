const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
require("./config");
var cors = require('cors')
const DentalUser = require('./models/DentalUser.js');
const DentalDoctors = require('./models/DentalDoctors.js');
const Clinic = require('./models/Clinic.js');
const DentalAppointment = require('./models/DentalAppointment.js');
const DocumentPDF = require('./models/DocumentPDF.js');
const OldTreatmentHistory = require('./models/OldTreatmentHistory.js');
const Staffs = require('./models/Staffs.js');

const XLSX = require('xlsx');

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


const Routes = require("./routes/route.js")

const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/images');
    },
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    },
});

const upload = multer({ storage: storage });
app.use('/profile', express.static('upload/images'));




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
            profile_url: `https://dental-app-nvzl4.ondigitalocean.app/profile/${file.filename}`
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
        const profile_url = `https://dental-app-nvzl4.ondigitalocean.app/profile/${files.filename}`;
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
        const profile_url = `https://dental-app-nvzl4.ondigitalocean.app/profile/${files.filename}`;
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
            profile_url: `https://dental-app-nvzl4.ondigitalocean.app/profile/${file.filename}`
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
        profile_url: `https://dental-app-nvzl4.ondigitalocean.app/profile/${file.filename}`
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


app.use('/', Routes);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})