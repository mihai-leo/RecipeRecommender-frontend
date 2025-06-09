import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // adjust if needed
});

export default api;
