import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchFarmers = () => API.get('/farmers');
export const fetchGrievances = () => API.get('/grievances');
export const createGrievance = (data) => API.post('/grievances', data);
export const fetchRiskAssessments = () => API.get('/risk-assessments');

export default API;