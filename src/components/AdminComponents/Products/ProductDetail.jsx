import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, CircularProgress, Grid, Switch, FormControlLabel, Box, Paper } from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import ProductService from "../../../_services/ProductService";

export default function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await ProductService.getProductById(productId);
                setProduct(data);

            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Failed to fetch product details.");
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
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file)); // Set the preview URL
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
            setImagePreview(''); // Clear preview
            navigate('/admin/products');
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
        <Box className="p-8 mx-auto max-w-7xl" style={{ marginTop: '10%' }}>
            <Paper elevation={3} className="p-8 shadow-lg">
                <Typography variant="h4" gutterBottom className="mb-4 font-semibold">Edit Product</Typography>
                {error && <Typography color="error" className="mb-4">{error}</Typography>}
                {success && <Typography color="primary" className="mb-4">Product updated successfully!</Typography>}
                <Box component="form" className="mt-4" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={4}>
                        {/* Product Image */}
                        <Grid item xs={12} sm={6} className="flex justify-center mb-6">
                            <img
                                src={imagePreview || `https://localhost:7048/${product.imageUrl}`}
                                alt={product.productName}
                                className="w-full max-w-lg h-auto object-cover rounded-lg shadow-md"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/300x400";
                                }}
                            />
                        </Grid>

                        {/* Product Details */}
                        <Grid item xs={12} sm={6}>
                            <Grid container spacing={4}>
                                {/* Product Name */}
                                <Grid item xs={12}>
                                    <TextField
                                        name="productName"
                                        label="Product Name"
                                        fullWidth
                                        value={product.productName}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        className="mb-4"
                                    />
                                </Grid>

                                {/* Product Price */}
                                <Grid item xs={12}>
                                    <TextField
                                        name="productPrice"
                                        label="Product Price (USD)"
                                        type="number"
                                        fullWidth
                                        value={product.productPrice}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        className="mb-4"
                                    />
                                </Grid>

                                {/* Stock Quantity */}
                                <Grid item xs={12}>
                                    <TextField
                                        name="stockQuantity"
                                        label="Stock Quantity"
                                        type="number"
                                        fullWidth
                                        value={product.stockQuantity}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        className="mb-4"
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
                                        rows={4}
                                        variant="outlined"
                                        className="mb-4"
                                    />
                                </Grid>

                                {/* Availability and Date Added */}
                                <Grid item xs={12} className="flex items-center justify-between">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={product.isAvailable}
                                                onChange={handleSwitchChange}
                                                name="isAvailable"
                                            />
                                        }
                                        label="Available"
                                        className="mb-4"
                                    />
                                    <Typography variant="body2" className="mb-4">
                                        <strong>Date Added:</strong> {new Date(product.dateAdded).toLocaleDateString()}
                                    </Typography>
                                </Grid>

                                {/* Image Upload */}
                                <Grid item xs={12}>
                                    <Button variant="contained" component="label" fullWidth>
                                        Upload Product Image
                                        <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                                    </Button>
                                    {imageFile && <Typography variant="body2" className="mt-2">{imageFile.name}</Typography>}
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
                                        {loading ? <CircularProgress size={24} /> : 'Save '}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

        </Box>
    );
}
