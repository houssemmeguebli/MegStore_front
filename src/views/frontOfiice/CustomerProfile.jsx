import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Button } from "@mui/material";
import UserService from "../../_services/UserService";
import CouponService from "../../_services/CouponService"; // Import the CouponService
import CustomerOrders from "../../components/AdminComponents/Customers/CustomerOrders";
import Navbar from "../../components/Navbars/AuthNavbar";
import Footer from "../../components/Footers/Footer";
import CustomerInfo from "../../components/FrontOfficeComponents/Customer/CustomerInfo";
import AuthService from "../../_services/AuthService";

const CustomerProfile = () => {
    const customerId = AuthService.getCurrentUser().id; // Static value for now, can use useParams() for dynamic routing later
    const [user, setUser] = useState(null);
    const [coupons, setCoupons] = useState([]); // State to hold coupons
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            setLoading(true); // Show loading indicator
            try {
                const customer = await UserService.getUserById(customerId); // Fetch customer data by ID
                setUser(customer);
                const availableCoupons = await CouponService.getAllCoupons(); // Fetch available coupons
                setCoupons(availableCoupons);
            } catch (err) {
                console.error("Failed to fetch customer details:", err);
            } finally {
                setLoading(false); // Hide loading indicator
            }
        };
        fetchCustomerDetails();
    }, [customerId]);

    return (
        <>
            <Navbar transparent />
            <div className="container mx-auto p-6 space-y-6">
                {loading ? ( // Loading indicator
                    <div className="flex justify-center items-center" style={{ height: "100vh" }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div>
                        {/* Decorative Background Section */}
                        <div className="bg-gradient-to-r from-blue-200 to-purple-200 p-8 rounded-lg shadow-lg mb-6" style={{ marginTop: "10%" }}>
                            <Typography variant="h4" align="center">
                                Welcome back, {user?.fullName}!
                            </Typography>
                            <Typography variant="body1" align="center">
                                We're glad to have you here. Explore your profile and orders.
                            </Typography>
                        </div>

                        {/* Customer Info Section */}
                        <div className="bg-white p-6 shadow-lg rounded-lg" style={{ marginBottom: "5%", padding: "2%" }}>
                            {user ? (
                                <CustomerInfo currentUser={user} />
                            ) : (
                                <Typography variant="body1">Customer details not found.</Typography>
                            )}
                        </div>

                        {/* Customer Orders Section */}
                        <div className="bg-white p-6 shadow-lg rounded-lg" style={{ marginBottom: "15%", padding: "2%" }}>
                            <Typography variant="h4" align="center" className="mb-4">Your Orders</Typography>
                            {user ? (
                                <CustomerOrders user={user} />
                            ) : (
                                <Typography variant="body1">Customer details not found.</Typography>
                            )}
                        </div>

                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CustomerProfile;
