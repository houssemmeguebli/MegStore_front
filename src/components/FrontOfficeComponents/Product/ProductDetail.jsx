import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import CategoryService from "../../../_services/CategoryService";
import ProductService from "../../../_services/ProductService";
import Navbar from "../../Navbars/AuthNavbar";
import Footer from "../../Footers/Footer";

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productData = await ProductService.getProductById(productId);
                if (productData) {
                    setProduct(productData);
                    if (productData.categoryId) {
                        const category = await CategoryService.getCategoryById(productData.categoryId);
                        setCategoryName(category.categoryName);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch product details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    const handleAddToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = [...existingCart, product];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        alert('Product added to cart!');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <CircularProgress size={60} />
        </div>
    );

    if (!product) return <p>No product found</p>;

    return (
        <>
            <Navbar />
            <main className="py-16 px-4 sm:px-8 lg:px-16 bg-gray-100">
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    sx={{
                        mb: 4,
                        borderColor: '#007bff',
                        color: '#007bff',
                        '&:hover': {
                            borderColor: '#0056b3',
                            color: '#0056b3',
                        },
                    }}
                    onClick={() => window.history.back()}
                >
                    Back
                </Button>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <Card sx={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <CardMedia
                                component="img"
                                alt={product.productName}
                                image={product.imageUrl ? `https://localhost:7048/${product.imageUrl}` : 'https://via.placeholder.com/400x400'}
                                sx={{
                                    height: '400px',
                                    objectFit: 'cover',
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x400';
                                }}
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card sx={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            p: 4,
                        }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    {product.productName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Ref: {product.productId}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {product.productDescription}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Category: {categoryName}
                                </Typography>
                                <Typography variant="h6" sx={{ my: 2, color: '#007bff', fontWeight: 'bold' }}>
                                    ${product.productPrice.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {product.isAvailable ? (
                                        <span style={{ color: '#4caf50', fontWeight: 'bold' }}>In Stock</span>
                                    ) : (
                                        <span style={{ color: '#f44336', fontWeight: 'bold' }}>Out of Stock</span>
                                    )}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddToCart}
                                    disabled={!product.isAvailable}
                                    sx={{
                                        textTransform: 'none',
                                        py: 1.5,
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </main>
            <Footer />
        </>
    );
};

export default ProductDetail;
