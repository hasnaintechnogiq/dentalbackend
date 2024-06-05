const router = require('express').Router();
const authenticate = require('../authenticate');


const { updateFamilyRequestDetails, findUserDetailsWithStatus, addFamilyMember, searchUserByAllDetails, checkotpnow, genarateOtpandsendtoemail, getAllUsers, getSingleUser, addNewUser, updateUserDetail, deleteUser } = require('../controllers/user-controller.js');
const {updateDoctorDetail, addDoctorProfile, searchDoctorsByCity, searchDoctorsByName, findOneDoctorByID, getAllDoctors } = require('../controllers/doctor-controller.js');
const { addAppointmentFunction, findAllAppointofUserByID, findAllAppointofDoctorByID, getSingleAppointmwntWithDetails, updateAppointmentDetails } = require('../controllers/appointment-controller.js');
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

// Appointment routes

router.post("/book-appointment", addAppointmentFunction)
router.get("/get-single-user-with-appointment/:_id", findAllAppointofUserByID)
router.get("/get-single-doctor-with-appointment/:_id", findAllAppointofDoctorByID)
router.get("/get-single-appointment-with-details/:_id", getSingleAppointmwntWithDetails)
router.put("/update-Appointment-Details/:_id", updateAppointmentDetails)





module.exports = router;