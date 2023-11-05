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


export default API;
