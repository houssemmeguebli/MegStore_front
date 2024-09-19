import React, { useEffect, useState } from "react";
import {
    TextField, Button, Typography, CircularProgress, Grid, Switch,
    FormControlLabel, Box, Paper, IconButton, Snackbar
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../../_services/ProductService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import Swal from 'sweetalert2';
import MuiAlert from '@mui/material/Alert';

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
    const [product, setProduct] = useState({
        productName: '',
        productPrice: '',
        stockQuantity: '',
        productDescription: '',
        isAvailable: false,
        imageUrls: [],
        dateAdded: '',
    });

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            try {
                const data = await ProductService.getProductById(productId);
                setProduct(data);
                const previews = data.imageUrls.map(url => `https://localhost:7048/${url}`);
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

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setImageFiles(prevFiles => [...prevFiles, ...newFiles]);

        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: type === 'checkbox' ? checked : value,
        }));
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
            formData.append('isAvailable', product.isAvailable);

            imageFiles.forEach(file => {
                formData.append('imageFiles', file);
            });

            const updatedImageUrls = [...imagePreviews, ...deletedImages];
            formData.append('imageUrls', JSON.stringify(updatedImageUrls));

            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

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

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
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
                            <Slider {...carouselSettings} className="rounded-lg shadow-md">
                                {imagePreviews.map((url, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={url}
                                            alt={`Product Image ${index}`}
                                            className="w-full h-auto object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/300x400";
                                            }}
                                        />
                                        <IconButton
                                            color="error"
                                            className="absolute top-2 right-2"
                                            onClick={() => handleImageDelete(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                ))}
                            </Slider>
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
                                        required
                                        variant="outlined"
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
                                        required
                                        variant="outlined"
                                        className="mb-4"
                                        inputProps={{ min: 0 }}
                                        sx={{ '& .MuiInputBase-input': { color: 'black' } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="stockQuantity"
                                        label="Stock Quantity"
                                        type="number"
                                        fullWidth
                                        value={product.stockQuantity}
                                        onChange={handleInputChange}
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
                                        variant="outlined"
                                        className="mb-4"
                                        sx={{ '& .MuiInputBase-input': { color: 'black' } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                name="isAvailable"
                                                checked={product.isAvailable}
                                                onChange={handleInputChange}
                                            />
                                        }
                                        label="Available"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        id="fileInput"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="fileInput">
                                        <Button
                                            component="span"
                                            variant="contained"
                                            startIcon={<UploadIcon />}
                                            className="mb-4"
                                        >
                                            Upload Images
                                        </Button>
                                    </label>
                                </Grid>
                                {imageFiles.length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" className="mb-2">Selected Files:</Typography>
                                        <Box className="flex flex-wrap gap-2">
                                            {imageFiles.map((file, index) => (
                                                <Paper key={index} className="p-2 shadow-md rounded-lg">
                                                    <Typography variant="body2">{file.name}</Typography>
                                                </Paper>
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update Product"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Snackbar open={error !== ''} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error">{error}</Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success">Product updated successfully!</Alert>
            </Snackbar>
        </Box>
    );
}
