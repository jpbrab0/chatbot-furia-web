import axios from 'axios';

const api = axios.create({
  baseURL: 'http://18.188.204.58/',
  timeout: 15000,
});

export default api