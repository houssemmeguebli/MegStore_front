import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Grid, Card, CardMedia, CardContent, Typography, Button, Box, CircularProgress, Divider,
    IconButton, Dialog, DialogContent, DialogTitle
} from '@mui/material';
import { Share } from '@mui/icons-material';
import CategoryService from "../../../_services/CategoryService";
import ProductService from "../../../_services/ProductService";
import Navbar from "../../Navbars/AuthNavbar";
import Footer from "../../Footers/Footer";
import Swal from 'sweetalert2';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInCart, setIsInCart] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productData = await ProductService.getProductById(productId);
                if (productData) {
                    setProduct(productData);
                    if (productData.categoryId) {
                        const category = await CategoryService.getCategoryById(productData.categoryId);
                        setCategoryName(category.categorydName); // Fixed typo

                        // Fetch related products by category
                        const related = await ProductService.getProductsByCategoryId(productData.categoryId);
                        setRelatedProducts(related.filter(p => p.productId !== productId)); // Exclude current product
                    }
                    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                    setIsInCart(cartItems.some(item => item.productId === productId));
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
        setIsInCart(true);
        Swal.fire({
            title: 'Added to Cart!',
            text: `${product.productName} has been added to your cart.`,
            icon: 'success',
            confirmButtonText: 'Continue',
            confirmButtonColor: '#007bff',
        });
    };

    const handleOpenImageDialog = () => setOpenImageDialog(true);
    const handleCloseImageDialog = () => setOpenImageDialog(false);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <CircularProgress size={60} />
        </div>
    );

    if (!product) return <p>No product found</p>;

    return (
        <>
            <Navbar />
            <main className="py-16 px-4 sm:px-8 lg:px-16 bg-gray-50">
                <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <Card sx={{
                        margin: '7%',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        maxWidth: '1200px',
                        width: '100%',
                        overflow: 'hidden',
                    }}>
                        <Box sx={{ flex: 1, position: 'relative' }}>
                            <Carousel
                                autoPlay={false}
                                indicators={false}
                                controls
                                interval={null}
                                slide
                                style={{ height: '400px' }} // Set the height of the carousel
                            >
                                {product.imageUrls && product.imageUrls.length > 0 ? (
                                    product.imageUrls.map((url, index) => (
                                        <Carousel.Item key={index}>
                                            <CardMedia
                                                component="img"
                                                alt={product.productName}
                                                image={`https://localhost:7048/${url}`}
                                                sx={{
                                                    height: '100%',
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '12px 12px 0 0',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={handleOpenImageDialog}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/450x450';
                                                }}
                                            />
                                        </Carousel.Item>
                                    ))
                                ) : (
                                    <Carousel.Item>
                                        <CardMedia
                                            component="img"
                                            alt={product.productName}
                                            image='https://via.placeholder.com/450x450'
                                            sx={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '12px 12px 0 0',
                                            }}
                                        />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                            <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
                                <DialogTitle>Product Images</DialogTitle>
                                <DialogContent>
                                    <Carousel
                                        autoPlay={false}
                                        indicators={false}
                                        controls
                                        interval={null}
                                        slide
                                        style={{ height: '400px' }} // Set the height of the carousel
                                    >
                                        {product.imageUrls && product.imageUrls.length > 0 ? (
                                            product.imageUrls.map((url, index) => (
                                                <Carousel.Item key={index}>
                                                    <CardMedia
                                                        component="img"
                                                        alt={product.productName}
                                                        image={`https://localhost:7048/${url}`}
                                                        sx={{
                                                            height: '100%',
                                                            width: '100%',
                                                            objectFit: 'contain',
                                                        }}
                                                    />
                                                </Carousel.Item>
                                            ))
                                        ) : (
                                            <Carousel.Item>
                                                <CardMedia
                                                    component="img"
                                                    alt={product.productName}
                                                    image='https://via.placeholder.com/450x450'
                                                    sx={{
                                                        height: '100%',
                                                        width: '100%',
                                                        objectFit: 'contain',
                                                    }}
                                                />
                                            </Carousel.Item>
                                        )}
                                    </Carousel>
                                </DialogContent>
                            </Dialog>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, flex: 2 }}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {product.productName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Ref: {product.productId}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {product.productDescription}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Category: {categoryName}
                                </Typography>
                                <Typography variant="h5" sx={{ my: 2, color: '#007bff', fontWeight: 'bold' }}>
                                    ${product.productPrice.toFixed(2)}
                                </Typography>

                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {product.isAvailable ? (
                                        <span style={{ color: '#4caf50', fontWeight: 'bold' }}>In Stock</span>
                                    ) : (
                                        <span style={{ color: '#f44336', fontWeight: 'bold' }}>Out of Stock</span>
                                    )}
                                </Typography>

                                {/* Add to Cart Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddToCart}
                                    disabled={!product.isAvailable || isInCart} // Disable if not available or already in cart
                                    sx={{
                                        textTransform: 'none',
                                        py: 1.5,
                                        backgroundColor: product.isAvailable ? '#007bff' : '#ccc',
                                        '&:hover': {
                                            backgroundColor: product.isAvailable ? '#0056b3' : '#ccc',
                                        },
                                        cursor: product.isAvailable ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    {isInCart ? 'Already in Cart' : product.isAvailable ? 'Add to Cart' : 'Unavailable'}
                                </Button>

                                {/* Social Share Buttons */}
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Share this product:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <FacebookShareButton url={window.location.href}>
                                            <IconButton>
                                                <Share />
                                            </IconButton>
                                        </FacebookShareButton>
                                        <TwitterShareButton url={window.location.href}>
                                            <IconButton>
                                                <Share />
                                            </IconButton>
                                        </TwitterShareButton>
                                        <WhatsappShareButton url={window.location.href}>
                                            <IconButton>
                                                <Share />
                                            </IconButton>
                                        </WhatsappShareButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Box>
                    </Card>
                </Box>

                {/* Divider for other sections */}
                <Divider sx={{ my: 4 }} />

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <Box mt={8}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 4 }}>
                            You might also like
                        </Typography>
                        <Grid container spacing={4}>
                            {relatedProducts.map((relatedProduct) => (
                                <Grid item xs={12} sm={6} md={4} key={relatedProduct.productId}>
                                    <Card sx={{
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                        },
                                    }}>
                                        <CardMedia
                                            component="img"
                                            alt={relatedProduct.productName}
                                            image={relatedProduct.imageUrl ? `https://localhost:7048/${relatedProduct.imageUrl}` : 'https://via.placeholder.com/300x300'}
                                            sx={{
                                                height: '250px',
                                                objectFit: 'cover',
                                                borderRadius: '12px 12px 0 0',
                                            }}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                                {relatedProduct.productName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                ${relatedProduct.productPrice.toFixed(2)}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                                onClick={() => window.location.href = `/shop/productDetails/${relatedProduct.productId}`}
                                                sx={{
                                                    textTransform: 'none',
                                                    borderColor: '#007bff',
                                                    color: '#007bff',
                                                    '&:hover': {
                                                        borderColor: '#0056b3',
                                                        color: '#0056b3',
                                                    },
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </main>
            <Footer />
        </>
    );
};

export default ProductDetail;
