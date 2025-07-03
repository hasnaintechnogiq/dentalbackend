const mongoose = require('mongoose');
const DentalUser = require('../models/DentalUser.js');
const DentalDoctors = require('../models/DentalDoctors.js');
const NotificationArray = require('../models/NotificationArray.js');
const DentalAppointment = require('../models/DentalAppointment.js');
const SecondaryArrayOfChats = require('../models/SecondaryArrayOfChats.js');
const ChatDental = require('../models/ChatDental.js');





const createArrayforChat = async (req, res) => {
    try {
        let single = await DentalAppointment.findById(req.body.appointmentID);

        if (!single) {
            return res.status(404).json({ error: 'DentalAppointment not found' });
        }

        const newDocument = new SecondaryArrayOfChats(req.body);
        const resultfirst = await newDocument.save();


        const doctorIDnew = single.doctorID;
        const userIDnew = single.userID;
        const appointmentIDnew = new mongoose.Types.ObjectId(newDocument.id);

        single.secondarychatArrayID = newDocument.id;

        const result = await single.save();

        await DentalUser.updateOne(
            { _id: userIDnew },
            {
                $push: {
                    chatArrayID: appointmentIDnew
                }
            }
        )

        await DentalDoctors.updateOne(
            { _id: doctorIDnew },
            {
                $push: {
                    chatArrayID: appointmentIDnew
                }
            }
        )
        res.send(resultfirst);

    } catch (err) {
        res.status(500).json(err);
    }
};




// const addNewChat = async (req, res) => {
//     try {
//         // let single = await SecondaryArrayOfChats.findById(req.body.SecondaryArrayOfChatsID);
//         const newDocument = new ChatDental(req.body);
//         const resultfirst = await newDocument.save();

//         const appointmentIDnew = new mongoose.Types.ObjectId(req.body.SecondaryArrayOfChatsID);
//         await SecondaryArrayOfChats.updateOne(
//             { _id: appointmentIDnew },
//             {
//                 $push: {
//                     chatAllID: resultfirst
//                 }
//             }
//         )

//         res.send(resultfirst);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// };


const addNewChat = async (req, res) => {
    try {
        const io = req.app.get('io'); // Access socket instance

        const newMessage = new ChatDental(req.body);
        const savedMessage = await newMessage.save();

        const appointmentIDnew = new mongoose.Types.ObjectId(req.body.SecondaryArrayOfChatsID);
        await SecondaryArrayOfChats.updateOne(
            { _id: appointmentIDnew },
            { $push: { chatAllID: savedMessage._id } }
        );
        io.to(req.body.SecondaryArrayOfChatsID).emit('newMessage', savedMessage);
        res.send(savedMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};


const getChatDetails = async (req, res) => {
    try {
        let single = await SecondaryArrayOfChats.findById(req.params._id).populate({
            path: 'chatAllID',
            populate: [
                { path: 'userID', model: 'dentalusers' },
                { path: 'doctorID', model: 'dentaldoctors' }
            ]
        }).populate("userID").populate("doctorID");

        if (!single) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.send(single);

    } catch (err) {
        res.status(500).json(err);
    }
};




const getOneUserChat = async (req, res) => {
    try {
        let single = await DentalUser.findById(req.params._id).populate({
            path: 'chatArrayID',
            populate: [
                {
                    path: 'chatAllID',
                    populate: [
                        { path: 'userID', model: 'dentalusers' },
                        { path: 'doctorID', model: 'dentaldoctors' }
                    ]
                },
                {
                    path: 'userID', 
                    model: 'dentalusers'
                },
                {
                    path: 'doctorID', 
                    model: 'dentaldoctors'
                }
            ]
        });

        if (!single) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.send(single);

    } catch (err) {
        res.status(500).json(err);
    }
};



const getOneDoctorChat = async (req, res) => {
    try {
        let single = await DentalDoctors.findById(req.params._id).populate({
            path: 'chatArrayID',
            populate: [
                {
                    path: 'chatAllID',
                    populate: [
                        { path: 'userID', model: 'dentalusers' },
                        { path: 'doctorID', model: 'dentaldoctors' }
                    ]
                },
                {
                    path: 'userID', 
                    model: 'dentalusers'
                },
                {
                    path: 'doctorID', 
                    model: 'dentaldoctors'
                }
            ]
        });

        if (!single) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.send(single);

    } catch (err) {
        res.status(500).json(err);
    }
};






module.exports = { createArrayforChat, addNewChat, getChatDetails, getOneUserChat, getOneDoctorChat };