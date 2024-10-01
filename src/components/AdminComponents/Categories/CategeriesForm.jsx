import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, CircularProgress, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CategoryService from "../../../_services/CategoryService";

const CategoryForm = () => {
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

    const navigate = useNavigate();

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value
        }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await CategoryService.createCategory(category);
            console.log('Category added:', response);
            setSuccess(true);

            // Reset the form after successful submission
            setCategory({
                categorydName: '',
                categoryDescription: ''
            });
            setTouched({});
            setErrors({});
        } catch (error) {
            console.error('Error adding category:', error);
            setError('Failed to add category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white p-6">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                            Add Category
                        </h3>
                        {error && <Typography className="text-red-500">{error}</Typography>}
                        {success && <Typography className="font-semibold text-lg text-green-500">Category added successfully!</Typography>}
                    </div>
                </div>

                <Box component="form" className="mt-4" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2}>
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
                        <Grid item xs={12} className="text-center mt-4">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={loading || !isFormValid}
                                size="large"
                            >
                                {loading ? <CircularProgress size={24} /> : 'Add Category'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    );
};

export default CategoryForm;
