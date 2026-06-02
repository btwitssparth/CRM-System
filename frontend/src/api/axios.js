import axios from 'axios';

// Create a centralized axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/tickets', // Pointing to your backend port!
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;