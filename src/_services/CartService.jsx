import axios from './Instance'; // Importing the axios instance

const API_URL = '/Cart'; // Define the API endpoint for the cart

class CartService {
    constructor(baseUrl = API_URL) {
        this.baseUrl = baseUrl; // Set the base URL
    }

    // Fetch all carts
    async getAllCarts() {
        try {
            const response = await axios.get(`${this.baseUrl}`);
            return response.data; // Return the data from the response
        } catch (error) {
            console.error("Error fetching carts:", error);
            throw error; // Re-throw the error to handle it in the calling code
        }
    }

    // Fetch a single cart by ID
    async getCartById(cartId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${cartId}`);
            return response.data; // Return the cart data
        } catch (error) {
            console.error(`Error fetching cart with ID ${cartId}:`, error);
            console.log("Error Response Data:", error.response.data); // Inspect this for details
            throw error; // Re-throw the error
        }
    }
    async GetCartsForCustomer(customerId) {
        try {
            const response = await axios.get(`https://localhost:7048/customerCarts/${customerId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching cart for customer ID ${customerId}:`, error);
            if (error.response && error.response.data) {
                console.log('Error Response Data:', error.response.data); // Inspect this for more details
            }
            throw error; // Re-throw the error to handle it in the calling function
        }
    }


    // Create a new cart
    async createCart(cartData) {
        try {
            const response = await axios.post(`${this.baseUrl}`, cartData);
            return response.data; // Return the created cart data
        } catch (error) {
            console.error("Error creating cart:", error);
            throw error; // Re-throw the error
        }
    }

    // Update an existing cart
    async updateCart(cartId, cartDto) {
        try {
            await axios.put(`${this.baseUrl}/${cartId}`, cartDto); // Send the update request
        } catch (error) {
            console.error(`Error updating cart with ID ${cartId}:`, error);
            throw error; // Re-throw the error
        }
    }

    // Delete a cart by ID
    async deleteCart(cartId) {
        try {
            await axios.delete(`${this.baseUrl}/${cartId}`); // Send the delete request
        } catch (error) {
            console.error(`Error deleting cart with ID ${cartId}:`, error);
            throw error; // Re-throw the error
        }
    }
}

export default new CartService();