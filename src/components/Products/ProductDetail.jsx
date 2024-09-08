import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, CircularProgress, Grid, Switch, FormControlLabel, Box, Paper } from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductService from "../../_services/ProductService";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await ProductService.getProductById(productId);
                setProduct(data);

                // Assuming you have a method to fetch related products
                const relatedData = await ProductService.getRelatedProducts(data.categoryId);
                setRelatedProducts(relatedData);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        }

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSwitchChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.checked
        });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await ProductService.updateProduct(productId, product, imageFile);
            setSuccess(true);
            setError('');
            setImageFile(null);
            navigate('/admin/tables');

        } catch (error) {
            setError("Failed to update product. Please try again.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center text-lg font-semibold">Loading...</div>
            </div>
        );
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating
                    ? <FaStar key={i} className="text-yellow-500" />
                    : <FaStarHalfAlt key={i} className="text-yellow-500" />
            );
        }
        return stars;
    };

    return (
        <Box sx={{ padding: '24px', marginTop: '10%' }}>
            <Paper elevation={3} sx={{ padding: '24px' }}>
                <Typography variant="h4" gutterBottom>Edit Product</Typography>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">Product updated successfully!</Typography>}
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2} alignItems="center">
                        {/* Product Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="productName"
                                label="Product Name"
                                fullWidth
                                value={product.productName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        {/* Product Price */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="productPrice"
                                label="Product Price (USD)"
                                type="number"
                                fullWidth
                                value={product.productPrice}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        {/* Stock Quantity */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="stockQuantity"
                                label="Stock Quantity"
                                type="number"
                                fullWidth
                                value={product.stockQuantity}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        {/* Availability */}
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={product.isAvailable}
                                        onChange={handleSwitchChange}
                                        name="isAvailable"
                                    />
                                }
                                label="Available"
                            />
                        </Grid>

                        {/* Product Description */}
                        <Grid item xs={12}>
                            <TextField
                                name="productDescription"
                                label="Product Description"
                                fullWidth
                                value={product.productDescription}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                variant="outlined"
                            />
                        </Grid>

                        {/* Image Upload */}
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" component="label" fullWidth>
                                Upload Product Image
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </Button>
                            {imageFile && <Typography variant="body2">{imageFile.name}</Typography>}
                        </Grid>

                        {/* Date Added */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                                <strong>Date Added:</strong> {new Date(product.dateAdded).toLocaleDateString()}
                            </Typography>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={loading}
                                size="large"
                            >
                                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Related Products Section */}
            <Box sx={{ marginTop: '32px' }}>
                <Typography variant="h5" gutterBottom>Related Products</Typography>
                <Grid container spacing={3}>
                    {relatedProducts.map((relatedProduct) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={relatedProduct.productId}>
                            <Paper elevation={2} sx={{ padding: '16px' }}>
                                <img
                                    src={`https://localhost:7048/${relatedProduct.imageUrl}`}
                                    alt={relatedProduct.productName}
                                    className="w-full h-40 object-cover rounded mb-4"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/300x300";
                                    }}
                                />
                                <Typography variant="h6">{relatedProduct.productName}</Typography>
                                <Typography variant="body2">${relatedProduct.productPrice} USD</Typography>
                                <Link to={`/product/${relatedProduct.productId}`} className="text-blue-600 hover:text-blue-800">
                                    View Details
                                </Link>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
