const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
require("./config");
var cors = require('cors')
const DentalUser = require('./models/DentalUser.js');
const DentalDoctors = require('./models/DentalDoctors.js');
const Clinic = require('./models/Clinic.js');





const authenticate = require('./authenticate');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

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






app.use('/', Routes);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})