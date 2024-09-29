import axios from './Instance';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = '/Auth';

class AuthService {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async register(userData) {
        try {
            console.log("Register request data:", userData);
            const response = await axios.post(`${this.baseUrl}/register`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("Register response data:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error registering:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async login(email, password) {
        try {
            const response = await axios.post(`${this.baseUrl}/login`, {
                email,
                password,
            });
            return response.data; // Ensure this contains the Token
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const response = await axios.post(`${this.baseUrl}/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');

            return response.data;
        } catch (error) {
            console.error('Error logging out:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async changePassword(userId, currentPassword, newPassword) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/change-password/${userId}`,
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'An error occurred while changing the password.';
        }
    }

    async forgotPassword(email) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/forgot-password`,
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error requesting PIN code:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async resetPassword(email, pinCode, newPassword) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/reset-password`,
                { email, pinCode, newPassword },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error resetting password:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    getCurrentUser() {
        // Retrieve token from either localStorage or sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (token) {
            try {
                // Decode the token
                const decodedToken = jwtDecode(token);

                // Return the extracted user details
                return {
                    id: decodedToken.id,
                    role: decodedToken.role,
                    email: decodedToken.email,
                    fullName: decodedToken.fullName,
                };
            } catch (error) {
                console.error('Error decoding token:', error);
                return null; // Return null in case of a decoding error
            }
        }

        return null; // Return null if no token is found
    }
}

export default new AuthService();
