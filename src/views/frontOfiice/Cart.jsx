import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, IconButton, TextField, Divider, CardMedia, Box, Container, Snackbar, Alert } from '@mui/material';
import { Remove, Add, Delete } from '@mui/icons-material';
import Navbar from "../../components/Navbars/AuthNavbar";
import Footer from "../../components/Footers/Footer";
import Swal from 'sweetalert2';
import CouponService from "../../_services/CouponService";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart.map(item => ({ ...item, quantity: item.quantity || 1 })));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const finalPrice = getTotalPrice() - discountAmount;
        localStorage.setItem('finalAmount', finalPrice.toFixed(2));
    }, [discountAmount, cartItems]); // Update when discountAmount or cartItems change

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

    const handleCheckout = () => {
        navigate('/order', { state: { finalPrice } }); // Pass final price to order
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
                const discount = validCoupon.discountPercentage || 0;
                const totalPrice = getTotalPrice();
                const discountAmount = (totalPrice * discount) / 100;

                setDiscountAmount(discountAmount);
                setDiscountPercentage(discount);
                setAlert({ open: true, message: 'Discount applied!', severity: 'success' });
            } else {
                setAlert({ open: true, message: 'Invalid discount code.', severity: 'error' });
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
            total + ((item.productPrice || 0) * (item.quantity || 1)), 0
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
                                        image={item.imageUrls ? `https://localhost:7048/${item.imageUrls[0]}` : 'https://via.placeholder.com/150'}
                                        sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1 }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                    <Box sx={{ flexGrow: 1, marginLeft: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.productName}</Typography>
                                        <Typography variant="body1">${(item.productPrice || 0).toFixed(2)}</Typography>
                                        <Typography variant="body2" color="textSecondary">Total: ${(item.productPrice * item.quantity).toFixed(2)}</Typography>
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
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 600 }}>
                                    <TextField
                                        value={discountCode}
                                        onChange={handleDiscountCodeChange}
                                        label="Discount Code"
                                        variant="outlined"
                                        sx={{ marginBottom: 2, width: '100%' }}
                                    />
                                    <Button variant="contained" color="secondary" onClick={applyDiscount} sx={{ width: '100%' }}>
                                        Apply Discount
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 4, width: '100%', maxWidth: 600 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                        Total: ${(totalPrice).toFixed(2)}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, color: 'green' }}>
                                        Discount ({discountPercentage}%): -${discountAmount.toFixed(2)}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                        Final Total: ${finalPrice.toFixed(2)}
                                    </Typography>
                                    <Link to={"/order"}>
                                        <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ width: '100%' }}>
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                </Box>
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
