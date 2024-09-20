import axios from './Instance';

const API_URL = '/Coupon';

class CouponService {
    constructor(baseUrl = API_URL) {
        this.baseUrl = baseUrl;
    }

    // Fetch all coupons
    async getAllCoupons() {
        try {
            const response = await axios.get(`${this.baseUrl}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching coupons:", error);
            throw error;
        }
    }

    // Fetch a single coupon by ID
    async getCouponById(couponId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${couponId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching coupon with ID ${couponId}:`, error);
            console.log("Error Response Data:", error.response.data); // Inspect this for details
            throw error;
        }
    }

    // Create a new coupon
    async createCoupon(couponData) {
        try {
            const response = await axios.post(`${this.baseUrl}`, couponData);
            return response.data; // Return the created coupon data
        } catch (error) {
            console.error("Error creating coupon:", error);
            throw error;
        }
    }

    // Update an existing coupon
    async updateCoupon(couponId, couponDto) {
        try {
            await axios.put(`${this.baseUrl}/${couponId}`, couponDto);
        } catch (error) {
            console.error(`Error updating coupon with ID ${couponId}:`, error);
            throw error;
        }
    }

    // Delete a coupon by ID
    async deleteCoupon(couponId) {
        try {
            await axios.delete(`${this.baseUrl}/${couponId}`);
        } catch (error) {
            console.error(`Error deleting coupon with ID ${couponId}:`, error);
            throw error;
        }
    }
}

export default new CouponService();
