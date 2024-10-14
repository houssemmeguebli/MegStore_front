import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, IconButton, TextField, Divider, CardMedia, Box, Container, Snackbar, Alert } from '@mui/material';
import { Remove, Add, Delete } from '@mui/icons-material';
import Navbar from "../../components/Navbars/AuthNavbar";
import Footer from "../../components/Footers/Footer";
import Swal from 'sweetalert2';
import CouponService from "../../_services/CouponService";
import CartService from "../../_services/CartService";
import AuthService from "../../_services/AuthService";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [UsageNumbers, setUsageNumbers] = useState(0);
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token')||sessionStorage.getItem('token'); // Replace with your actual auth check
    const storedCart = JSON.parse(localStorage.getItem('cart'))
    const formattedDate  = new Date().toISOString();

    useEffect(() => {

        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

        setCartItems(storedCart.map(item => ({ ...item, quantity: item.quantity || 1 })));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Store finalPrice in local storage
    useEffect(() => {
        const finalPrice = getTotalPrice() - discountAmount;
        localStorage.setItem('finalAmount', finalPrice.toFixed(2));
    }, [discountAmount, cartItems]);

    const handleQuantityChange = (productId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productId === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
            )
        );
    };

    const handleRemoveItem = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    };

    // Checkout logic retrieves finalPrice from local storage
    const totalAmount = cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0); // Calculate total amount

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Not Authenticated',
                text: 'Please log in or create an account to proceed.',
                icon: 'warning',
                confirmButtonText: 'Go to Login',
                cancelButtonText: 'Cancel',
                customClass: {
                    title: 'swal-title',
                    text: 'swal-text',
                    confirmButton: 'swal-confirm',
                    cancelButton: 'swal-cancel',
                },
                backdrop: `rgba(0, 0, 0, 0.4)`, // Optional: a stylish backdrop
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/auth/login', { state: { fromCart: true } });
                }
            });
        } else {
            const finalPrice = localStorage.getItem('finalAmount');

            // Create or update cart in the backend
            try {
                const cartData = {
                    CartItems: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity || 1,
                        unitPrice: item.productPrice,
                        TotalPrice:finalPrice,
                    })),
                    dateCreated: formattedDate,
                    totalAmount: finalPrice,
                    customerId: AuthService.getCurrentUser().id,
                };

                await CartService.createCart(cartData); // Make sure to implement this method in CartService

                // Navigate to the order page with the final price
                navigate('/order', { state: { finalPrice } });
            } catch (error) {
                console.error("Error updating cart:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'There was an issue updating your cart. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const handleDiscountCodeChange = (e) => {
        setDiscountCode(e.target.value);
    };

    const applyDiscount = async () => {
        if (discountCode.trim() === '') {
            setAlert({ open: true, message: 'Please enter a discount code.', severity: 'warning' });
            return;
        }

        try {
            const coupons = await CouponService.getAllCoupons();
            const validCoupon = coupons.find(coupon => coupon.code === discountCode);

            if (validCoupon) {
                if (!validCoupon.isActive) {
                    setAlert({ open: true, message: 'This discount code is inactive.', severity: 'error' });
                    return;
                }

                if (validCoupon.minimumOrderAmount > getTotalPrice()) {
                    setAlert({
                        open: true,
                        message: `The minimum order amount is $${validCoupon.minimumOrderAmount}. Please increase your total price.`,
                        severity: 'error'
                    });
                    return;
                }

                if (Date.now() < new Date(validCoupon.startDate)) {
                    setAlert({
                        open: true,
                        message: `This discount code is not yet active. It will be available from ${new Date(validCoupon.startDate).toLocaleDateString()}.`,
                        severity: 'error'
                    });
                    return;
                }

                if (Date.now() > new Date(validCoupon.expiryDate + 1)) {
                    setAlert({
                        open: true,
                        message: `This discount code has expired. It was valid until ${new Date(validCoupon.expiryDate).toLocaleDateString()}.`,
                        severity: 'error'
                    });
                    return;
                }

                if (validCoupon.usageLimit && validCoupon.timesUsed >= validCoupon.usageLimit) {
                    setAlert({
                        open: true,
                        message: `This discount code has reached its usage limit.`,
                        severity: 'error'
                    });
                    return;
                }

                const discount = validCoupon.discountPercentage || 0;
                const totalPrice = getTotalPrice();
                const discountAmount = (totalPrice * discount) / 100;

                setDiscountAmount(discountAmount);
                setDiscountPercentage(discount);
                setAlert({ open: true, message: 'Discount applied!', severity: 'success' });

                // Increment the usage number
                setUsageNumbers(prevCount => prevCount + 1);

                // Update the TimesUsed for the coupon
                const couponId = validCoupon.couponId;
                const updatedCouponDto = { ...validCoupon, timesUsed: validCoupon.timesUsed + 1 };

                await CouponService.updateCoupon(couponId, updatedCouponDto);
            } else {
                setAlert({
                    open: true,
                    message: 'Invalid discount code.',
                    severity: 'error'
                });
            }
        } catch (error) {
            setAlert({ open: true, message: 'Error validating discount code.', severity: 'error' });
        }
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) =>
            total + ((item.finalPrice || 0) * (item.quantity || 1)), 0
        );
    };

    const totalPrice = getTotalPrice();
    const finalPrice = totalPrice - discountAmount;

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '64px', paddingBottom: '32px', backgroundColor: '#f4f4f4', margin: "10%" }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 4 }}>
                        Your Cart
                    </Typography>
                    {cartItems.length === 0 ? (
                        <Box sx={{ textAlign: 'center', padding: 4, borderRadius: 1, boxShadow: 1, backgroundColor: 'white' }}>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Your cart is empty
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Looks like you haven't added anything to your cart yet.
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => navigate('/shop')} sx={{ marginTop: 2 }}>
                                Browse Products
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            {cartItems.map(item => (
                                <Box key={item.productId} sx={{ display: 'flex', alignItems: 'center', padding: 2, borderRadius: 1, boxShadow: 1, backgroundColor: 'white', marginBottom: 2 }}>
                                    <CardMedia
                                        component="img"
                                        alt={item.productName}
                                        height="120"
                                        image={item.imageUrls ? `http://megstore.runasp.net/${item.imageUrls[0]}` : 'https://via.placeholder.com/150'}
                                        sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1 }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                    <Box sx={{ flexGrow: 1, marginLeft: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.productName}</Typography>
                                        <Typography variant="body1">${item.finalPrice}</Typography>
                                        <Typography variant="body2" color="textSecondary">Total: ${(item.finalPrice * item.quantity).toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>
                                            <Remove />
                                        </IconButton>
                                        <TextField
                                            value={item.quantity}
                                            type="number"
                                            onChange={(e) => handleQuantityChange(item.productId, Math.max(1, parseInt(e.target.value)))}
                                            inputProps={{ min: 1 }}
                                            sx={{ width: 60, textAlign: 'center' }}
                                        />
                                        <IconButton onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>
                                            <Add />
                                        </IconButton>
                                        <IconButton onClick={() => handleRemoveItem(item.productId)} color="error">
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                            <Divider sx={{ marginY: 4 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Total Price: ${totalPrice.toFixed(2)}</Typography>
                                {discountAmount > 0 && (
                                    <Typography variant="h6" sx={{ color: 'green' }}>
                                        Discount ({discountPercentage}%): -${discountAmount.toFixed(2)}
                                    </Typography>
                                )}
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Final Price: ${finalPrice.toFixed(2)}
                                </Typography>
                            </Box>
                            <Divider sx={{ marginY: 4 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TextField
                                    label="Discount Code"
                                    value={discountCode}
                                    onChange={handleDiscountCodeChange}
                                    sx={{ width: '50%' }}
                                />
                                <Button variant="outlined" onClick={applyDiscount}>Apply Discount</Button>
                            </Box>
                            <Divider sx={{ marginY: 4 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCheckout}
                                    sx={{ padding: '10px 50px', fontSize: '16px', fontWeight: 'bold' }}
                                >
                                    Proceed to Checkout
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Container>
            </main>
            <Footer />
            <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Cart;
