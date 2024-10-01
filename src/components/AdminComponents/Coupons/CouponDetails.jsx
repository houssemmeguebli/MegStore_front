import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CouponService from "../../../_services/CouponService";
import Swal from "sweetalert2";

export default function CouponDetails() {
    const { couponId } = useParams();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const data = await CouponService.getCouponById(couponId);
                setCoupon(data);
            } catch (error) {
                console.error("Error fetching coupon:", error);
                setError("Failed to fetch coupon details.");
            }
        };
        fetchCoupon();
    }, [couponId]);

    useEffect(() => {
        validateForm();
    }, [coupon, errors]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the coupon state
        setCoupon((prevCoupon) => ({
            ...prevCoupon,
            [name]: value,
        }));

        // Call validation on the field being updated
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let fieldErrors = { ...errors };

        switch (name) {
            case 'code':
                fieldErrors.code = value.trim() ? undefined : "Code is required.";
                break;
            case 'startDate':
                fieldErrors.startDate = value.trim() ? undefined : "Start date is required.";
                break;
            case 'expiryDate':
                if (!value.trim()) {
                    fieldErrors.expiryDate = "Expiry date is required.";
                } else if (new Date(coupon.startDate) > new Date(value)) {
                    fieldErrors.expiryDate = "Start date cannot be after expiry date.";
                } else {
                    fieldErrors.expiryDate = undefined;
                }
                break;
            case 'discountPercentage':
            case 'minimumOrderAmount':
            case 'usageLimit':
                fieldErrors[name] = value
                    ? (isNaN(value) || value < 0)
                        ? `${name.replace(/([A-Z])/g, ' $1')} must be a positive number.`
                        : undefined
                    : `${name.replace(/([A-Z])/g, ' $1')} is required.`;
                break;
            default:
                break;
        }

        setErrors(fieldErrors);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const validateForm = () => {
        const hasErrors = Object.values(errors).some((error) => error);
        const hasEmptyFields = Object.values(coupon).some((value) => !value);
        setIsFormValid(!hasErrors && !hasEmptyFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save the changes to this coupon?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel!'
        });

        if (result.isConfirmed) {
            const couponData = {
                ...coupon,
                timesUsed: coupon.timesUsed || null
            };

            try {
                await CouponService.updateCoupon(couponId, couponData);
                setSuccess(true);
                setError('');
                await Swal.fire({
                    title: 'Success!',
                    text: 'Coupon updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/admin/coupons');
            } catch (error) {
                console.error("Error updating coupon:", error);
                setError("Failed to update coupon. Please try again.");
                await Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update coupon. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    if (!coupon) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center text-lg font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <Box sx={{ padding: '24px', marginTop: '10%' }}>
            <Grid container spacing={4}>
                {/* Statistics Cards */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6">Usage Limit</Typography>
                            <Typography variant="h4">{coupon.usageLimit}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6">Times Used</Typography>
                            <Typography variant="h4">{coupon.timesUsed}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6">Active Status</Typography>
                            <Typography variant="h4">{coupon.isActive ? "Active" : "Inactive"}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{ marginTop: '20px' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>Edit Coupon</Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    {success && <Typography color="primary">Coupon updated successfully!</Typography>}
                    <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} noValidate autoComplete="off">
                        <Grid container spacing={2}>
                            {/* Coupon Code */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="code"
                                    label="Coupon Code"
                                    fullWidth
                                    value={coupon.code || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.code}
                                    helperText={errors.code}
                                    required
                                    variant="outlined"
                                />
                            </Grid>

                            {/* Discount Percentage */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="discountPercentage"
                                    label="Discount Percentage"
                                    fullWidth
                                    type="number"
                                    value={coupon.discountPercentage || ''}
                                    onBlur={handleBlur}
                                    error={!!errors.discountPercentage}
                                    helperText={errors.discountPercentage}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="startDate"
                                    label="Start Date"
                                    fullWidth
                                    type="date"
                                    value={coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.startDate}
                                    helperText={errors.startDate}
                                    required
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="expiryDate"
                                    label="Expiry Date"
                                    fullWidth
                                    type="date"
                                    value={coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.expiryDate}
                                    helperText={errors.expiryDate}
                                    variant="outlined"
                                />
                            </Grid>

                            {/* Minimum Order Amount */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="minimumOrderAmount"
                                    label="Minimum Order Amount"
                                    fullWidth
                                    type="number"
                                    value={coupon.minimumOrderAmount || ''}
                                    onBlur={handleBlur}
                                    error={!!errors.minimumOrderAmount}
                                    helperText={errors.minimumOrderAmount}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>

                            {/* Usage Limit */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="usageLimit"
                                    label="Usage Limit"
                                    fullWidth
                                    type="number"
                                    value={coupon.usageLimit || ''}
                                    onBlur={handleBlur}
                                    error={!!errors.usageLimit}
                                    helperText={errors.usageLimit}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>

                            {/* Active Status */}
                            <Grid item xs={12} sm={4}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isActive"
                                            checked={coupon.isActive || false}
                                            onChange={(e) => handleChange({ target: { name: 'isActive', value: e.target.checked } })}
                                        />
                                    }
                                    label="Active"
                                />
                            </Grid>
                        </Grid>

                        <Box mt={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!isFormValid || loading}
                            >
                                {loading ? <CircularProgress size={24} /> : "Update Coupon"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
