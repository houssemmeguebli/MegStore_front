import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const OrderStatistics = ({ orders }) => {
    // Calculate statistics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.orderStatus === 1).length; // Assuming 1 is for completed
    const pendingOrders = orders.filter(order => order.orderStatus === 0).length; // Assuming 0 is for pending
    const rejectedOrders = orders.filter(order => order.orderStatus === 2).length; // Assuming 0 is for pending
    const totalRevenue = orders.reduce((sum, order) => sum + order.totlaAmount, 0); // Assuming totalPrice exists in the order
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    return (
        <div style={{ padding: '16px', marginTop: '10%',marginBottom:'2%' }}>
            <Grid container spacing={4} justifyContent="center">
                {/* Total Orders Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#e3f2fd' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Total Orders</Typography>
                            <Typography variant="h4" align="center">{totalOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Completed Orders Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#e8f5e9' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Completed Orders</Typography>
                            <Typography variant="h4" align="center">{completedOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending Orders Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#ffebee' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Pending Orders</Typography>
                            <Typography variant="h4" align="center">{pendingOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Rejected Orders Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#e0f7fa' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Rejected Orders</Typography>
                            <Typography variant="h4" align="center">{rejectedOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Total Revenue Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#f3e5f5' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Total Revenue</Typography>
                            <Typography variant="h4" align="center">${totalRevenue.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Average Order Value Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#e0f7fa' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Average Order Value</Typography>
                            <Typography variant="h4" align="center">${averageOrderValue}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

OrderStatistics.propTypes = {
    orders: PropTypes.array.isRequired,
};

export default OrderStatistics;
