import React, { useEffect, useState } from 'react';
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
        timesUsed: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        validateForm();
    }, [coupon]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCoupon({
            ...coupon,
            [name]: type === 'checkbox' ? checked : value
        });
        validateField(name, value); // Fix the validation call here
    };

    const validateField = (name, value) => {
        let fieldErrors = { ...errors };
        switch (name) {
            case 'code':
                if (!value.trim()) {
                    fieldErrors.code = "Code is required.";
                } else {
                    delete fieldErrors.code;
                }
                break;
            case 'startDate':
                if (!value.trim()) {
                    fieldErrors.startDate = "Start date is required.";
                } else {
                    delete fieldErrors.startDate;
                }
                break;
            case 'expiryDate':
                if (!value.trim()) {
                    fieldErrors.expiryDate = "Expiry date is required.";
                } else if (new Date(coupon.startDate) > new Date(value)) {
                    fieldErrors.expiryDate = "Start date cannot be after expiry date.";
                } else {
                    delete fieldErrors.expiryDate;
                }
                break;
            case 'discountPercentage':
                if (!value) {
                    fieldErrors.discountPercentage = "Discount percentage is required.";
                } else if (isNaN(value) || value <= 0) {
                    fieldErrors.discountPercentage = "Discount percentage must be a positive number.";
                } else {
                    delete fieldErrors.discountPercentage;
                }
                break;
            case 'minimumOrderAmount':
                if (!value) {
                    fieldErrors.minimumOrderAmount = "Minimum order amount is required.";
                } else if (isNaN(value) || value < 0) {
                    fieldErrors.minimumOrderAmount = "Minimum order amount must be a positive number.";
                } else {
                    delete fieldErrors.minimumOrderAmount;
                }
                break;
            case 'usageLimit':
                if (!value) {
                    fieldErrors.usageLimit = "Usage limit is required.";
                } else if (isNaN(value) || value < 0) {
                    fieldErrors.usageLimit = "Usage limit must be a positive number.";
                } else {
                    delete fieldErrors.usageLimit;
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
        validateField(name, coupon[name]);
    };

    const validateForm = () => {
        const hasErrors = Object.values(errors).some((error) => error);
        const hasEmptyFields = Object.values(coupon).some((value) => value === '' || value === null);
        setIsFormValid(!hasErrors && !hasEmptyFields);
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
                timesUsed: 0
            });

        } catch (error) {
            console.error('Error adding coupon:', error);
            setError('Failed to add coupon. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 5, marginTop: "10%" }}>
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
                                onBlur={handleBlur}
                                error={!!errors.code}
                                helperText={errors.code}
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
                                onBlur={handleBlur}
                                error={!!errors.discountPercentage}
                                helperText={errors.discountPercentage}
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
                                onBlur={handleBlur}
                                error={!!errors.startDate}
                                helperText={errors.startDate}
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
                                onBlur={handleBlur}
                                error={!!errors.expiryDate}
                                helperText={errors.expiryDate}
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

                        {/* Minimum Order Amount */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="minimumOrderAmount"
                                label="Minimum Order Amount"
                                fullWidth
                                value={coupon.minimumOrderAmount}
                                onBlur={handleBlur}
                                error={!!errors.minimumOrderAmount}
                                helperText={errors.minimumOrderAmount}
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
                                onBlur={handleBlur}
                                error={!!errors.usageLimit}
                                helperText={errors.usageLimit}
                                onChange={handleChange}
                                type="number"
                                variant="outlined"
                                required
                                InputProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ textAlign: 'center', mt: 3 }}></Grid>
                        <Grid item xs={12} sm={4} sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={loading || !isFormValid}
                                size="large"
                                sx={{
                                    borderRadius: '8px',
                                    bgcolor: loading ? 'grey.400' : 'primary.main',
                                    '&:hover': {
                                        bgcolor: loading ? 'grey.300' : 'primary.dark',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Add Coupon'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ textAlign: 'center', mt: 3 }}></Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default CouponForm;
