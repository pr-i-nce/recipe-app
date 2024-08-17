import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://recipe-app-0i3m.onrender.com',
});

export const getRecipes = () => api.get('/recipes');
export const getSupportMessages = () => api.get('/support');
export const sendSupportMessage = (message) => api.post('/support', message);

export default api;
