import axios from './Instance';

const API_URL = '/Category';

class CategoryService {
    constructor(baseUrl = API_URL) {
        this.baseUrl = baseUrl;
    }

    // Fetch all categories
    async getAllCategories() {
        try {
            const response = await axios.get(`${this.baseUrl}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    }

    // Fetch a single category by ID
    async getCategoryById(categoryId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category with ID ${categoryId}:`, error);
            console.log("Error Response Data:", error.response.data);  // Inspect this for details

            throw error;
        }
    }

    // Create a new category with optional image upload
    async  createCategory (categoryData) {
        return await axios.post(`${this.baseUrl}`, categoryData);
    }

    // Update an existing category
    async updateCategory(categoryId, categoryDto) {
        try {
            await axios.put(`${this.baseUrl}/${categoryId}`, categoryDto);
        } catch (error) {
            console.error(`Error updating category with ID ${categoryId}:`, error);
            throw error;
        }
    }

    // Delete a category by ID
    async deleteCategory(categoryId) {
        try {
            await axios.delete(`${this.baseUrl}/${categoryId}`);
        } catch (error) {
            console.error(`Error deleting category with ID ${categoryId}:`, error);
            throw error;
        }
    }
}

export default new CategoryService();
