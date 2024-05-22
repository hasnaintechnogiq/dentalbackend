const Notification = require('../models/Notification.js');
const NotificationArray = require('../models/NotificationArray.js');
const NotificationsForAll = require('../models/NotificationsForAll.js');
const User = require('../models/User.js');
const Manager = require('../models/Manager.js');

const mongoose = require('mongoose');

const getAllNotification = async (req, res) => {
    try {
        let notification = await Notification.find();
        res.send(notification)
    } catch (err) {
        res.status(500).json(err);
    }
};



const addNewNotification = async (req, res) => {
    // try {
    //     let notification = new Notification(req.body);
    //     const result = await notification.save();
    //     res.send(result);
    // } catch (err) {
    //     res.status(500).json(err);
    // }
};


const deleteNotification = async (req, res) => {
    // try {
    //     let data = await Notification.deleteOne(req.params);
    //     res.send(data);
    // } catch (error) {
    //     res.status(500).json(error);
    // }
};



// New Work Start

const updateNotification = async (req, res) => {
    try {
        console.log(req.params)
        let data = await NotificationsForAll.updateOne(
            req.params,
            { $set: req.body }
        );
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getSingleNotification = async (req, resp) => {
    try {
        let single = await NotificationArray.findOne({ _id: req.params._id }).populate("notificationsforallID");
        resp.send(single);
    } catch (err) {
        res.status(500).json(err);
    }
};




const convertToContractNotificationForAll = async (req, resp) => {
    try {

        // let notificationall = new NotificationsForAll(objecttosave);
        // const resultnew = await notificationall.save();
        // let objIDnew = new mongoose.Types.ObjectId(notificationall.id)
        // const forSearch = "Lead Manager"
        // const updateResult = await NotificationArray.updateMany(
        //     { role: forSearch },
        //     {
        //         $push: {
        //             notificationsforallID: objIDnew
        //         }
        //     }

        // );

        const forSearch = "Lead Manager"
        NotificationArray.find({ role: forSearch })
            .then((results) => {
                console.log('Documents found:', results);

                const objecttosave = {
                    pathtoredirect: 'LEAD DETAILS',
                    idtogetdata: req.body.leadID,
                    notificationtypeorsection: 'The Client has successfully created the contract.',
                    iconname: 'content-paste',
                    param2userID: req.body.param2userID,
                }

                async function saveDataSeq() {
                    for (let i = 0; i < results.length; i++) {
                        try {
                            let notificationall = new NotificationsForAll(objecttosave);
                            const resultnew = await notificationall.save();
                            let objIDnew = new mongoose.Types.ObjectId(notificationall.id)
                            let newss = new mongoose.Types.ObjectId(results[i]._id)

                            await NotificationArray.updateOne(
                                { _id: newss },
                                {
                                    $push: {
                                        notificationsforallID: objIDnew
                                    }
                                }
                            )
                        } catch (error) {
                            console.error('Error saving data:', error);
                        }
                    }
                }
                saveDataSeq();



            })
            .catch((error) => {
                console.error('Error finding documents:', error);
            });

        resp.send({ message: "Done" });
    } catch (err) {
        res.status(500).json(err);
    }
};





const quotationFinalizeBytheClient = async (req, resp) => {
    try {
        const forSearch = "Lead Manager"
        NotificationArray.find({ role: forSearch })
            .then((results) => {
                console.log('Documents found:', results);

                const objecttosave = {
                    pathtoredirect: 'LEAD DETAILS',
                    idtogetdata: req.body.leadID,
                    notificationtypeorsection: 'The Client has successfully finalized the quotation.',
                    iconname: 'notebook-check',
                    param2userID: req.body.param2userID,
                }

                async function saveDataSen() {
                    for (let i = 0; i < results.length; i++) {
                        try {
                            let notificationall = new NotificationsForAll(objecttosave);
                            const resultnew = await notificationall.save();
                            let objIDnew = new mongoose.Types.ObjectId(notificationall.id)
                            let newss = new mongoose.Types.ObjectId(results[i]._id)

                            await NotificationArray.updateOne(
                                { _id: newss },
                                {
                                    $push: {
                                        notificationsforallID: objIDnew
                                    }
                                }
                            )
                        } catch (error) {
                            console.error('Error saving data:', error);
                        }
                    }
                }
                saveDataSen();
            })
            .catch((error) => {
                console.error('Error finding documents:', error);
            });

        resp.send({ message: "Done" });
    } catch (err) {
        res.status(500).json(err);
    }
};









const statusofTicketChange = async (req, resp) => {
    try {
        const objecttosave = {
            pathtoredirect: 'TicketDetails',
            idtogetdata: req.body.queryid,
            notificationtypeorsection: 'Ticket status has been changed!',
            iconname: 'rotate-orbit',
        }

        let notificationall = new NotificationsForAll(objecttosave);
        const resultnew = await notificationall.save();
        let objIDnew = new mongoose.Types.ObjectId(notificationall.id)


        const useridcheck = req.body.userID

        if (useridcheck) {
            let single = await User.findOne({ _id: useridcheck })

            let notifiIDes = single.notificationarrayID

            console.log("go", notifiIDes);
            await NotificationArray.updateOne(
                { _id: notifiIDes },
                {
                    $push: {
                        notificationsforallID: objIDnew
                    }
                }
            )
        }

        return resp.send(resultnew);
    } catch (err) {
        resp.status(500).json(err);
    }
};


const statusofInstallmentisChange = async (req, resp) => {
    try {
        const objecttosave = {
            pathtoredirect: 'InstallmentDetails',
            idtogetdata: req.body.installmentID,
            notificationtypeorsection: 'Installment status has been changed!',
            iconname: 'format-rotate-90',
        }

        let notificationall = new NotificationsForAll(objecttosave);
        const resultnew = await notificationall.save();
        let objIDnew = new mongoose.Types.ObjectId(notificationall.id)


        const useridcheck = req.body.userID

        if (useridcheck) {
            let single = await User.findOne({ _id: useridcheck })

            let notifiIDes = single.notificationarrayID

            console.log("go", notifiIDes);
            await NotificationArray.updateOne(
                { _id: notifiIDes },
                {
                    $push: {
                        notificationsforallID: objIDnew
                    }
                }
            )
        }

        return resp.send(resultnew);
    } catch (err) {
        resp.status(500).json(err);
    }
};










const newQuotationaddednotification = async (req, resp) => {
    try {
        const objecttosave = {
            pathtoredirect: 'QuotationListClient',
            idtogetdata: req.body.leadID,
            notificationtypeorsection: 'A new quotation has been added!',
            iconname: 'notebook-plus',
        }

        let notificationall = new NotificationsForAll(objecttosave);
        const resultnew = await notificationall.save();
        let objIDnew = new mongoose.Types.ObjectId(notificationall.id)

        const useridcheck = req.body.userID

        if (useridcheck) {
            let single = await User.findOne({ _id: useridcheck })

            let notifiIDes = single.notificationarrayID

            console.log("go", notifiIDes);
            await NotificationArray.updateOne(
                { _id: notifiIDes },
                {
                    $push: {
                        notificationsforallID: objIDnew
                    }
                }
            )
        }

        return resp.send(resultnew);
    } catch (err) {
        resp.status(500).json(err);
    }
};









const clientAprrovedCo = async (req, resp) => {
    try {
        const objecttosave = {
            pathtoredirect: 'ManagChangeOrderDetails',
            idtogetdata: req.body.changeorderinstallmentid,
            notificationtypeorsection: 'The client has approved CO',
            iconname: 'note-check-outline',
            param2userID: req.body.param2userID,
        }

        let notificationall = new NotificationsForAll(objecttosave);
        const resultnew = await notificationall.save();
        let objIDnew = new mongoose.Types.ObjectId(notificationall.id)

        const mangidcheck = req.body.managerID

        if (mangidcheck) {
            let single = await Manager.findOne({ _id: mangidcheck })

            let notifiIDes = single.notificationarrayID

            console.log("go", notifiIDes);
            await NotificationArray.updateOne(
                { _id: notifiIDes },
                {
                    $push: {
                        notificationsforallID: objIDnew
                    }
                }
            )
        }

        return resp.send(resultnew);
    } catch (err) {
        resp.status(500).json(err);
    }
};









module.exports = { clientAprrovedCo, newQuotationaddednotification, statusofInstallmentisChange, statusofTicketChange, quotationFinalizeBytheClient, convertToContractNotificationForAll, getAllNotification, getSingleNotification, addNewNotification, updateNotification, deleteNotification };