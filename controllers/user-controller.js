const mongoose = require('mongoose');
const DentalUser = require('../models/DentalUser.js');
const DentalDoctors = require('../models/DentalDoctors.js');
const NotificationArray = require('../models/NotificationArray.js');
const AddMemberRequets = require('../models/AddMemberRequets.js');
const { ObjectId } = require('mongodb');

var nodemailer = require('nodemailer');


const getAllUsers = async (req, res) => {
    try {
        let users = await DentalUser.find();
        res.send(users)
    } catch (err) {
        res.status(500).json(err);
    }
};








const getSingleUser = async (req, resp) => {
    try {
        let single = await DentalUser.findById(req.params._id).populate({
            path: 'sendrequestID',
            populate: [
                { path: 'requaesterID', model: 'dentalusers' },
                { path: 'accepterID', model: 'dentalusers' }
            ]
        });
        resp.send(single);
    } catch (err) {
        res.status(500).json(err);
    }
};


const addNewUser = async (req, res) => {
    const { email } = req.body;
    console.log(req.body);
    try {
        let existingTeacherByEmail = await DentalUser.find({ email })
        let user = new DentalUser(req.body);

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

const updateUserDetail = async (req, res) => {
    try {
        console.log(req.params)
        let data = await DentalUser.updateOne(
            req.params,
            { $set: req.body }
        );
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        let data = await DentalUser.deleteOne(req.params);
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};







const genarateOtpandsendtoemail = async (req, resp) => {
    try {

        let single = await DentalUser.findOne({ email: req.body.email });
        const { email } = req.body;
        if (single) {

            function generateRandomNumber() {
                return Math.floor(100000 + Math.random() * 900000);
            }


            const randomNumber = generateRandomNumber();


            DentalUser.findOneAndUpdate(
                { email: email },
                { otp: randomNumber },
                { new: true }
            )
                .then(user => {
                    console.log('User OTP updated:', user);
                })
                .catch(err => {
                    console.error('Error updating user OTP:', err);
                });



            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'pushpd2000@gmail.com',
                    pass: 'fmxpxshteaasyklz'
                }
            });



            const mailOptions = {
                from: 'pushpd2000@gmail.com',
                to: email,
                subject: 'Sending Email using Node.js',
                text: `Your 6-digit OTP is: ${randomNumber}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return resp.status(500).json({ error: 'Failed to send email' });
                } else {
                    return resp.status(200).json({ message: 'Email sent successfully' });
                }
            });
        } else {
            return resp.status(200).json({ message: 'Email id does not exist.' });
        }



    } catch (err) {
        resp.status(500).json(err);
    }
};





const checkotpnow = async (req, resp) => {
    try {
        if (req.body.email && req.body.otp) {
            let user = await DentalUser.findOne(req.body).select("-password")
            if (user) {
                resp.send(user);
            } else { resp.send("Wrong Otp") }
        } else { resp.send("enter email and pass") }

    } catch (err) {
        resp.status(500).json(err);
    }
};



const searchUserByAllDetails = async (req, res) => {
    try {
        const result = await DentalUser.find({
            "$or": [
                { name: { $regex: req.params.key, $options: "i" } },
                { email: { $regex: req.params.key, $options: "i" } }
            ]
        });
        res.send(result);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};




const addFamilyMember = async (req, res) => {
    try {
        const requaester = await DentalUser.findById(req.body.requaesterID);
        const accepter = await DentalUser.findById(req.body.accepterID);
        if (!requaester || !accepter)
            return res.send("No user found");
        const newDocument = new AddMemberRequets(req.body);
        const result = await newDocument.save();
        const addrequest = new mongoose.Types.ObjectId(newDocument.id);
        let single = await DentalUser.findByIdAndUpdate(req.body.requaesterID, {
            $push: {
                sendrequestID: addrequest
            }
        });
        let nextStep = await DentalUser.findByIdAndUpdate(req.body.accepterID, {
            $push: {
                sendrequestID: addrequest
            }
        });
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};




const findUserDetailsWithStatus = async (req, res) => {
    try {
        const requaester = await DentalUser.findById(req.body.tofiendUserID).populate("sendrequestID");

        const searchId = new ObjectId(req.body.accepterID);

        const result = requaester.sendrequestID.find(obj => obj.accepterID.equals(searchId));

        const userDetailsaccepter = await DentalUser.findById(req.body.accepterID)
        if (result) {
            userDetailsaccepter._doc.statusMessage = "Yes";
            res.send(userDetailsaccepter);

            console.log('accepterID is present:', userDetailsaccepter);
        } else {
            userDetailsaccepter._doc.statusMessage = "No";
            console.log('accepterID is not present');
            res.send(userDetailsaccepter);
        }


    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};



const updateFamilyRequestDetails = async (req, res) => {
    try {
        console.log(req.params)
        let data = await AddMemberRequets.updateOne(
            req.params,
            { $set: req.body }
        );
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};










module.exports = { updateFamilyRequestDetails, findUserDetailsWithStatus, addFamilyMember, checkotpnow, genarateOtpandsendtoemail, getAllUsers, getSingleUser, addNewUser, updateUserDetail, deleteUser, searchUserByAllDetails };