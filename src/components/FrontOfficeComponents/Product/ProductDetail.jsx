import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Grid, Card, CardMedia, CardContent, Typography, Button, Box, CircularProgress, Accordion,
    AccordionSummary, AccordionDetails
} from '@mui/material';
import { ExpandMore, ShoppingCart } from '@mui/icons-material';
import CategoryService from "../../../_services/CategoryService";
import ProductService from "../../../_services/ProductService";
import Navbar from "../../Navbars/AuthNavbar";
import Footer from "../../Footers/Footer";
import Swal from 'sweetalert2';
import { styled } from "@mui/joy";

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productData = await ProductService.getProductById(productId);
                if (productData) {
                    setProduct(productData);
                    if (productData.imageUrls && productData.imageUrls.length > 0) {
                        setMainImage(`https://megstore.runasp.net/${productData.imageUrls[0]}`);
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
    }, [productId]);  // Use productId as a dependency

    const handleAddToCart = () => {
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

        const finalPrice = product.discountPercentage > 0
            ? (product.productPrice * (1 - product.discountPercentage / 100)).toFixed(2)
            : product.productPrice.toFixed(2);

        const updatedCart = [...cartItems, { ...product, quantity, finalPrice }];
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
        setMainImage(`https://megstore.runasp.net/${url}`);
    };

    const calculateDiscountedPrice = () => {
        if (product.discountPercentage > 0) {
            return (product.productPrice * (1 - product.discountPercentage / 100)).toFixed(2);
        }
        return product.productPrice.toFixed(2);
    };

    if (loading) return <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">MEGSTORE</h1>
        <CircularProgress color="primary"/>
        <p className="text-gray-600 mt-2">Loading, please wait...</p>
    </div>


    if (!product) return <p>No product found</p>;

    const RelatedProductCard = styled(Card)(() => ({
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'scale(1.05)' }
    }));

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const isProductInCart = cartItems.some(item => item.productId === product.productId);
    const isAvailable = product.isAvailable;

    return (
        <>
            <Navbar />
            <main className="py-16 px-4 sm:px-8 lg:px-16 bg-gray-100">
                <Grid container spacing={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Product Image Section */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ position: 'relative', boxShadow: 3, borderRadius: 2 }}>
                            <CardMedia
                                component="img"
                                alt={product.productName}
                                image={mainImage}
                                sx={{
                                    height: '500px',
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    border: '1px solid #e0e0e0',
                                }}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500'; }}
                            />
                            {/* Thumbnails */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                {product.imageUrls?.map((url, index) => (
                                    <CardMedia
                                        key={index}
                                        component="img"
                                        image={`https://megstore.runasp.net/${url}`}
                                        sx={{
                                            height: '100px',
                                            width: '100px',
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                            mx: 1,
                                            cursor: 'pointer',
                                            border: mainImage === `https://megstore.runasp.net/${url}` ? '2px solid #007bff' : '1px solid transparent',
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
                            {/* Prices Display */}
                            <Box sx={{ mb: 2 }}>
                                {product.discountPercentage > 0 && (
                                    <>
                                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'red' }}>
                                            ${product.productPrice.toFixed(2)}
                                        </Typography>
                                        <Typography variant="h5" sx={{ color: '#007bff', fontWeight: 'bold' }}>
                                            ${calculateDiscountedPrice()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#f39c12', fontWeight: 'bold' }}>
                                            Save {product.discountPercentage}!
                                        </Typography>
                                    </>
                                )}
                                {product.discountPercentage === 0 && (
                                    <Typography variant="h5" sx={{ color: '#007bff', fontWeight: 'bold' }}>
                                        ${product.productPrice.toFixed(2)}
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {isAvailable ? (
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
                                disabled={!isAvailable || isProductInCart}
                                sx={{
                                    backgroundColor: '#4caf50',
                                    '&:hover': { backgroundColor: '#4caf50' },
                                    textTransform: 'none',
                                    py: 1.5,
                                    mb: 2
                                }}
                            >
                                {isProductInCart ? 'Already in Cart' : 'Add to Cart'}
                            </Button>

                            {/* Additional Information Section */}
                            <Accordion expanded={expanded === 'panel1'} onChange={() => setExpanded(expanded === 'panel1' ? false : 'panel1')}>
                                <AccordionSummary expandIcon={<ExpandMore />} sx={{ backgroundColor: '#f0f0f0', borderRadius: 1 }}>
                                    <Typography variant="h6">Product Specifications</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2">{product.productDescription}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        </CardContent>
                    </Grid>
                </Grid>

                {/* Related Products Section */}
                <Box mt={8} style={{ marginBottom:'5%'}}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                        Related Products
                    </Typography>
                    <Grid container spacing={2}>
                        {relatedProducts.slice(0, 4).map(relatedProduct => (
                            <Grid item xs={12} sm={6} md={3} key={relatedProduct.productId}>
                                <RelatedProductCard sx={{ width: '300px', mx: '5%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={`https://megstore.runasp.net/${relatedProduct.imageUrls[0]}`}
                                        alt={relatedProduct.productName}
                                        sx={{ width: '100%', objectFit: 'cover' , mx: '5%', display: 'flex', flexDirection: 'column', height: '100%' }} // Ensures image covers the area
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}> {/* Allows content to expand */}
                                        <Typography variant="h6" noWrap>{relatedProduct.productName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ${relatedProduct.productPrice.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    <Button
                                        variant="outlined"
                                        sx={{ mt: 2, mb: 2 , margin:'3%'}} // Adds margin to the button
                                        href={`/shop/productDetails/${relatedProduct.productId}`}
                                    >
                                        View Product
                                    </Button>
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
