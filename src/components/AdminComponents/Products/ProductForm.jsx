import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Container, Typography, CircularProgress, Grid, Box, MenuItem, FormControl, InputLabel, Select, Paper
} from '@mui/material';
import ProductService from '../../../_services/ProductService';
import CategoryService from '../../../_services/CategoryService';
import AuthService from "../../../_services/AuthService";

const currentAdmin = AuthService.getCurrentUser();

const ProductForm = () => {
    const [product, setProduct] = useState({
        productName: '',
        productDescription: '',
        productPrice: '',
        stockQuantity: '',
        isAvailable: true,
        categoryId: '',
        adminId: currentAdmin.id,
        dateAdded: new Date().toISOString(),
        itemQuantity: 0,
    });

    const [categories, setCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const categoryData = await CategoryService.getAllCategories();
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

    useEffect(() => {
        validateForm();
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });

        validateField(name, value);
    };

    const handleFileChange = (e) => {
        setImageFiles(Array.from(e.target.files));
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setProduct({
            ...product,
            categoryId: value,
        });

        validateField('categoryId', value);
    };

    const validateField = (name, value) => {
        let fieldErrors = { ...errors };

        switch (name) {
            case 'productName':
                if (!value.trim()) {
                    fieldErrors.productName = "Product Name is required.";
                } else if (value.length < 3) {
                    fieldErrors.productName = "Product Name must be at least 3 characters long.";
                } else {
                    delete fieldErrors.productName;
                }
                break;

            case 'productDescription':
                if (!value.trim()) {
                    fieldErrors.productDescription = "Product Description is required.";
                } else if (value.length < 10) {
                    fieldErrors.productDescription = "Product Description must be at least 10 characters long.";
                } else {
                    delete fieldErrors.productDescription;
                }
                break;

            case 'productPrice':
                if (!value) {
                    fieldErrors.productPrice = "Product Price is required.";
                } else if (isNaN(value) || value <= 0) {
                    fieldErrors.productPrice = "Product Price must be a positive number.";
                } else {
                    delete fieldErrors.productPrice;
                }
                break;

            case 'stockQuantity':
                if (!value) {
                    fieldErrors.stockQuantity = "Stock Quantity is required.";
                } else if (isNaN(value) || value < 0) {
                    fieldErrors.stockQuantity = "Stock Quantity must be a positive number.";
                } else {
                    delete fieldErrors.stockQuantity;
                }
                break;
            case 'discountPercentage':
                if (!value) {
                    fieldErrors.discountPercentage = "Discount Percentage must be a positive number.";
                } else {
                    delete fieldErrors.discountPercentage;
                }
                break;

            case 'categoryId':
                if (!value) {
                    fieldErrors.categoryId = "Category is required.";
                } else {
                    delete fieldErrors.categoryId;
                }
                break;

            default:
                break;
        }

        setErrors(fieldErrors);
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
        validateField(name, product[name]);
    };

    const validateForm = () => {
        const hasErrors = Object.values(errors).some((error) => error);
        const hasEmptyFields = Object.values(product).some((value) => value === '' || value === null);
        setIsFormValid(!hasErrors && !hasEmptyFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess(false);

        try {
            await ProductService.createProduct(product, imageFiles);
            setSuccess(true);
            setProduct({
                productName: '',
                productDescription: '',
                productPrice: '',
                stockQuantity: '',
                isAvailable: true,
                categoryId: '',
                adminId: currentAdmin.id,
                dateAdded: new Date().toISOString(),
                itemQuantity: 0,
            });
            setImageFiles([]);
        } catch (error) {
            setErrors({ submit: 'Failed to add product. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ marginTop: '10%' }}>
            <Paper elevation={3} sx={{ padding: '24px' }}>
                <Typography variant="h4" gutterBottom>Add Product</Typography>
                {errors.submit && <Typography color="error">{errors.submit}</Typography>}
                {success && <Typography color="primary">Product added successfully!</Typography>}
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="productName"
                                label="Product Name"
                                fullWidth
                                value={product.productName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                variant="outlined"
                                error={!!errors.productName}
                                helperText={errors.productName}
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
                                onBlur={handleBlur}
                                required
                                variant="outlined"
                                error={!!errors.productPrice}
                                helperText={errors.productPrice}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="discountPercentage"
                                label="Discount %"
                                fullWidth
                                value={product.discountPercentage}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.discountPercentage}
                                helperText={errors.discountPercentage}
                                variant="outlined"
                                className="mb-4"
                                sx={{ '& .MuiInputBase-input': { color: 'black' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="stockQuantity"
                                label="Stock Quantity"
                                type="number"
                                fullWidth
                                value={product.stockQuantity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                variant="outlined"
                                error={!!errors.stockQuantity}
                                helperText={errors.stockQuantity}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined" error={!!errors.categoryId}>
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
                                            {category.categorydName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.categoryId && <Typography color="error">{errors.categoryId}</Typography>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="productDescription"
                                label="Product Description"
                                fullWidth
                                value={product.productDescription}
                                onChange={handleChange}
                                multiline
                                required
                                onBlur={handleBlur}
                                rows={3}
                                variant="outlined"
                                error={!!errors.productDescription}
                                helperText={errors.productDescription}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" component="label" fullWidth>
                                Upload Product Images
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                />
                            </Button>
                            {imageFiles.length > 0 && (
                                <Typography variant="body2">
                                    {imageFiles.map(file => file.name).join(', ')}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={loading || !isFormValid}
                                startIcon={loading && <CircularProgress size={20} />}
                            >
                                Add Product
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProductForm;
