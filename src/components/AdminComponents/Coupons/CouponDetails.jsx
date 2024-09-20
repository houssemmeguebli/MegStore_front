import React, { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Typography,
    CircularProgress,
    Grid,
    Box,
    Paper,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CouponService from "../../../_services/CouponService";
import Swal from "sweetalert2"; // Adjust the path as necessary

export default function CouponDetails() {
    const { couponId } = useParams();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function fetchCoupon() {
            try {
                const data = await CouponService.getCouponById(couponId);
                setCoupon(data);
            } catch (error) {
                console.error("Error fetching coupon:", error);
            }
        }

        fetchCoupon();
    }, [couponId]);

    const handleChange = (e) => {
        setCoupon({
            ...coupon,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save the changes to this coupon?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel!'
        });

        if (result.isConfirmed) {
            // Prepare data to send
            const couponData = {
                ...coupon,
                timesUsed: coupon.timesUsed || null // Ensure nullable type
            };

            try {
                await CouponService.updateCoupon(couponId, couponData);
                setSuccess(true);
                setError('');
                // Show success alert
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
                setSuccess(false);
                // Show error alert
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
            setLoading(false); // Reset loading state if cancelled
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
            <Paper elevation={3} sx={{ padding: '24px' }}>
                <Typography variant="h4" gutterBottom>Edit Coupon</Typography>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">Coupon updated successfully!</Typography>}
                <br />
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Grid container spacing={2} alignItems="center">
                        {/* Coupon Code */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="code"
                                label="Coupon Code"
                                fullWidth
                                value={coupon.code}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        {/* Discount Percentage */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="discountPercentage"
                                label="Discount Percentage"
                                fullWidth
                                type="number"
                                value={coupon.discountPercentage}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        {/* Active Status */}
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isActive"
                                        checked={coupon.isActive}
                                        onChange={(e) => setCoupon({ ...coupon, isActive: e.target.checked })}
                                    />
                                }
                                label="Is Active"
                            />
                        </Grid>

                        {/* Start Date */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="startDate"
                                label="Start Date"
                                fullWidth
                                type="date"
                                value={new Date(coupon.startDate).toISOString().split('T')[0]}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        {/* Expiry Date */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="expiryDate"
                                label="Expiry Date"
                                fullWidth
                                type="date"
                                value={coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        {/* Minimum Order Amount */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="minimumOrderAmount"
                                label="Minimum Order Amount"
                                fullWidth
                                type="number"
                                value={coupon.minimumOrderAmount || ''}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        {/* Usage Limit */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="usageLimit"
                                label="Usage Limit"
                                fullWidth
                                type="number"
                                value={coupon.usageLimit || ''}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        {/* Times Used */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="timesUsed"
                                label="Times Used"
                                fullWidth
                                type="number"
                                value={coupon.timesUsed || ''}
                                onChange={handleChange}
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
