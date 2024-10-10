import React, { useState } from 'react';
import Swal from 'sweetalert2';
import AuthService from "../../_services/AuthService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";

const ChangePassword = ({ currentUser }) => {
    console.log("currentUser", currentUser);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isPasswordVisible, setIsPasswordVisible] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const togglePasswordVisibility = (field) => {
        setIsPasswordVisible((prevState) => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    const validateFields = () => {
        let fieldErrors = {};

        if (!passwordData.currentPassword) {
            fieldErrors.currentPassword = "Current Password is required.";
        }
        if (!passwordData.newPassword) {
            fieldErrors.newPassword = "New Password is required.";
        } else if (passwordData.newPassword.length < 6) {
            fieldErrors.newPassword = "New Password must be at least 6 characters long.";
        }
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            fieldErrors.confirmNewPassword = "Passwords do not match.";
        }

        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };

    const handleChangePasswordClick = async () => {
        if (!validateFields()) {
            return;
        }

        try {
            await AuthService.changePassword(
                currentUser.id,
                passwordData.currentPassword,
                passwordData.newPassword,
                passwordData.confirmNewPassword
            );

            Swal.fire("Success", "Password updated successfully", "success");
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
        } catch (error) {
            console.error("Error changing password", error);
            const errorMessage = error.response?.data?.message || "Failed to change password";
            Swal.fire("Error", errorMessage, "error");
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
                <h6 className="text-blueGray-700 text-xl font-bold">Change Password</h6>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form>
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                        Change Your Password
                    </h6>
                    <div className="flex flex-wrap">
                        <div className="w-full mb-4">
                            <TextField
                                fullWidth
                                className="bg-white"
                                label="Current Password"
                                type={isPasswordVisible.currentPassword ? "text" : "password"}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handleInputChange}
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => togglePasswordVisibility('currentPassword')}
                                                aria-label={isPasswordVisible.currentPassword ? "Hide current password" : "Show current password"}
                                                edge="end"
                                            >
                                                {isPasswordVisible.currentPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        </div>

                        <div className="w-full mb-4">
                            <TextField
                                fullWidth
                                className="bg-white"
                                label="New Password"
                                type={isPasswordVisible.newPassword ? "text" : "password"}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handleInputChange}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => togglePasswordVisibility('newPassword')}
                                                aria-label={isPasswordVisible.newPassword ? "Hide new password" : "Show new password"}
                                                edge="end"
                                            >
                                                {isPasswordVisible.newPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        </div>

                        <div className="w-full mb-4">
                            <TextField
                                className="bg-white"
                                fullWidth
                                label="Confirm New Password"
                                type={isPasswordVisible.confirmNewPassword ? "text" : "password"}
                                name="confirmNewPassword"
                                value={passwordData.confirmNewPassword}
                                onChange={handleInputChange}
                                error={!!errors.confirmNewPassword}
                                helperText={errors.confirmNewPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => togglePasswordVisibility('confirmNewPassword')}
                                                aria-label={isPasswordVisible.confirmNewPassword ? "Hide confirm new password" : "Show confirm new password"}
                                                edge="end"
                                            >
                                                {isPasswordVisible.confirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        </div>

                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleChangePasswordClick}
                            >
                                Change Password
                            </Button>
                        </Box>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
