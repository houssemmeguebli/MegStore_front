import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, CircularProgress, Grid, Box, Paper } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CategoryService from "../../../_services/CategoryService";

export default function CategoriesDetails() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({
        categorydName: '',
        categoryDescription: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchCategory() {
            setLoading(true);
            try {
                const data = await CategoryService.getCategoryById(categoryId);
                setCategory({
                    categorydName: data.categorydName,
                    categoryDescription: data.categoryDescription
                });
            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategory();
    }, [categoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value
        }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let fieldErrors = { ...errors };

        switch (name) {
            case 'categorydName':
                if (!value.trim()) {
                    fieldErrors.categorydName = "Category Name is required.";
                } else {
                    delete fieldErrors.categorydName;
                }
                break;

            case 'categoryDescription':
                if (!value.trim()) {
                    fieldErrors.categoryDescription = "Category Description is required.";
                } else if (value.length < 10) {
                    fieldErrors.categoryDescription = "Category Description must be at least 10 characters long.";
                } else {
                    delete fieldErrors.categoryDescription;
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
        validateField(name, category[name]);
    };

    const validateForm = () => {
        const hasErrors = Object.values(errors).some((error) => error);
        const hasEmptyFields = Object.values(category).some((value) => value === '' || value === null);
        setIsFormValid(!hasErrors && !hasEmptyFields);
    };

    useEffect(() => {
        validateForm();
    }, [category, errors]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await CategoryService.updateCategory(categoryId, category);
            setSuccess(true);
            setError('');
            navigate('/admin/categories');
        } catch (error) {
            setError("Failed to update category. Please try again.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
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
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2} alignItems="center">
                        {/* Category Name */}
                        <Grid item xs={12}>
                            <TextField
                                name="categorydName"
                                label="Category Name"
                                fullWidth
                                value={category.categorydName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.categorydName}
                                helperText={touched.categorydName && errors.categorydName}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        {/* Category Description */}
                        <Grid item xs={12}>
                            <TextField
                                name="categoryDescription"
                                label="Category Description"
                                fullWidth
                                value={category.categoryDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.categoryDescription}
                                helperText={touched.categoryDescription && errors.categoryDescription}
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
                                disabled={loading || !isFormValid}
                                size="large"
                            >
                                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}
