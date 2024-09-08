import axios from './Instance';

const API_URL = '/Product';

class ProductService {
    constructor(baseUrl = API_URL) {
        this.baseUrl = baseUrl;
    }

    // Fetch all products
    async getAllProducts() {
        try {
            const response = await axios.get(`${this.baseUrl}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    // Fetch a single product by ID
    async getProductById(productId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with ID ${productId}:`, error);
            throw error;
        }
    }

    // Create a new product with image upload
    async createProduct(productDto, imageFile) {
        try {
            const formData = new FormData();

            // Append product details
            for (const key in productDto) {
                formData.append(key, productDto[key]);
            }

            // Append the image file if it exists
            if (imageFile) {
                formData.append('imageFile', imageFile);
            }

            const response = await axios.post(`${this.baseUrl}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    // Update an existing product
    async updateProduct(productId, productDto) {
        try {
            await axios.put(`${this.baseUrl}/${productId}`, productDto);
        } catch (error) {
            console.error(`Error updating product with ID ${productId}:`, error);
            throw error;
        }
    }

    // Delete a product by ID
    async deleteProduct(productId) {
        try {
            await axios.delete(`${this.baseUrl}/${productId}`);
        } catch (error) {
            console.error(`Error deleting product with ID ${productId}:`, error);
            throw error;
        }
    }
}

export default new ProductService();
