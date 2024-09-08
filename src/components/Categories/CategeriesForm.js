import React, { useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress, Grid, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../_services/CategoryService'; // Assuming you have a CategoryService like ProductService

const CategoryForm = () => {
    const [category, setCategory] = useState({
        categoryName: '',
        categoryDescription: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCategory({
            ...category,
            [e.target.name]: e.target.value
        });
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
                categoryName: '',
                categoryDescription: ''
            });

            // Navigate to the /admin/tables page after success
            navigate('/admin/tables');
        } catch (error) {
            console.error('Error adding category:', error);
            setError('Failed to add category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: '24px', marginTop: '32px' }}>
                <Typography variant="h4" gutterBottom>Add Category</Typography>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">Category added successfully!</Typography>}
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2} alignItems="center">
                        {/* Category Name */}
                        <Grid item xs={12}>
                            <TextField
                                name="categoryName"
                                label="Category Name"
                                fullWidth
                                value={category.categoryName}
                                onChange={handleChange}
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
                                multiline
                                rows={3}
                                variant="outlined"
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={loading}
                                size="large"
                            >
                                {loading ? <CircularProgress size={24} /> : 'Add Category'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default CategoryForm;
