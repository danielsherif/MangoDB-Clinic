import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4000', // backend API URL
    timeout: 5000, // Timeout duration
    headers: {
        'Content-Type': 'application/json',
    },
});

//API requests
export const getPatients = () => API.get('/patients');
export const addPatient = (patient) => API.post('/patientRegistration', patient);

export const getDoctor = (id) => API.get(`doctor/doctorInfo/${ id }`);
export const getPatientsDoctor = (id) => API.get(`/doctor/viewAllPatients/${ id }`);
export const searchPatients = (id) => API.get(`/doctor/searchPatientByName/${ id }`);
export const selectPatient = (id) => API.get(`/doctor/selectedPatient/${ id }`);

export const updateDoctorEmail = (id, doctor) => API.put(`/doctor/updateEmail/${ id }`, doctor);
export const updateDoctorRate = (id, doctor) => API.put(`/doctor/updateHourlyRate/${ id }`, doctor);
export const updateDoctorAffiliation = (id, doctor) => API.put(`/doctor/updateAffiliation/${id}`, doctor);

export default API;