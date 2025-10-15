
import axios from 'axios';

export  const baseUrl ="https://api.ventureconsultancyservices.com/hms/"
axios.defaults.baseURL = baseUrl;

// Create an Axios instance
const apiClient = axios.create({
    baseURL: baseUrl,
});

// Add a request interceptor to set the Authorization header dynamically
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    // Handle the error here
    return Promise.reject(error);
});

export default apiClient;

