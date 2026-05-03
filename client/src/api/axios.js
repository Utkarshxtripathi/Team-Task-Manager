import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (baseURL.endsWith('/api')) {
  baseURL = baseURL.slice(0, -4);
} else if (baseURL.endsWith('/api/')) {
  baseURL = baseURL.slice(0, -5);
}

const api = axios.create({
  baseURL,
});

// JWT interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;