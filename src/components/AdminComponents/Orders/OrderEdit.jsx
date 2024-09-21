import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, Typography, Paper, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import OrderService from "../../../_services/OrderService";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderEdit = () => {
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { orderId } = useParams();
    const [formData, setFormData] = useState({
        orderDate: '',
        customerName: '',
        customerAddress: '',
        orderStatus: 0,
        products: [],
        customerEmail: '',
        customerPhone: '',
        orderNotes: '',

    });
    const [error, setError] = useState('');
    const [isProductEditEnabled, setIsProductEditEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const fetchedOrder = await OrderService.getOrderProductsById(orderId);
                console.log("Fetched Order Data:", fetchedOrder);

                // Extract products from orderItems
                const products = fetchedOrder.orderItems.map(item => ({
                    orderItemId: item.orderItemId,
                    productId: item.productId,
                    productName: item.product.productName,
                    productPrice: item.product.productPrice,
                    itemQuantity: item.quantity, // Adjusted field name
                    imageUrl: item.product.imageUrl,
                }));

                setOrder(fetchedOrder);
                setFormData({
                    orderDate: fetchedOrder.orderDate.split('T')[0],
                    customerName: fetchedOrder.customerName,
                    customerAddress: fetchedOrder.customerAddress,
                    orderStatus: fetchedOrder.orderStatus,
                    customerEmail: fetchedOrder.customerEmail || "",
                    customerPhone: fetchedOrder.customerPhone || "",
                    orderNotes: fetchedOrder.orderNotes || "",
                    totlaAmount:totalAmount,
                    products: products || [],
                });
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError('Failed to fetch order data');
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch order data.',
                });
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const newProducts = [...formData.products];
        const updatedProduct = { ...newProducts[index], [name]: parseInt(value, 10) };

        newProducts[index] = updatedProduct;
        setFormData({
            ...formData,
            products: newProducts,
        });
    };

    const handleProductRemove = async (index) => {
        const orderItemIdToRemove = formData.products[index].orderItemId;

        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This product will be removed from the order.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
        });

        if (confirm.isConfirmed) {
            try {
                await OrderService.updateOrderWithItems(orderId, {
                    ...formData,
                    products: formData.products.filter((_, i) => i !== index),
                });
                setFormData(prevState => ({
                    ...prevState,
                    products: prevState.products.filter((_, i) => i !== index),
                }));
                Swal.fire({
                    icon: 'success',
                    title: 'Product Removed',
                    text: 'The product was successfully removed from the order.',
                });
            } catch (err) {
                console.error("Error removing product:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Failed to remove the product. ${err.response?.data?.message || err.message}`,
                });
            }
        }
    };

    const handleSave = async () => {
        const requestPayload = {
            orderId: parseInt(orderId, 10), // Use the correct orderId from params
            orderDate: formData.orderDate,
            customerId: order.customerId,
            customerName: formData.customerName || '',
            customerAddress: formData.customerAddress || '',
            orderStatus: formData.orderStatus || 0,
            customerEmail: formData.customerEmail || '',
            customerPhone: formData.customerPhone || '',
            orderNotes: formData.orderNotes || '',
            totlaAmount:totalAmount,
            orderItems: formData.products.map(product => ({
                orderItemId: product.orderItemId || 0, // Ensure orderItemId is sent, or default to 0 for new items
                quantity: product.itemQuantity,
                totalPrice: product.itemQuantity * product.productPrice, // Calculate totalPrice for each item
            })),
        };
        // Check if the order status is Shipped (1)
        if (formData.orderStatus === 1) {
            requestPayload.shippedDate = new Date().toISOString();
        }
        console.log("Request Payload:", requestPayload);

        try {
            await OrderService.updateOrderWithItems(orderId, requestPayload);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Order updated successfully',
            });
            navigate(`/admin/orders/${orderId}`);
        } catch (err) {
            console.error("Error updating order:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to update order. ${err.response?.data?.message || err.message}`,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave();
    };

    const handleToggleProductEdit = () => {
        setIsProductEditEnabled(!isProductEditEnabled);
    };

    const calculateTotalPrice = () => {
        return formData.products.reduce((total, product) => {
            return total + (product.itemQuantity * product.productPrice);
        }, 0).toFixed(2);
    };
    const totalAmount = calculateTotalPrice();

    if (isLoading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    return (
        <Box sx={{ m: 8, mx: 'auto', maxWidth: '1200px', padding: 3 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Edit Order
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Order Date"
                                type="date"
                                name="orderDate"
                                value={formData.orderDate}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Customer Name"
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Customer Address"
                                type="text"
                                name="customerAddress"
                                value={formData.customerAddress}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Customer Email"
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Customer Phone"
                                type="text"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="order-status-label">Order Status</InputLabel>
                                <Select
                                    labelId="order-status-label"
                                    name="orderStatus"
                                    value={formData.orderStatus}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value={0}>Pending</MenuItem>
                                    <MenuItem value={1}>Shipped</MenuItem>
                                    <MenuItem value={2}>Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Order Notes"
                                type="text"
                                name="orderNotes"
                                value={formData.orderNotes}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={2}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleToggleProductEdit}
                                sx={{ mb: 2 }}
                            >
                                {isProductEditEnabled ? 'Disable Product Editing' : 'Enable Product Editing'}
                            </Button>
                        </Grid>
                        {formData.products.map((product, index) => (
                            <Grid item xs={12} key={index}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={4}>
                                                <Typography variant="h6">{product.productName}</Typography>
                                                <Typography variant="body2">Price: ${product.productPrice.toFixed(2)}</Typography>
                                            </Grid>
                                        {isProductEditEnabled && (
                                            <>
                                            <Grid item xs={4}>
                                            <TextField
                                                    label="Quantity"
                                                    type="number"
                                                    name="itemQuantity"
                                                    value={product.itemQuantity}
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    fullWidth
                                                    inputProps={{ min: 0 }}                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                            <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleProductRemove(index)}
                                                    startIcon={<DeleteIcon />}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Remove
                                                </Button>
                                            </Grid>
                                            </>
                                        )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Price: ${calculateTotalPrice()}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon />}
                            >
                                Save Changes
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default OrderEdit;
