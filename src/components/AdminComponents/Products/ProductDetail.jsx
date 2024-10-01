import React, { useEffect, useState } from "react";
import {
    TextField, Button, Typography, CircularProgress, Grid,
    FormControlLabel, Switch, Box, Paper, IconButton, Snackbar, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../../_services/ProductService";
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import MuiAlert from '@mui/material/Alert';
import CategoryService from "../../../_services/CategoryService";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

export default function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const [product, setProduct] = useState({
        productName: '',
        productPrice: '',
        stockQuantity: '',
        productDescription: '',
        categoryId: '',
        isAvailable: false,
        imageUrls: [],
        dateAdded: '',
        discountPercentage:'',

    });

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            try {
                const data = await ProductService.getProductById(productId);
                setProduct(data);
                const previews = Array.from(new Set(data.imageUrls.map(url => `https://localhost:7048/${url}`))); // Ensure unique URLs
                setImagePreviews(previews);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Failed to fetch product details.");
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [productId]);
    useEffect(() => {
        validateForm();
    }, [product]);



    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setImageFiles(prevFiles => [...prevFiles, ...newFiles]);

        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...new Set([...prevPreviews, ...newPreviews])]); // Ensure unique previews
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: type === 'checkbox' ? checked : value,
        }));
        validateField(name, value);

    };

    const handleImageDelete = async (index) => {
        try {
            const imageUrl = product.imageUrls[index];

            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete this image: ${imageUrl}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it',
                reverseButtons: true
            });

            if (result.isConfirmed) {
                await ProductService.deleteProductImage(productId, imageUrl);
                setDeletedImages(prevDeletedImages => [...prevDeletedImages, imageUrl]);
                setProduct(prevProduct => ({
                    ...prevProduct,
                    imageUrls: prevProduct.imageUrls.filter((_, i) => i !== index),
                }));
                setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));

                Swal.fire('Deleted!', 'The image has been deleted.', 'success');
            } else {
                Swal.fire('Cancelled', 'Your image is safe :)', 'info');
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            Swal.fire('Error!', 'Failed to delete the image. Please try again.', 'error');
        }
    };
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

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setProduct({
            ...product,
            categoryId: value,
        });

        validateField('categoryId', value);
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        if (!product.productName || product.productPrice <= 0 || product.stockQuantity <= 0) {
            setError("Please provide valid product details.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('productName', product.productName);
            formData.append('productPrice', product.productPrice);
            formData.append('stockQuantity', product.stockQuantity);
            formData.append('productDescription', product.productDescription);
            formData.append('discountPercentage', product.discountPercentage);
            formData.append('isAvailable', product.isAvailable);
            imageFiles.forEach(file => {
                formData.append('imageFiles', file);
            });

            const updatedImageUrls = [...imagePreviews, ...deletedImages];
            formData.append('imageUrls', JSON.stringify(updatedImageUrls));
            formData.append('categoryId',product.categoryId);
            formData.set('adminId',product.adminId);
            await ProductService.updateProduct(productId, formData);

            setSuccess(true);
            setImageFiles([]);
            setImagePreviews([]);

            navigate('/admin/products');
        } catch (error) {
            console.error("Error updating product:", error.response?.data || error.message);
            setError(error.response?.data?.title || "Failed to update product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center text-lg font-semibold">No product found</div>
            </div>
        );
    }
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



    return (
        <Box className="p-8 mx-auto max-w-7xl" sx={{ marginTop: '5%' }}>
            <Paper elevation={3} className="p-8 shadow-lg bg-white rounded-lg">
                <Typography variant="h4" gutterBottom className="mb-4 font-bold text-gray-800">
                    Edit Product
                </Typography>
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                {success && <Alert severity="success" className="mb-4">Product updated successfully!</Alert>}
                <Box component="form" className="mt-4" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Box className="mb-4">
                                <img
                                    src={imagePreviews[currentImageIndex] || "https://via.placeholder.com/600x400"}
                                    alt={`Product Image`}
                                    className="w-full h-auto object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/600x400";
                                    }}
                                />
                            </Box>
                            <Grid container spacing={1}>
                                {imagePreviews.map((url, index) => (
                                    <Grid item xs={4} key={index}>
                                        <img
                                            src={url}
                                            alt={`Thumbnail ${index}`}
                                            className={`w-full h-auto object-cover rounded-lg cursor-pointer ${currentImageIndex === index ? 'border-2 border-blue-500' : ''}`}
                                            onClick={() => handleThumbnailClick(index)}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/100x100";
                                            }}
                                        />
                                        <IconButton
                                            color="error"
                                            onClick={() => handleImageDelete(index)}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="productName"
                                        label="Product Name"
                                        fullWidth
                                        value={product.productName}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        required
                                        variant="outlined"
                                        error={!!errors.productName}
                                        helperText={errors.productName}
                                        className="mb-4"
                                        sx={{ '& .MuiInputBase-input': { color: 'black' } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="productPrice"
                                        label="Product Price (USD)"
                                        type="number"
                                        fullWidth
                                        value={product.productPrice}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={!!errors.productPrice}
                                        helperText={errors.productPrice}
                                        required
                                        variant="outlined"
                                        className="mb-4"
                                        inputProps={{ min: 0 }}
                                        sx={{ '& .MuiInputBase-input': { color: 'black' } }}
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
                                <Grid item xs={12}>
                                    <TextField
                                        name="stockQuantity"
                                        label="Stock Quantity"
                                        type="number"
                                        fullWidth
                                        value={product.stockQuantity}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={!!errors.stockQuantity}
                                        helperText={errors.stockQuantity}
                                        required
                                        variant="outlined"
                                        className="mb-4"
                                        inputProps={{ min: 0 }}
                                        sx={{ '& .MuiInputBase-input': { color: 'black' } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="productDescription"
                                        label="Product Description"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={product.productDescription}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        required
                                        variant="outlined"
                                        className="mb-4"
                                        sx={{ '& .MuiInputBase-input': { color: 'black' } }}
                                        error={!!errors.productDescription}
                                        helperText={errors.productDescription}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="discountPercentage"
                                        label="Discount %"
                                        fullWidth
                                        value={product.discountPercentage}
                                        error={!!errors.discountPercentage}
                                        helperText={errors.discountPercentage}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        required
                                        variant="outlined"
                                        className="mb-4"
                                        sx={{ '& .MuiInputBase-input': { color: 'black' } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={product.isAvailable}
                                                onChange={handleInputChange}
                                                name="isAvailable"
                                            />
                                        }
                                        label="Available for Purchase"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<UploadIcon />}
                                        fullWidth
                                        className="mb-4"
                                    >
                                        Upload Images
                                        <input
                                            type="file"
                                            hidden
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        color="primary"
                                        fullWidth
                                        disabled={!isFormValid}
                                    >
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error">
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success">
                    Product updated successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}
