import axios from './Instance';

const API_URL = '/Order';

class OrderService {
    constructor(baseUrl = API_URL) {
        this.baseUrl = baseUrl;
    }

    // Fetch all orders
    async getAllOrders() {
        try {
            const response = await axios.get(`${this.baseUrl}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }

    // Fetch a single order by ID
    async getOrderById(orderId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${orderId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching order with ID ${orderId}:`, error);
            throw error;
        }
    }

    // Fetch order products by ID
    async getOrderProductsById(orderId) {
        try {
            const response = await axios.get(`${this.baseUrl}/Orderproducts/${orderId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching products for order with ID ${orderId}:`, error);
            throw error;
        }
    }

    // Create a new order
    async createOrder(orderData) {
        try {
            const response = await axios.post(`${this.baseUrl}`, orderData);
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    }

    // Update an existing order with items
    async updateOrderWithItems(orderId, orderDto) {
        try {
            const response = await axios.put(`${this.baseUrl}/${orderId}`, orderDto);
            return response.data;
        } catch (error) {
            console.error(`Error updating order with ID ${orderId}:`, error);
            throw error;
        }
    }

    // Delete an order by ID
    async deleteOrder(orderId) {
        try {
            await axios.delete(`${this.baseUrl}/${orderId}`);
        } catch (error) {
            console.error(`Error deleting order with ID ${orderId}:`, error);
            throw error;
        }
    }

    // Remove a product from an order
    async removeProductFromOrder(orderId, productId) {
        try {
            await axios.delete(`${this.baseUrl}/${orderId}/products/${productId}`);
        } catch (error) {
            console.error(`Error removing product with ID ${productId} from order ${orderId}:`, error);
            throw error;
        }
    }


}

export default new OrderService();
