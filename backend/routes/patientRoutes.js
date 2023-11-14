const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protectPatient } = require("../middleware/patientMiddleware");

const {
	getMyInfo,
	getAllPatients,
	getPatient,
	addPatient,
	updatePatient,
	deletePatient,
	addFamilyMember,
	getFamilyMembers,
	getSelectedDoctor,
	getAllPrescriptions,
	getAllPrescriptionsOfPatient,
	filterPrescription,
	selectPrescription,
	filterDoctors,
	searchDoctor,
	viewAllDoctors,
	getAllAppointments,
	filterAppointments,
	addAppointment,
	addPrescription,
	viewHealthRecords,
	viewHealthPackages,
	viewSubscribedhealthPackage,
	viewWallet,
	addDocuments,
	deleteDocument,
	linkFamilyMember,
	subscribeToHealthPackage,
	upcoming,
	filterStatus,
	payFromWallet,
	cancelHealthPackage,
	getSpecialities,
	loginPatient,
	resetPassword,
	sendOTP,
	verifyOTP,
	getAvailableAppointments,
	makeAppointment,
} = require("../controllers/patientController");

router.get("/myInfo", getMyInfo);

router.post("/login", loginPatient);
router.get("/request-otp",  sendOTP);
router.post("/verify-otp",  verifyOTP);
router.post("/reset-password",  resetPassword);

//GET all patients
router.get("/get_all_patients", getAllPatients);

//GET a single patient
router.post("/get_patient", getPatient);

//POST a single patient
router.post("/add_patient", addPatient);

//DELETE a single patient
router.delete("/delet_patient/:id",  deletePatient);

//UPDATE a single patient
router.put("/update_patient/:id",  updatePatient);

router.put("/add_family_member/:id",  addFamilyMember);

router.get("/get_family_members/:id",  getFamilyMembers);

router.get("/get_selected_doctor/:id",  getSelectedDoctor);

router.get("/get_all_prescriptions/:id",  getAllPrescriptions);

//GET all prescriptions of a single patient
router.get(
	"/get_prescriptions_of_patient/",
	
	getAllPrescriptionsOfPatient
);

//filter prescriptions
router.get(
	"/filter_prescription/:patientId",
	
	filterPrescription
);

//select a prescription from my list of prescriptions
router.get(
	"/select_prescription/:prescriptionId",
	
	selectPrescription
);

router.get("/get_all_doctors/:id",  viewAllDoctors);

router.get("/filter_doctors/:id",  filterDoctors);

router.get("/get_all_appointments/:id",  getAllAppointments);

router.get("/filter_appointments/:id",  filterAppointments);

router.get("/search_doctor/:id",  searchDoctor);

router.get("/view_health_records/:id",  viewHealthRecords);

router.get("/view_health_packages", viewHealthPackages);

router.get(
	"/view_subscribed_health_package/:id",
	
	viewSubscribedhealthPackage
);

router.put("/cancel_health_package/:id",  cancelHealthPackage);

router.get("/view_wallet/:id",  viewWallet);

router.put(
	"/add_documents/:id",
	
	upload.array("document"),
	addDocuments
);

router.delete(
	"/delete_document/:patientId/:documentId",
	
	deleteDocument
);

router.put("/link_family_member/:id",  linkFamilyMember);

router.put(
	"/subscribe_to_health_package/:patientId/:packageId",
	
	subscribeToHealthPackage
);

// utils
router.post(
	"/add_prescription/:doctorId/:patientId",
	
	addPrescription
);
router.post(
	"/add_appointment/:doctorId/:patientId",
	
	addAppointment
);
router.get("/get_specialities", getSpecialities);
router.get("/getAvailableAppointments", getAvailableAppointments);

router.get(
	"/get_available_appointments/:id",
	
	getAvailableAppointments
);

router.post("/make_appointment/:id",  makeAppointment);

router.post("/upcoming", upcoming);

router.post("/filterapp/:id",  filterStatus);

router.post("/payFromWallet/:appointmentId",  payFromWallet);

module.exports = router;
