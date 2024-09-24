import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const ProductStatistics = ({ products }) => {
    // Calculate statistics
    const totalProducts = products.length;
    const availableProducts = products.filter(product => product.isAvailable).length;
    const unavailableProducts = totalProducts - availableProducts;
    const totalStockQuantity = products.reduce((sum, product) => sum + product.stockQuantity, 0);
    const averagePrice = totalProducts > 0 ? (products.reduce((sum, product) => sum + product.productPrice, 0) / totalProducts).toFixed(2) : 0;

    return (
        <div style={{ padding: '16px',marginBottom:'5%' }}>
            <Typography variant="h4" gutterBottom align="center">
                Product Statistics
            </Typography>
            <br/>
            <Grid container spacing={4} justifyContent="center">
                {/* Total Products Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#e3f2fd' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Total Products</Typography>
                            <Typography variant="h4" align="center">{totalProducts}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Available Products Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#e8f5e9' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Available Products</Typography>
                            <Typography variant="h4" align="center">{availableProducts}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Unavailable Products Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#ffebee' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Unavailable Products</Typography>
                            <Typography variant="h4" align="center">{unavailableProducts}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total Stock Quantity Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#f3e5f5' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Total Stock Quantity</Typography>
                            <Typography variant="h4" align="center">{totalStockQuantity}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Average Price Card */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3} style={{ height: '100%', backgroundColor: '#e0f7fa' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" align="center">Average Price</Typography>
                            <Typography variant="h4" align="center">${averagePrice}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </div>
    );
};

ProductStatistics.propTypes = {
    products: PropTypes.array.isRequired,
};

export default ProductStatistics;
