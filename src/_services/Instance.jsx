import axios from 'axios';
import SweetAlert from 'sweetalert2';

const instance = axios.create({
    baseURL: 'https://localhost:7048/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request Interceptor: Attach the token to every request if it exists
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // Handle request error here
    return Promise.reject(error);
});

// Response Interceptor: Handle rate limits and other response statuses
instance.interceptors.response.use(
    response => response, // Pass through successful responses
    error => {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            console.log(`Response status: ${status}`);
            console.log('Response data:', data);

            // Handle rate limit error (status 429)
            if (status === 429) {
                SweetAlert.fire({
                    icon: 'error',
                    title: 'Rate Limit Exceeded',
                    text: 'Too many requests. Please try again later.',
                });
            } else if (status === 401) {
                // Handle unauthorized access
                SweetAlert.fire({
                    icon: 'warning',
                    title: 'Unauthorized',
                    text: 'Your session has expired. Please log in again.',
                });

            }
        } else if (error.request) {
            // Handle network errors or no response from server
            console.error('Network error or no response received:', error.request);
            SweetAlert.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Unable to connect to the server. Please check your internet connection.',
            });
        } else {
            // Handle other errors
            console.error('Error', error.message);
            SweetAlert.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unknown error occurred. Please try again.',
            });
        }

        return Promise.reject(error);
    }
);

export default instance;
