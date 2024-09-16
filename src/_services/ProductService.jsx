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

    async createProduct(productDto, imageFiles) {
        try {
            const formData = new FormData();

            // Append product details
            for (const key in productDto) {
                formData.append(key, productDto[key]);
            }

            // Append each image file if they exist
            if (imageFiles && imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    formData.append('imageFiles', imageFiles[i]);
                }
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
    async updateProduct(productId, productDto, imageFiles) {
        try {
            // Create a new FormData instance
            const formData = new FormData();

            // Append productDto as a JSON string
            formData.append('productDto', JSON.stringify(productDto));

            // Append each image file
            if (imageFiles && imageFiles.length > 0) {
                imageFiles.forEach((file, index) => {
                    formData.append('imageFiles', file);
                });
            }

            // Send the PUT request with FormData
            await axios.put(`${this.baseUrl}/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
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
    async getProductsByCategoryId(categoryId){
        try {
            const response = await axios.get(`${this.baseUrl}/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with categoryId ${categoryId}:`, error);
            throw error;
        }
    }

}

export default new ProductService();
