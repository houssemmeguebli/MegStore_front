import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, CircularProgress, Grid, Switch, FormControlLabel, Box, Paper } from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import CategoryService from "../../../_services/CategoryService";
import ProductService from "../../../_services/ProductService";

export default function CategoriesDetails() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        async function fetchCategory() {
            try {
                const data = await CategoryService.getCategoryById(categoryId);
                setCategory(data);

                const relatedData = await ProductService.getProductsByCategory(categoryId);
                setRelatedProducts(relatedData);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        }

        fetchCategory();
    }, [categoryId]);

    const handleChange = (e) => {
        setCategory({
            ...category,
            [e.target.name]: e.target.value
        });
    };

    const handleSwitchChange = (e) => {
        setCategory({
            ...category,
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
            const response = await CategoryService.updateCategory(categoryId, category, imageFile);
            setSuccess(true);
            setError('');
            setImageFile(null);
            navigate('/admin/categories');
        } catch (error) {
            setError("Failed to update category. Please try again.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    if (!category) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center text-lg font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <Box sx={{ padding: '24px', marginTop: '10%' }}>
            <Paper elevation={3} sx={{ padding: '24px' }}>
                <Typography variant="h4" gutterBottom>Edit Category</Typography>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">Category updated successfully!</Typography>}
                <br/>
                <Box component="form" sx={{mt: 2}} onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2} alignItems="center">
                        {/* Category Name */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                name="categorydName"
                                label="Category Name"
                                fullWidth
                                value={category.categorydName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <br/>
                        {/* Category Description */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                name="categoryDescription"
                                label="Category Description"
                                fullWidth
                                value={category.categoryDescription}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                variant="outlined"
                            />
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
                                {loading ? <CircularProgress size={24}/> : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}
