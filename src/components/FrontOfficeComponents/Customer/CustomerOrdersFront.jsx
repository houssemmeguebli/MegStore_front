import React, { useEffect, useState } from 'react';
import {useParams, useNavigate, Route} from 'react-router-dom';
import OrderService from '../../../_services/OrderService';
import ProductService from '../../../_services/ProductService';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Chip,
    Grid,
    Box,
    CircularProgress,
    Container,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { FaNotesMedical } from 'react-icons/fa';
import Navbar from "../../Navbars/AuthNavbar";
import Footer from "../../Footers/Footer";
import CustomerOrderEdit from "./CustomerOrderEdit";

const CustomerOrdersFront = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderData = await OrderService.getOrderById(orderId);
                setOrder(orderData);
                setTotalPrice(orderData.totlaAmount);
                console.log("orderData", orderData);

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
        <>
            <Navbar transparent />
            <Container className="container mx-auto p-6 lg:p-12 bg-gray-50" sx={{ margin: "10%" }}>
                <Card className="overflow-hidden shadow-lg">
                    <CardHeader
                        title="Order Details"
                        subheader={`Order ID: ${order.orderId}`}
                        action={order.orderStatus === 0 && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => navigate(`/customerProfile/orders/edit/${orderId}`)}
                            >
                                Edit
                            </Button>
                        )}
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
                        </Tabs>

                        {tabIndex === 0 && (
                            <div className="p-4">
                                <Card className="mb-6 bg-white shadow-lg rounded-lg">
                                    <CardHeader
                                        title="Order Information"
                                        titleTypographyProps={{ variant: 'h5', className: 'font-bold text-gray-800' }}
                                    />
                                    <Divider />
                                    <CardContent>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="h6" className="font-semibold text-gray-600 mb-4">Customer Information</Typography>
                                                <TableContainer component={Paper} className="mb-4">
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-semibold text-gray-600">Name</TableCell>
                                                                <TableCell>{order.customerName}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-semibold text-gray-600">Email</TableCell>
                                                                <TableCell>{order.customerEmail}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-semibold text-gray-600">Address</TableCell>
                                                                <TableCell>{order.customerAddress}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-semibold text-gray-600">Phone</TableCell>
                                                                <TableCell>{order.customerPhone}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-semibold text-gray-600">Order Notes</TableCell>
                                                                <TableCell>{order.orderNotes || 'No notes'}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Typography variant="h6" className="font-semibold text-gray-600 mb-4">Order Summary</Typography>
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
                                                                <TableCell className="font-semibold text-gray-600">Total Price</TableCell>
                                                                <TableCell className="text-green-600">${formatPrice(totalPrice)}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
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
                                                <TableCell align="center">Quantity</TableCell>
                                                <TableCell align="center">Price</TableCell>
                                                <TableCell align="center">Discount (%)</TableCell>
                                                <TableCell align="center">Price After Discount</TableCell>
                                                <TableCell align="center">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orderItems.map(item => {
                                                const product = productsMap.get(item.productId);
                                                const discountPercentage = product?.discountPercentage || 0;
                                                const originalPrice = product?.productPrice || 0;
                                                const finalPrice = originalPrice * (1 - discountPercentage / 100);

                                                return (
                                                    <TableRow key={item.orderItemId}>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center">
                                                                <img
                                                                    src={product?.imageUrls ? `https://localhost:7048/${product.imageUrls[0]}` : 'https://via.placeholder.com/64x64'}
                                                                    alt={product?.productName}
                                                                    className="w-12 h-12 object-cover mr-2"
                                                                />
                                                                {product?.productName || 'Unknown Product'}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="center">{item.quantity}</TableCell>
                                                        <TableCell align="center">${formatPrice(originalPrice)}</TableCell>
                                                        <TableCell align="center">{discountPercentage}</TableCell>
                                                        <TableCell align="center">${formatPrice(finalPrice)}</TableCell>
                                                        <TableCell align="center">${formatPrice(finalPrice * item.quantity)}</TableCell>
                                                    </TableRow>
                                                );
                                            })}

                                            {/* Row for Total Price */}
                                            <TableRow>
                                                <TableCell colSpan={5} align="right">
                                                    <Typography variant="h6" className="font-semibold">Total Price:</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="h6" className="text-green-600">${formatPrice(totalPrice)}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>

                                    </Table>
                                </TableContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Container>
            <Footer />
        </>
    );
};

export default CustomerOrdersFront;
