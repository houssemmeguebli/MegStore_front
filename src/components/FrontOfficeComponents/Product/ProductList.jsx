import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardMedia, CardContent, Typography, Button, CardActions, Box
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Swal from 'sweetalert2';
import CategoryService from "../../../_services/CategoryService";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...existingCart, item];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
};

const ProductList = ({ products }) => {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [categories, setCategories] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const categoryIds = [...new Set(products.map(product => product.categoryId))];
            const fetchedCategories = {};

            for (const id of categoryIds) {
                const category = await CategoryService.getCategoryById(id);
                if (category) {
                    fetchedCategories[id] = category.categorydName;
                }
            }
            setCategories(fetchedCategories);
        };

        fetchCategories();
    }, [products]);

    const handleAddToCart = (product) => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const isProductInCart = cartItems.some(item => item.productId === product.productId);

        if (isProductInCart) {
            Swal.fire({
                title: 'Product Already in Cart!',
                text: `${product.productName} is already in your cart.`,
                icon: 'info',
                confirmButtonText: 'OK',
                background: '#fff',
                color: '#333',
                confirmButtonColor: '#4CAF50',
            });
            return;
        }

        addToCart(product);
        setCart([...cart, product]);

        Swal.fire({
            title: 'Added to Cart!',
            text: `${product.productName} has been added to your cart.`,
            icon: 'success',
            confirmButtonText: 'OK',
            background: '#fff',
            color: '#333',
            confirmButtonColor: '#4CAF50',
        });
    };

    const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleViewDetails = (productId) => {
        navigate(`/shop/productDetails/${productId}`);
    };

    return (
        <div className="container mx-auto py-8" style={{ maxWidth: '1400px' }}>
            {products.length > 0 ? (
                <Grid container spacing={4}>
                    {paginatedProducts.map((product) => {
                        const isProductInCart = cart.some(item => item.productId === product.productId);

                        return (
                            <Grid item xs={12} sm={6} md={3} lg={4} key={product.productId}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                        height: '100%', // Ensure card takes up full height of grid item
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
                                        },
                                    }}
                                >
                                    {/* Product Image */}
                                    <CardMedia
                                        component="img"
                                        alt={product.productName}
                                        image={product.imageUrls ? `https://localhost:7048/${product.imageUrls[0]}` : 'https://via.placeholder.com/300x300'}
                                        sx={{
                                            width: '1000px',
                                            height: '250px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            transition: 'transform 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x300';
                                        }}
                                        onClick={() => handleViewDetails(product.productId)}
                                    />

                                    {/* Product Details */}
                                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Ref: {product.productId}
                                        </Typography>

                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                                            {product.productName}
                                        </Typography>

                                        {/* Category Name */}
                                        {product.categoryId && categories[product.categoryId] && (
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                Category: {categories[product.categoryId]}
                                            </Typography>
                                        )}

                                        {/* Stock Availability */}
                                        <Typography sx={{ fontWeight: 'bold', marginTop: '8px', fontSize: '14px' }}>
                                            {product.isAvailable ? (
                                                <span style={{ color: '#4caf50' }}>In Stock</span>
                                            ) : (
                                                <span style={{ color: '#f44336' }}>Out of Stock</span>
                                            )}
                                        </Typography>

                                        <Typography variant="h5" sx={{ color: '#007bff', fontWeight: 'bold', marginTop: '8px' }}>
                                            ${product.productPrice.toFixed(2)}
                                        </Typography>
                                    </CardContent>

                                    {/* Add to Cart Button */}
                                    <CardActions sx={{ justifyContent: 'center', paddingTop: '16px' }}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#28a745',
                                                padding: '10px 20px',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                '&:hover': { backgroundColor: '#218838' },
                                            }}
                                            startIcon={<AddShoppingCartIcon />}
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!product.isAvailable || isProductInCart}
                                        >
                                            {isProductInCart ? 'Already in Cart' : 'Add to Cart'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="60vh"
                    sx={{
                        borderRadius: '20px',
                        boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
                        padding: '50px',
                        textAlign: 'center',

                    }}
                >
                    <Box>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(to right, #ff758c, #007bff)', // Pink to light pink gradient
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 3,
                                textShadow: '2px 4px 6px rgba(0, 0, 0, 0.15)',
                            }}
                        >
                            No Products Available
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6a0572', // Deep purple
                                fontSize: '20px',
                                mb: 4,
                            }}
                        >
                            We're working on adding more products for you. Please check back soon or explore our other collections!
                        </Typography>

                        <Button
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(to right, #007bff, #007bff)', // Same gradient for button
                                color: '#fff',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                padding: '10px 20px',
                                borderRadius: '30px',
                                '&:hover': {
                                    background: 'linear-gradient(to right, #ff6b88, #007bff)',
                                },
                            }}
                            onClick={() => window.location.reload()} // Example action
                        >
                            Explore Other Collections
                        </Button>
                    </Box>
                </Box>

            )}

            {/* Pagination Controls */}
            <Box display="flex" justifyContent="center" mt={4}>
                <nav aria-label="Page navigation">
                    <ul className="inline-flex -space-x-px">
                        <li>
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                variant="outlined"
                                sx={{ marginRight: '8px' }}
                            >
                                Previous
                            </Button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index}>
                                <Button
                                    onClick={() => handlePageChange(index + 1)}
                                    variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                                    sx={{ marginRight: '8px' }}
                                >
                                    {index + 1}
                                </Button>
                            </li>
                        ))}
                        <li>
                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                variant="outlined"
                            >
                                Next
                            </Button>
                        </li>
                    </ul>
                </nav>
            </Box>
        </div>
    );
};

export default ProductList;
