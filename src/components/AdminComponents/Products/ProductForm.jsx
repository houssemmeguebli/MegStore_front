import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Container, Typography, CircularProgress, Grid, Box, MenuItem, FormControl, InputLabel, Select, Paper
} from '@mui/material';
import ProductService from '../../../_services/ProductService';
import CategoryService from '../../../_services/CategoryService';

const ProductForm = () => {
    const [product, setProduct] = useState({
        productName: '',
        productDescription: '',
        productPrice: '',
        stockQuantity: '',
        isAvailable: true,
        categoryId: '',
        adminId: 2,
        dateAdded: new Date().toISOString(),
        ItemQuantiy: 0,  // Corrected field name here
    });

    const [categories, setCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); // Changed to handle multiple files
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const categoryData = await CategoryService.getAllCategories();
                console.log('Fetched categories:', categoryData);
                if (Array.isArray(categoryData)) {
                    setCategories(categoryData);
                } else {
                    console.error('Unexpected category data structure:', categoryData);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        console.log(`Field ${e.target.name} changed to: ${e.target.value}`);
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        console.log('Selected files:', e.target.files);
        // Convert FileList to Array and update state
        setImageFiles(Array.from(e.target.files));
    };

    const handleCategoryChange = (e) => {
        console.log('Category changed to:', e.target.value);
        setProduct({
            ...product,
            categoryId: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        console.log('Submitting product:', product);

        try {
            console.log("product:",product);
            console.log("imageFiles:",imageFiles);
            const response = await ProductService.createProduct(product, imageFiles);
            console.log('Product added:', response);
            setSuccess(true);

            setProduct({
                productName: '',
                productDescription: '',
                productPrice: '',
                stockQuantity: '',
                isAvailable: true,
                categoryId: '',
                adminId: 2,
                dateAdded: new Date().toISOString(),
                ItemQuantiy: '',  // Reset this field too
            });
            setImageFiles([]); // Clear selected files
          //  window.location.reload();
        } catch (error) {
            console.error('Error adding product:', error);
            setError('Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ marginTop: '10%' }}>
            <Paper elevation={3} sx={{ padding: '24px' }}>
                <Typography variant="h4" gutterBottom>Add Product</Typography>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">Product added successfully!</Typography>}
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2} alignItems="center">
                        {/* Row 1: Product Name and Product Price */}
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

                        {/* Row 2: Stock Quantity */}
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

                        {/* Row 3: Category Dropdown */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="category-select-label">Category</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    name="categoryId"
                                    value={product.categoryId}
                                    onChange={handleCategoryChange}
                                    label="Category"
                                    required
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.categoryId} value={category.categoryId}>
                                            {category.categorydName} {/* Corrected typo */}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Row 4: Product Description */}
                        <Grid item xs={12} sm={8}>
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
                        {/* Row 5: Image Upload */}
                        <Grid item xs={12} sm={4}>
                            <Button variant="contained" component="label" fullWidth>
                                Upload Product Images
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple // Allow multiple file selections
                                />
                            </Button>
                            {imageFiles.length > 0 && (
                                <Typography variant="body2">
                                    {imageFiles.map(file => file.name).join(', ')}
                                </Typography>
                            )}
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12} >
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={loading}
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
