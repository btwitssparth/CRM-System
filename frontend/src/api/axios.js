import axios from 'axios';

const api = axios.create({
  // Now it dynamically pulls the URL from your .env file!
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;