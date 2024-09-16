import React, { useEffect, useState } from "react";
import {
    TextField, Button, Typography, CircularProgress, Grid, Switch,
    FormControlLabel, Box, Paper, IconButton
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../../_services/ProductService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DeleteIcon from '@mui/icons-material/Delete';

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
        setImageFiles(newFiles);

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

    const handleImageDelete = (index) => {
        const imageToDelete = product.imageUrls[index];
        if (imageToDelete) {
            setDeletedImages(prevDeletedImages => [...prevDeletedImages, imageToDelete]);
            setProduct(prevProduct => ({
                ...prevProduct,
                imageUrls: prevProduct.imageUrls.filter((_, i) => i !== index),
            }));
        }
    };

    const handleSwitchChange = (e) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            [e.target.name]: e.target.checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('ProductName', product.productName);
            formData.append('ProductPrice', product.productPrice);
            formData.append('StockQuantity', product.stockQuantity);
            formData.append('ProductDescription', product.productDescription);
            formData.append('IsAvailable', product.isAvailable);

            if (deletedImages.length > 0) {
                formData.append('DeletedImages', JSON.stringify(deletedImages));
            }

            imageFiles.forEach(file => {
                formData.append('ImageFiles', file);
            });

            await ProductService.updateProduct(productId, formData,imageFiles);

            setSuccess(true);
            setError('');
            setImageFiles([]);
            setImagePreviews([]);
            setDeletedImages([]);
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
        <Box className="p-8 mx-auto max-w-7xl" style={{ marginTop: '10%' }}>
            <Paper elevation={3} className="p-8 shadow-lg">
                <Typography variant="h4" gutterBottom className="mb-4 font-semibold">Edit Product</Typography>
                {error && <Typography color="error" className="mb-4">{error}</Typography>}
                {success && <Typography color="primary" className="mb-4">Product updated successfully!</Typography>}
                <Box component="form" className="mt-4" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} className="mb-6">
                            <Slider {...carouselSettings}>
                                {product.imageUrls.map((url, index) => (
                                    <div key={url} className="relative">
                                        <img
                                            src={`https://localhost:7048/${url}`}
                                            alt={`Product Image ${index}`}
                                            className="w-full h-auto object-cover rounded-lg shadow-md"
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
                                {imagePreviews.map((preview, index) => (
                                    <div key={`preview-${index}`} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Image Preview ${index}`}
                                            className="w-full h-auto object-cover rounded-lg shadow-md"
                                        />
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
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="productDescription"
                                        label="Product Description"
                                        fullWidth
                                        value={product.productDescription}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        className="mb-4"
                                    />
                                </Grid>
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
                                <Grid item xs={12}>
                                    <Button variant="contained" component="label" fullWidth>
                                        Upload Product Images
                                        <input type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
                                    </Button>
                                    {imageFiles.length > 0 && (
                                        <Typography variant="body2" className="mt-2 text-green-500">
                                            {imageFiles.length} new image(s) added.
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} /> : "Update Product"}
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
