import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Grid, Card, CardMedia, CardContent, Typography, Button, Box, CircularProgress, IconButton,
    Accordion, AccordionSummary, AccordionDetails, Rating, TextField, MenuItem
} from '@mui/material';
import { ExpandMore, ShoppingCart, Star } from '@mui/icons-material';
import CategoryService from "../../../_services/CategoryService";
import ProductService from "../../../_services/ProductService";
import Navbar from "../../Navbars/AuthNavbar";
import Footer from "../../Footers/Footer";
import Swal from 'sweetalert2';
import {styled} from "@mui/joy";

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [expanded, setExpanded] = useState(false);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productData = await ProductService.getProductById(productId);
                if (productData) {
                    setProduct(productData);
                    if (productData.imageUrls && productData.imageUrls.length > 0) {
                        setMainImage(`https://localhost:7048/${productData.imageUrls[0]}`);
                    }
                    if (productData.categoryId) {
                        const category = await CategoryService.getCategoryById(productData.categoryId);
                        setCategoryName(category.categorydName);

                        const related = await ProductService.getProductsByCategoryId(productData.categoryId);
                        setRelatedProducts(related.filter(p => p.productId !== productId));
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
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = [...cartItems, { ...product, quantity }];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        Swal.fire({
            title: 'Added to Cart!',
            text: `${product.productName} has been added to your cart.`,
            icon: 'success',
            confirmButtonText: 'Continue Shopping',
            confirmButtonColor: '#007bff',
        });
    };

    const handleThumbnailClick = (url) => {
        setMainImage(`https://localhost:7048/${url}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <CircularProgress size={60} />
        </div>
    );

    if (!product) return <p>No product found</p>;
    const RelatedProductCard = styled(Card)({
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'scale(1.05)' }
    });
    return (
        <>
            <Navbar />
            <main className="py-16 px-4 sm:px-8 lg:px-16 bg-gray-50">
                <Grid container spacing={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Product Image Section */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ position: 'relative', boxShadow: 3, borderRadius: 2 }}>
                            <CardMedia
                                component="img"
                                alt={product.productName}
                                image={mainImage}
                                sx={{ height: '500px', objectFit: 'cover', borderRadius: 2 }}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500'; }}
                            />
                            {/* Thumbnails */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                {product.imageUrls?.map((url, index) => (
                                    <CardMedia
                                        key={index}
                                        component="img"
                                        image={`https://localhost:7048/${url}`}
                                        sx={{
                                            height: '100px',
                                            width: '100px',
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                            mx: 1,
                                            cursor: 'pointer',
                                            border: mainImage === `https://localhost:7048/${url}` ? '2px solid #007bff' : 'none',
                                            transition: 'border-color 0.3s',
                                        }}
                                        onClick={() => handleThumbnailClick(url)}
                                    />
                                ))}
                            </Box>
                        </Card>
                    </Grid>

                    {/* Product Info Section */}
                    <Grid item xs={12} md={6}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                                {product.productName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
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
                                startIcon={<ShoppingCart />}
                                onClick={handleAddToCart}
                                disabled={!product.isAvailable}
                                sx={{
                                    backgroundColor: '#007bff',
                                    '&:hover': { backgroundColor: '#0056b3' },
                                    textTransform: 'none',
                                    py: 1.5,
                                    mb: 2
                                }}
                            >
                                Add to Cart
                            </Button>

                            {/* Additional Information Section */}
                            <Accordion expanded={expanded === 'panel1'} onChange={() => setExpanded(expanded === 'panel1' ? false : 'panel1')}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="h6">Product Specifications</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2">
                                        {product.productDescription}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={expanded === 'panel2'} onChange={() => setExpanded(expanded === 'panel2' ? false : 'panel2')}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="h6">FAQs</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2">
                                        - What is the return policy? <br />
                                        - Can I get a warranty on this product?
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </CardContent>
                    </Grid>
                </Grid>

                {/* Related Products Section */}
                <Box mt={8}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                        Related Products
                    </Typography>
                    <Grid container spacing={2}>
                        {relatedProducts.map(relatedProduct => (
                            <Grid item xs={12} sm={6} md={3} key={relatedProduct.productId}>
                                <RelatedProductCard sx={{ width: '300px', mx: '5%' }}>
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={`https://localhost:7048/${relatedProduct.imageUrls[0]}`}
                                        alt={relatedProduct.productName}
                                        sx={{  width: '300px' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" noWrap>{relatedProduct.productName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ${relatedProduct.productPrice.toFixed(2)}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            sx={{ mt: 2 }}
                                            href={`/shop/productDetails/${relatedProduct.productId}`}
                                        >
                                            View Product
                                        </Button>
                                    </CardContent>
                                </RelatedProductCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

            </main>
            <Footer />
        </>
    );
};

export default ProductDetail;
