import axios from './Instance'; // Adjust the import path as needed

const API_URL = '/User'; // Adjust the URL if necessary

class UserService {
    constructor(baseUrl = API_URL) {
        this.baseUrl = baseUrl;
    }

    // Fetch all users
    async getAllUsers() {
        try {
            const response = await axios.get(`${this.baseUrl}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }
    async GetUsersWithRole(role) {
        try {
            const response = await axios.get(`${this.baseUrl}/users/${role}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    // Fetch a single user by ID
    async getUserById(userId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user with ID ${userId}:`, error);
            throw error;
        }
    }
    async GetOrdersByCustomerIdAsync(userId) {
        try {
            const response = await axios.get(`${this.baseUrl}/customerOrders/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching Orders with customerId ${userId}:`, error);
            throw error;
        }
    }

    // Update an existing user
    async updateUser(userId, userDto) {
        try {
            await axios.put(`${this.baseUrl}/${userId}`, userDto);
        } catch (error) {
            console.error(`Error updating user with ID ${userId}:`, error);
            throw error;
        }
    }

    // Delete a user by ID
    async deleteUser(userId) {
        try {
            await axios.delete(`${this.baseUrl}/${userId}`);
        } catch (error) {
            console.error(`Error deleting user with ID ${userId}:`, error);
            throw error;
        }
    }
}

export default new UserService();
