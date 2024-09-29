import React, { useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress, Grid, Box, Paper, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CouponService from "../../../_services/CouponService"; // Adjust the path as needed

const CouponForm = () => {
    const [coupon, setCoupon] = useState({
        code: '',
        discountPercentage: '',
        isActive: false,
        startDate: '',
        expiryDate: '',
        minimumOrderAmount: '',
        usageLimit: '',
        timesUsed: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCoupon({
            ...coupon,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await CouponService.createCoupon(coupon); // Adjust method as needed
            console.log('Coupon added:', response);
            setSuccess(true);

            // Reset the form after successful submission
            setCoupon({
                code: '',
                discountPercentage: '',
                isActive: false,
                startDate: '',
                expiryDate: '',
                minimumOrderAmount: '',
                usageLimit: '',
                timesUsed: ''
            });

        } catch (error) {
            console.error('Error adding coupon:', error);
            setError('Failed to add coupon. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 5 ,marginTop:"10%" }}>
            <Paper elevation={5} sx={{ p: 4, borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h5" component="h3" sx={{ fontWeight: '600', mb: 2, textAlign: 'center' }}>
                    Add Coupon
                </Typography>
                {error && <Typography sx={{ color: 'red', textAlign: 'center' }}>{error}</Typography>}
                {success && <Typography sx={{ color: 'green', textAlign: 'center' }}>Coupon added successfully!</Typography>}

                <Box component="form" className="mt-4" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2}>
                        {/* Coupon Code */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="code"
                                label="Coupon Code"
                                fullWidth
                                value={coupon.code}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            />
                        </Grid>

                        {/* Discount Percentage */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="discountPercentage"
                                label="Discount Percentage"
                                fullWidth
                                value={coupon.discountPercentage}
                                onChange={handleChange}
                                type="number"
                                required
                                variant="outlined"
                                InputProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            />
                        </Grid>



                        {/* Start Date */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="startDate"
                                label="Start Date"
                                type="date"
                                fullWidth
                                value={coupon.startDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                required
                                InputProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            />
                        </Grid>

                        {/* Expiry Date */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="expiryDate"
                                label="Expiry Date"
                                type="date"
                                fullWidth
                                value={coupon.expiryDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                InputProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            />
                        </Grid>

                        {/* Minimum Order Amount */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="minimumOrderAmount"
                                label="Minimum Order Amount"
                                fullWidth
                                value={coupon.minimumOrderAmount}
                                onChange={handleChange}
                                type="number"
                                required
                                variant="outlined"
                                InputProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            />
                        </Grid>

                        {/* Usage Limit */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="usageLimit"
                                label="Usage Limit"
                                fullWidth
                                value={coupon.usageLimit}
                                onChange={handleChange}
                                type="number"
                                variant="outlined"
                                required
                                InputProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            />
                        </Grid>

                        {/* Times Used */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="timesUsed"
                                label="Times Used"
                                fullWidth
                                value={coupon.timesUsed}
                                onChange={handleChange}
                                type="number"
                                variant="outlined"
                                required
                                InputProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            />
                        </Grid>
                        {/* Active Status */}
                        <Grid item xs={12} sm={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={coupon.isActive}
                                        onChange={handleChange}
                                        name="isActive"
                                        color="primary"
                                    />
                                }
                                label="Is Active"
                            />
                        </Grid>
                        {/* Submit Button */}
                        <Grid item xs={12} sm={4} sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={loading}
                                size="large"
                                sx={{
                                    borderRadius: '8px',
                                    bgcolor: loading ? 'grey.400' : 'primary.main',
                                    '&:hover': {
                                        bgcolor: loading ? 'grey.300' : 'primary.dark',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24}/> : 'Add Coupon'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default CouponForm;
