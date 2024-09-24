import React, { useEffect, useState } from 'react';
import UserService from "../../../_services/UserService";
import { useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    Grid,
    Typography,
    CircularProgress,
    Snackbar,
    Alert, Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";

const CustomerOrders = ({user}) => {
    const { customerId } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await UserService.GetOrdersByCustomerIdAsync(customerId);
                setOrders(response);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching orders.');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [customerId]);
    const getStatusColor = (status) => {
        switch (status) {
            case 0:
                return 'bg-blue-200 text-blue-800'; // Pending - Changed to blue
            case 1:
                return 'bg-green-300 text-green-900'; // Shipped - Darker green
            case 2:
                return 'bg-red-300 text-red-900'; // Rejected - Darker red
            default:
                return 'bg-gray-300 text-gray-900'; // Default - Darker gray
        }
    };


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <div className="text-center">
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </div>
        );
    }

    // If there's an error, display an alert
    if (error) {
        return (
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        );
    }

    // Calculate statistics directly from orders
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.orderStatus === 1).length; // Assuming 1 is for completed
    const pendingOrders = orders.filter(order => order.orderStatus === 0).length; // Assuming 0 is for pending
    const rejectedOrders = orders.filter(order => order.orderStatus === 2).length; // Assuming 2 is for rejected
    const totalRevenue = orders.reduce((sum, order) => sum + order.totlaAmount, 0); // Assuming totalAmount exists in the order
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    return (
        <>
            <Grid container spacing={3} justifyContent="center" style={{margin:"2%"}}>
                {/* Total Orders Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%',width:'70%', backgroundColor: '#e3f2fd' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Total Orders</Typography>
                            <Typography variant="h4" align="center">{totalOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Completed Orders Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%',width:'70%', backgroundColor: '#e8f5e9' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Completed Orders</Typography>
                            <Typography variant="h4" align="center">{completedOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending Orders Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%',width:'70%', backgroundColor: '#ffebee' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Pending Orders</Typography>
                            <Typography variant="h4" align="center">{pendingOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Rejected Orders Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', width:'70%',backgroundColor: '#e0f7fa' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Rejected Orders</Typography>
                            <Typography variant="h4" align="center">{rejectedOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total Revenue Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%',width:'70%', backgroundColor: '#f3e5f5' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Total Amount</Typography>
                            <Typography variant="h4" align="center">${totalRevenue.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Average Order Value Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%',width:'70%', backgroundColor: '#e0f7fa' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Average Order Value</Typography>
                            <Typography variant="h4" align="center">${averageOrderValue}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {/* Orders Summary Section */}
            <Box sx={{margin: "2%", padding: "20px", bgcolor: "#f5f5f5", borderRadius: "8px"}}>
                <h6 className="text-blueGray-700 text-xl font-bold">Orders for : {user.fullName}</h6>
                {/* Order List */}
                <TableContainer component={Paper} style={{width: '100%'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Order Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Total Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No orders found for this
                                        customer.</TableCell>
                                </TableRow>
                            ) : (
                                orders.map(order => (
                                    <TableRow key={order.orderId} hover>
                                        <TableCell>{order.orderId}</TableCell>
                                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                        <TableCell className={`font-semibold ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus === 0 ? 'Pending' : order.orderStatus === 1 ? 'Shipped' : 'Rejected'}
                                        </TableCell>
                                        <TableCell>${order.totlaAmount.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default CustomerOrders;
