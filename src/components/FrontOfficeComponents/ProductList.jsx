import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, CardActions, Box } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';;

// Function to add item to cart in local storage
const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...existingCart, item];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
};

const ProductList = ({ products }) => {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

    const handleAddToCart = (product) => {
        addToCart(product);
        setCart(JSON.parse(localStorage.getItem('cart')) || []);
       alert(`${product.productName} added to cart!`);
    };

    return (
        <div className="container mx-auto py-8 " style={{ maxWidth: '1200px' }}>

            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item xs={12} key={product.productId}>
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                                borderRadius: '16px',
                                padding: '16px',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            {/* Product Image */}
                            <CardMedia
                                component="img"
                                alt={product.productName}
                                image={product.imageUrl ? `https://localhost:7048/${product.imageUrl}` : 'https://via.placeholder.com/300x300'}
                                sx={{
                                    width: '250px',
                                    height: '250px',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    flexShrink: 0,
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x300';
                                }}
                            />

                            {/* Product Details */}
                            <CardContent sx={{ paddingLeft: '24px', flexGrow: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Ref: {product.productId}
                                </Typography>

                                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {product.productName}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '16px', lineHeight: '1.6' }}>
                                    {product.productDescription}
                                </Typography>
                                {/* Category (Optional) */}
                                {product.categoryId && (
                                    <Typography variant="body2" sx={{ color: '#666', marginTop: '8px' }}>
                                        Category ID: {product.categoryId}
                                    </Typography>
                                )}
                                {/* Stock Availability */}
                                <Typography variant="h4" sx={{ color: '#007bff', fontWeight: 'bold' }}>

                                {product.isAvailable ? (
                                    <Typography
                                        sx={{
                                            color: '#4caf50', // Simple green color for available
                                            fontWeight: 'bold', // Bold text
                                            fontSize: '16px', // Font size
                                        }}
                                    >
                                        Available
                                    </Typography>
                                ) : (
                                    <Typography
                                        sx={{
                                            color: '#f44336', // Simple red color for out of stock
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                        }}
                                    >
                                        Out of Stock
                                    </Typography>
                                )}
                                </Typography>


                                <Typography variant="h4" sx={{ color: '#007bff', fontWeight: 'bold' }}>
                                        ${product.productPrice.toFixed(2)}
                                </Typography>



                                {/* Add to Cart Button */}
                                <CardActions sx={{ padding: 0, marginTop: '16px', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#28a745',
                                            padding: '12px 24px',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            borderRadius: '8px',
                                            '&:hover': { backgroundColor: '#218838' },
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                        }}
                                        startIcon={<AddShoppingCartIcon />}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardActions>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ProductList;
