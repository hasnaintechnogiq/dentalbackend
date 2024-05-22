const router = require('express').Router();
const authenticate = require('../authenticate');


const { checkotpnow, genarateOtpandsendtoemail,  getAllUsers, getSingleUser, addNewUser, updateUserDetail, deleteUser } = require('../controllers/user-controller.js');
const { addDoctorProfile, searchDoctorsByCity,searchDoctorsByName, findOneDoctorByID, getAllDoctors } = require('../controllers/doctor-controller.js');
const { addAppointmentFunction, findAllAppointofUserByID , findAllAppointofDoctorByID, getSingleAppointmwntWithDetails} = require('../controllers/appointment-controller.js');
// User routes

router.get("/all-users", getAllUsers)
router.get("/get-single-user/:_id", getSingleUser)
router.post("/user-create-profile", addNewUser)
router.put("/update-user-detail/:_id", updateUserDetail)
router.delete("/delete-user/:_id", deleteUser)
router.post("/genarate-otp-and-send", genarateOtpandsendtoemail)
router.post("/check-otp-now", checkotpnow)

// Doctor routes


router.post("/create-doctor-profile", addDoctorProfile)
router.post("/search-doctors-by-cities", searchDoctorsByCity)
router.get("/search/:key", searchDoctorsByName)
router.get("/get-single-doctor/:_id", findOneDoctorByID)
router.get("/all-doctors", getAllDoctors)

// Appointment routes

router.post("/book-appointment", addAppointmentFunction)
router.get("/get-single-user-with-appointment/:_id", findAllAppointofUserByID)
router.get("/get-single-doctor-with-appointment/:_id", findAllAppointofDoctorByID)
router.get("/get-single-appointment-with-details/:_id", getSingleAppointmwntWithDetails)

















module.exports = router;