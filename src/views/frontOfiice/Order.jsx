import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Divider, Grid, Paper, TextField } from '@mui/material';
import Navbar from '../../components/Navbars/AuthNavbar';
import Footer from '../../components/Footers/Footer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OrderService from "../../_services/OrderService";
import UserService from "../../_services/UserService";
import AuthService from "../../_services/AuthService";
import SaveIcon from "@mui/icons-material/Save";

const Order = () => {
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [editShipping, setEditShipping] = useState(false);
    const [touched, setTouched] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [isFormValid, setIsFormValid] = useState(false);
    const [errors, setErrors] = useState({});
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
    });
    const [orderNotes, setOrderNotes] = useState('');
    const customerId= AuthService.getCurrentUser().id
    const [orderId, setOrderId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);

        const fetchUserData = async () => {
            try {
                const response = await UserService.getUserById(customerId);
                setUserData({
                    name: response.fullName,
                    email: response.email,
                    address: response.address,
                    phone: response.phoneNumber,
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [customerId]);
    useEffect(() => {
        validateForm();
    }, [userData]);


    useEffect(() => {
        // Retrieve totalAmount from local storage
        const storedTotal = localStorage.getItem('finalAmount');
        if (storedTotal) {
            setTotalAmount(Number(storedTotal));
        }
    }, []);
    const validateField = (name, value) => {
        let fieldErrors = { ...errors };
        let isValid = true;

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    fieldErrors.name = "Customer Name is required.";
                    isValid = false;
                } else if (value.length < 2) {
                    fieldErrors.name = "Customer Name must be at least 2 characters long.";
                    isValid = false;
                } else {
                    delete fieldErrors.name;
                }
                break;
            case 'address':
                if (!value.trim()) {
                    fieldErrors.address = "Customer Address is required.";
                    isValid = false;
                } else if (value.length < 10) {
                    fieldErrors.address = "Customer Address must be at least 10 characters long.";
                    isValid = false;
                } else {
                    delete fieldErrors.address;
                }
                break;
            case 'email':
                if (!value) {
                    fieldErrors.email = "Customer Email is required.";
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    fieldErrors.email = "Invalid email format.";
                    isValid = false;
                } else {
                    delete fieldErrors.email;
                }
                break;
            case 'phone':
                if (!value) {
                    fieldErrors.phone = "Phone Number is required.";
                    isValid = false;
                } else if (!/^\d{8,15}$/.test(value)) {
                    fieldErrors.phone = "Phone Number must be between 8 to 15 digits.";
                    isValid = false;
                } else {
                    delete fieldErrors.phone;
                }
                break;
            default:
                break;
        }

        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };


    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
        validateField(name, userData[name]);
    };

    const validateForm = () => {
        const hasErrors = Object.values(errors).some((error) => error);
        const hasEmptyFields = Object.values(userData).some((value) => value === '' || value === null);
        setIsFormValid(!hasErrors && !hasEmptyFields);
    };
    const handleFinalizeOrder = async () => {
        const orderData = {
            orderDate: new Date().toISOString(),
            shippedDate: null,
            orderStatus: 0, // 0 = Pending
            customerId: customerId,
            customerName: userData.name,
            customerEmail: userData.email,
            customerAddress: userData.address,
            customerPhone: userData.phone,
            orderNotes: orderNotes,
            TotlaAmount: totalAmount,
            orderItems: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity || 1,
                unitPrice: item.productPrice,
                TotalPrice:totalAmount,
            })),
        };

        console.log('Order Data:', orderData); // Log order data for inspection

        try {
            const response = await OrderService.createOrder(orderData);

            if (response && response.orderId) {
                setOrderId(response.orderId);

                await Swal.fire({
                    title: 'Order Placed',
                    text: 'Thank you for your order! You will receive a confirmation email shortly.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    background: '#fff',
                    color: '#333',
                    confirmButtonColor: '#4CAF50',
                });

                localStorage.removeItem('cart');
                localStorage.removeItem('totalAmount'); // Clear total amount
                localStorage.removeItem('finalAmount'); // Clear total amount

                navigate('/shop');

                console.log('Order Created Successfully:', response); // Log order creation response

            } else {
                throw new Error('Order creation failed, no orderId returned');
            }
        } catch (error) {
            console.error("Error placing order:", error);
            console.error("Error details:", error.response ? error.response.data : error.message);

            await Swal.fire({
                title: 'Order Failed',
                text: 'There was an error placing your order. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
                background: '#fff',
                color: '#333',
                confirmButtonColor: '#f44336',
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value,
        }));
        validateField(name, value);

    };

    const handleToggleShippingEdit = async () => {
        if (editShipping && orderId) {
            // Validate each field before proceeding
            const isNameValid = validateField('name', userData.name);
            const isEmailValid = validateField('email', userData.email);
            const isAddressValid = validateField('address', userData.address);
            const isPhoneValid = validateField('phone', userData.phone);

            // If any field is invalid, show an error and stop execution
            if (!isNameValid || !isEmailValid || !isAddressValid || !isPhoneValid) {
                await Swal.fire({
                    title: 'Invalid Data',
                    text: 'Please correct the errors in the shipping information.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    background: '#fff',
                    color: '#333',
                    confirmButtonColor: '#f44336',
                });
                return;
            }

            try {
                const updatedOrderData = {
                    customerName: userData.name,
                    customerEmail: userData.email,
                    customerAddress: userData.address,
                    customerPhone: userData.phone,
                    orderNotes: orderNotes,
                };
                await OrderService.updateOrder(orderId, updatedOrderData);
                await Swal.fire({
                    title: 'Update Successful',
                    text: 'Your shipping information has been updated.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    background: '#fff',
                    color: '#333',
                    confirmButtonColor: '#4CAF50',
                });
            } catch (error) {
                await Swal.fire({
                    title: 'Update Failed',
                    text: 'There was an error updating your information. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    background: '#fff',
                    color: '#333',
                    confirmButtonColor: '#f44336',
                });
            }
        }
        setEditShipping(!editShipping);
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: '7%', mb: '10%' }}>
                <Paper elevation={3} sx={{ padding: 3, mb: 4 }}>
                    <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f5f5f5', mb: 4, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            Complete Your Checkout
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Review your order details and complete your purchase.
                        </Typography>
                    </Paper>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={7}>
                            <Paper elevation={2} sx={{ padding: 3, mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Shipping Information</Typography>
                                    <Button onClick={handleToggleShippingEdit}
                                            disabled={!isFormValid}

                                    >
                                        {editShipping ? 'Save'  : 'Edit'}
                                    </Button>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                {editShipping ? (
                                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField label="Name" variant="outlined" name="name" value={userData.name} fullWidth
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                   error={!!errors.name}
                                                   helperText={errors.name}
                                        />
                                        <TextField label="Email" variant="outlined" name="email" value={userData.email} fullWidth
                                                   onChange={handleChange}
                                                       onBlur={handleBlur}
                                                       error={!!errors.email}
                                                       helperText={errors.email}

                                        />
                                        <TextField label="Address" variant="outlined" name="address" value={userData.address} fullWidth
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                   error={!!errors.address}
                                                   helperText={errors.address}
                                        />
                                        <TextField label="Phone" variant="outlined" name="phone" value={userData.phone} fullWidth
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                   error={!!errors.phone}
                                                   helperText={errors.phone}
                                        />
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="body1"><strong>Name:</strong> {userData.name}</Typography>
                                        <Typography variant="body1"><strong>Email:</strong> {userData.email}</Typography>
                                        <Typography variant="body1"><strong>Address:</strong> {userData.address}</Typography>
                                        <Typography variant="body1"><strong>Phone:</strong> {userData.phone}</Typography>
                                    </Box>
                                )}
                            </Paper>

                            <Paper elevation={2} sx={{ padding: 3, mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Order Notes</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <TextField
                                    label="Add notes or special instructions for your order"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    fullWidth
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Paper elevation={2} sx={{ padding: 3, position: 'sticky', top: '10%' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Order Summary</Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 3 }}>
                                    {cartItems.map((item) => (
                                        <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body1">{item.productName}</Typography>
                                            <Typography variant="body1">${item.finalPrice} x {item.quantity || 1}</Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">Total:</Typography>
                                    <Typography variant="h6">${totalAmount}</Typography>
                                </Box>

                                <Button variant="contained" color="primary" onClick={handleFinalizeOrder} fullWidth>
                                    Finalize Order
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <Footer />
        </>
    );
};

export default Order;
