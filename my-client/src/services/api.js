import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

export const getRecipes = () => api.get('/recipes');
export const getSupportMessages = () => api.get('/support');
export const sendSupportMessage = (message) => api.post('/support', message);

export default api;
