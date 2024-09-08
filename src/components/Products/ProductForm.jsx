import React, { useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress, Grid, Box, MenuItem, FormControlLabel, Switch, Paper } from '@mui/material';
import ProductService from '../../_services/ProductService';

const ProductForm = () => {
    const [product, setProduct] = useState({
        productName: '',
        productDescription: '',
        productPrice: '',
        stockQuantity: '',
        isAvailable: true,
        categoryId: 2,
        adminId: 2,
        dateAdded: new Date().toISOString(),
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
            const response = await ProductService.createProduct(product, imageFile);
            console.log('Product added:', response);
            setSuccess(true);
            // Reset the form after successful submission
            setProduct({
                productName: '',
                productDescription: '',
                productPrice: '',
                stockQuantity: '',
                isAvailable: true,
                categoryId: 2,
                adminId: 2,
                dateAdded: new Date().toISOString(),
            });
            setImageFile(null);
        } catch (error) {
            console.error('Error adding product:', error);
            setError('Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{marginTop:'10%'}}>
            <Paper elevation={3} sx={{ padding: '24px' }}>
                <Typography variant="h4" gutterBottom>Add Product</Typography>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">Product added successfully!</Typography>}
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2} alignItems="center">
                        {/* Row 1: Product Name and Product Price */}
                        <Grid item xs={12} sm={4}>
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
                        <Grid item xs={12} sm={4}>
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
                        {/* Row 2: Stock Quantity and Availability */}
                        <Grid item xs={12} sm={4}>
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
                        {/* Row 2: Product Description */}
                        <Grid item xs={4}>
                            <TextField
                                name="productDescription"
                                label="Product Description"
                                fullWidth
                                value={product.productDescription}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                variant="outlined"
                            />
                        </Grid>
                        {/* Row 4: Image Upload */}
                        <Grid item xs={12} sm={4}>
                            <Button variant="contained" component="label" fullWidth>
                                Upload Product Image
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </Button>
                            {imageFile && <Typography variant="body2">{imageFile.name}</Typography>}
                        </Grid>
                        {/* Submit Button */}
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={loading}
                                size="meduim"
                            >
                                {loading ? <CircularProgress size={18} /> : 'Add Product'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProductForm;
