import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URI,
  timeout: 15000,
});

export default api