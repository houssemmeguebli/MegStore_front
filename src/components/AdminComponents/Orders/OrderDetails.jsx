import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../../../_services/OrderService';
import ProductService from '../../../_services/ProductService';
import DeliveryNotePDF from './DeliveryNotePDF';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tab, Tabs, Typography, Card, CardContent, CardHeader, Divider, Chip, Grid, Box, CircularProgress, Tooltip, IconButton } from '@mui/material';
import { Edit, ArrowBack, MailOutline, AddShoppingCart, LocalShipping, TrackChanges } from '@mui/icons-material';
import { FaCalendarAlt, FaShippingFast, FaNotesMedical } from 'react-icons/fa';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderData = await OrderService.getOrderById(orderId);
                setOrder(orderData);

                if (orderData.orderItems && Array.isArray(orderData.orderItems)) {
                    const productIds = orderData.orderItems.map(item => item.productId).filter(id => id != null);
                    const uniqueProductIds = [...new Set(productIds)];

                    if (uniqueProductIds.length > 0) {
                        const productPromises = uniqueProductIds.map(id => ProductService.getProductById(id));
                        const productsData = await Promise.all(productPromises);
                        setProducts(productsData);
                    }
                }
            } catch (err) {
                setError('Failed to fetch order details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <div className="flex justify-center items-center min-h-screen"><CircularProgress /></div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;
    if (!order) return <div className="text-center text-gray-600">No order found.</div>;

    const orderItems = order.orderItems || [];
    const productsMap = new Map(products.map(product => [product.productId, product]));
    const formatPrice = (price) => price ? price.toFixed(2) : '0.00';
    const totalPrice = orderItems.reduce((acc, item) => {
        const product = productsMap.get(item.productId);
        return acc + (product?.productPrice || 0) * (item.quantity || 0);
    }, 0);

    const getStatusLabel = (status) => {
        switch (status) {
            case 0:
                return { label: 'Pending', color: 'warning' };
            case 1:
                return { label: 'Shipped', color: 'success' };
            case 2:
                return { label: 'Rejected', color: 'error' };
            default:
                return { label: 'Unknown', color: 'default' };
        }
    };
    const orderStatus = getStatusLabel(order.orderStatus);

    return (
        <div className="container mx-auto p-6 lg:p-12 bg-gray-50 mt-20">
            <Card className="overflow-hidden shadow-lg">
                <CardHeader
                    title="Order Details"
                    subheader={`Order ID: ${order.orderId}`}
                    action={
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Edit />}
                            onClick={() => navigate(`/admin/orders/edit/${orderId}`)}
                        >
                            Edit
                        </Button>
                    }
                />
                <Divider />
                <CardContent>
                    <Tabs
                        value={tabIndex}
                        onChange={(event, newIndex) => setTabIndex(newIndex)}
                        variant="fullWidth"
                        className="mb-4"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Order Info" />
                        <Tab label="Products" />
                        <Tab label="Order Notes" />
                    </Tabs>

                    {tabIndex === 0 && (
                        <div className="p-4">
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Card className="mb-4 bg-white shadow-md">
                                        <CardHeader
                                            title="Order & Customer Information"
                                            subheader={<Typography variant="body2" color="textSecondary">Order placed on {new Date(order.orderDate).toLocaleDateString()}</Typography>}
                                        />
                                        <CardContent>
                                            <TableContainer component={Paper} className="mb-4">
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className="font-semibold text-gray-600">Order Date</TableCell>
                                                            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-semibold text-gray-600">Shipped Date</TableCell>
                                                            <TableCell>{order.shippedDate ? new Date(order.shippedDate).toLocaleDateString() : 'Not Shipped Yet'}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-semibold text-gray-600">Order Status</TableCell>
                                                            <TableCell>
                                                                <Chip label={orderStatus.label} color={orderStatus.color} />
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-semibold text-gray-600">Customer Name</TableCell>
                                                            <TableCell>{order.customerName}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-semibold text-gray-600">Customer Email</TableCell>
                                                            <TableCell>{order.customerEmail}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-semibold text-gray-600">Shipping Tracking</TableCell>
                                                            <TableCell>
                                                                {order.trackingNumber ? (
                                                                    <a href={`https://tracking.example.com/${order.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                        Track Your Order
                                                                    </a>
                                                                ) : 'No tracking number available'}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                            <Typography variant="body1" className="text-gray-600 mb-4">
                                                <strong>Address:</strong> {order.customerAddress}
                                            </Typography>
                                            <Typography variant="body1" className="text-gray-600">
                                                <strong>Phone:</strong> {order.customerPhone}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card className="mb-4 bg-white shadow-md">
                                        <CardHeader
                                            title="Order Summary"
                                            subheader="A brief overview of the order."
                                        />
                                        <CardContent>
                                            <Typography variant="h6" className="text-lg font-semibold text-gray-700 mb-2">
                                                Total Price: ${formatPrice(totalPrice)}
                                            </Typography>
                                            <DeliveryNotePDF order={order} totalPrice={totalPrice} products={products} />
                                            <Box mt={2}>
                                                <Tooltip title="Reorder this item" arrow>
                                                    <IconButton
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => navigate(`/order/reorder/${order.orderId}`)}
                                                    >
                                                        <AddShoppingCart />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    )}

                    {tabIndex === 1 && (
                        <div className="p-4">
                            <Typography variant="h6" className="flex items-center text-gray-700 mb-4">
                                <FaNotesMedical className="mr-2 text-gray-500" />
                                Products in Order
                            </Typography>

                            <TableContainer component={Paper} className="mb-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderItems.map(item => {
                                            const product = productsMap.get(item.productId);
                                            return (
                                                <TableRow key={item.orderItemId}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">

                                                            <img
                                                                src={product.imageUrls ? `https://localhost:7048/${product.imageUrls[0]}` : 'https://via.placeholder.com/64x64'}
                                                                alt={product?.productName}
                                                                className="w-16 h-16 object-cover mr-4"
                                                            />
                                                            <Typography variant="body1" className="text-gray-800">{product?.productName}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right">${formatPrice(product?.productPrice || 0)}</TableCell>
                                                    <TableCell align="right">${formatPrice((product?.productPrice || 0) * item.quantity)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}

                    {tabIndex === 2 && (
                        <div className="p-4">
                            <Card className="mb-4 bg-white shadow-md">
                                <CardHeader title="Order Notes" />
                                <CardContent>
                                    <Typography variant="body1" className="text-gray-600">
                                        {order.orderNotes || 'No notes available for this order.'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
                <Divider />
                <div className="flex justify-between p-4 bg-gray-100">
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/admin/orders')}
                    >
                        Back to Orders
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<MailOutline />}
                        onClick={() => window.open(`mailto:${order.customerEmail}`)}
                    >
                        Contact Customer
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default OrderDetails;
