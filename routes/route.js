const router = require('express').Router();
const authenticate = require('../authenticate');


const { updateFamilyRequestDetails, findUserDetailsWithStatus, addFamilyMember, searchUserByAllDetails, checkotpnow, genarateOtpandsendtoemail, getAllUsers, getSingleUser, addNewUser, updateUserDetail, deleteUser } = require('../controllers/user-controller.js');
const { findOneClinicByID, updateDoctorDetail, addDoctorProfile, searchDoctorsByCity, searchDoctorsByName, findOneDoctorByID, getAllDoctors } = require('../controllers/doctor-controller.js');
const { addAppointmentFunction, addAppointmentWithoutUser, findAllAppointofUserByID, findAllAppointofDoctorByID, getSingleAppointmwntWithDetails, updateAppointmentDetails, findOneOldTreatmentByID, addnoePrescription } = require('../controllers/appointment-controller.js');
const { createArrayforChat, addNewChat, getChatDetails, getOneUserChat, getOneDoctorChat } = require('../controllers/chat-controller.js');
const { addStaffFunction, findAllStaffofDoctorByID, findOneStaffByID } = require('../controllers/staff-controller.js');
const { createArrayforRating, getOneDoctorAllRatings, addNewTicket } = require('../controllers/extra-controller.js');


// User routes

router.get("/all-users", getAllUsers)
router.get("/get-single-user/:_id", getSingleUser)
router.post("/user-create-profile", addNewUser)
router.put("/update-user-detail/:_id", updateUserDetail)
router.delete("/delete-user/:_id", deleteUser)
router.post("/genarate-otp-and-send", genarateOtpandsendtoemail)
router.post("/check-otp-now", checkotpnow)
router.get("/search-user/:key", searchUserByAllDetails)
router.post("/add-new-member", addFamilyMember)
router.post("/find-User-Details-With-Status", findUserDetailsWithStatus)
router.put("/update-Family-Request-Details/:_id", updateFamilyRequestDetails)

// Doctor routes


router.post("/create-doctor-profile", addDoctorProfile)
router.post("/search-doctors-by-cities", searchDoctorsByCity)
router.get("/search/:key", searchDoctorsByName)
router.get("/get-single-doctor/:_id", findOneDoctorByID)
router.get("/all-doctors", getAllDoctors)
router.put("/update-doctor-detail/:_id", updateDoctorDetail)
router.get("/get-single-clinic/:_id", findOneClinicByID)


// Appointment routes

router.post("/book-appointment", addAppointmentFunction)
router.post("/book-appointment-without-user", addAppointmentWithoutUser)
router.get("/get-single-user-with-appointment/:_id", findAllAppointofUserByID)
router.get("/get-single-doctor-with-appointment/:_id", findAllAppointofDoctorByID)
router.get("/get-single-appointment-with-details/:_id", getSingleAppointmwntWithDetails)
router.put("/update-Appointment-Details/:_id", updateAppointmentDetails)
router.get("/find-One-Old-Treatment-By-ID/:_id", findOneOldTreatmentByID)
router.post("/add-prescription", addnoePrescription)

// Chat routes


router.post("/create-array-for-chat", createArrayforChat)
router.post("/add-new-chat", addNewChat)
router.get("/get-chat-with-details/:_id", getChatDetails)
router.get("/get-one-user-chat/:_id", getOneUserChat)
router.get("/get-one-doctor-chat/:_id", getOneDoctorChat)




// Staff routes



router.post("/add-new-staff", addStaffFunction)
router.get("/get-doctor-with-staff/:_id", findAllStaffofDoctorByID)
router.get("/get-one-staff-with-details/:_id", findOneStaffByID)







// Extra routes


router.post("/create-array-for-rating-appointment", createArrayforRating)
router.get("/get-one-doctor-all-rating/:_id", getOneDoctorAllRatings)
router.post("/create-ticket", addNewTicket)






module.exports = router;