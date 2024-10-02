import React, { useState, useEffect } from 'react';
import UserService from "../../../_services/UserService";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { Box, Button } from "@mui/material";
import CustomerOrders from "./CustomerOrders";
import { format } from "date-fns";
import AuthService from "../../../_services/AuthService";
import AdminProduct from "../Admin/AdminProducts";

export default function CustomerDetails ({ currentUser }){
    const currentCustomer=  AuthService.getCurrentUser();
    const currentRole =currentCustomer.role
    console.log("currentCustomer",currentCustomer)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const { customerId } = useParams();
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        role: 0, // default value for role
        userStatus: 0, // default value for userStatus
        gender: "",
        dateOfBirth: "",
        phoneNumber: "",
        address: "",
        dateOfCreation: ""
    });

    useEffect(() => {
        console.log("currentCustomer",currentCustomer)

        const fetchUser = async () => {
            try {
                const data = await UserService.getUserById(customerId||currentUser.id);
                setUser(data);
                console.log("currentCustomer",currentCustomer)

                setFormData({
                    fullName: data.fullName,
                    email: data.email,
                    role: data.role,
                    userStatus: data.userStatus,
                    gender: data.gender,
                    dateOfBirth: data.dateOfBirth,
                    address: data.address,
                    dateOfCreation: data.dateOfCreation,
                    phoneNumber: data.phoneNumber
                });
            } catch (error) {
                console.error('Error fetching user details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [customerId]);

    useEffect(() => {
        validateFields();
    }, [formData]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRoleChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            role: parseInt(value, 10) // Parse to integer for role
        });
    };

    const handleUserStatusChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            userStatus: parseInt(value, 10) // Parse to integer for userStatus
        });
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCancelClick = () => {
        // Revert formData back to original user data
        setFormData({
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            userStatus: user.userStatus,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            dateOfCreation: user.dateOfCreation,
            phoneNumber: user.phoneNumber
        });
        setEditMode(false); // Exit edit mode
    };
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    };

    const validateFields = () => {
        let fieldErrors = {};

        // Full Name
        if (!formData.fullName.trim()) {
            fieldErrors.fullName = "Full Name is required.";
        } else if (formData.fullName.length < 3) {
            fieldErrors.fullName = "Full Name must be at least 3 characters long.";
        }

        // Email
        if (!formData.email) {
            fieldErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            fieldErrors.email = "Invalid email format.";
        }

        // Date of Birth
        if (!formData.dateOfBirth) {
            fieldErrors.dateOfBirth = "Date of Birth is required.";
        }
        if (!formData.userStatus) {
            fieldErrors.userStatus = "User Status   is required.";
        }
        if (!formData.role) {
            fieldErrors.role = "User role   is required.";
        }


        // Phone Number
        if (!formData.phoneNumber) {
            fieldErrors.phoneNumber = "Phone Number is required.";
        } else if (!/^\d{8,15}$/.test(formData.phoneNumber)) {
            fieldErrors.phoneNumber = "Phone Number must be between 8 to 15 digits.";
        }

        // Address
        if (!formData.address.trim()) {
            fieldErrors.address = "Address is required.";
        } else if (formData.address.length < 5) {
            fieldErrors.address = "Address must be at least 5 characters long.";
        }
        // Gender
        if (formData.gender === null || formData.gender === "") {
            fieldErrors.gender = "Gender is required.";
        }

        setErrors(fieldErrors);
    };
    const handleSaveClick = async () => {
        validateFields();

        // Check for validation errors and alert the user if present
        if (Object.keys(errors).length > 0) {
            // Loop through each error and show a SweetAlert for each validation issue
            for (const [field, errorMessage] of Object.entries(errors)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Field Validation Error',
                    text: `Error in ${field}: ${errorMessage}`,
                });
            }
            return;
        }

        try {
            // Attempt to update the user
            await UserService.updateUser(customerId, formData);
            setUser(formData); // Update user state with form data
            setEditMode(false); // Exit edit mode after saving

            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User updated successfully',
            });
        } catch (error) {
            console.error("Error updating user", error);

            // Handle error with SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error?.response?.data?.message || 'An unexpected error occurred while updating the user.',
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }
    const isFormChanged = () => JSON.stringify(user) !== JSON.stringify(formData);

    return (
        <>
            <div
                className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                    <div className="text-center flex justify-between">
                        <h6 className="text-blueGray-700 text-xl font-bold">User Details </h6>
                        {!editMode ? (
                            <button
                                className="bg-blue-500 active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md focus:outline-none ease-linear transition-all duration-150"
                                onClick={handleEditClick}
                            >
                                Edit
                            </button>
                        ) : (
                            <Box display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    color="white"
                                    onClick={handleSaveClick}
                                    style={{marginRight: 8}}
                                    disabled={!isFormChanged()}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleCancelClick}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        )}
                    </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <form>
                        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                            User Information
                        </h6>
                        <div className="flex flex-wrap">
                            <div className="w-full sm:w-6/12 xs:w-12/12 px-4 mb-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
                                    {errors.fullName && touched.fullName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full sm:w-6/12 xs:w-12/12 px-4 mb-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
                                    {errors.email && touched.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full sm:w-6/12 xs:w-12/12 px-4 mb-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
                                    {errors.phoneNumber && touched.phoneNumber && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full sm:w-6/12 xs:w-12/12 px-4 mb-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                        Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleRoleChange}
                                        onBlur={handleBlur}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    >
                                        <option value={0}>Admin</option>
                                        <option value={1}>Customer</option>
                                    </select>
                                    {errors.role && touched.role && (
                                        <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full sm:w-6/12 xs:w-12/12 px-4 mb-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                        User Status
                                    </label>
                                    <select
                                        name="userStatus"
                                        value={formData.userStatus}
                                        onChange={handleUserStatusChange}
                                        onBlur={handleBlur}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    >
                                        <option value={0}>Inactive</option>
                                        <option value={1}>Active</option>
                                        <option value={2}>Suspended</option>
                                    </select>
                                    {errors.userStatus && touched.userStatus && (
                                        <p className="text-red-500 text-xs mt-1">{errors.userStatus}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full sm:w-6/12 xs:w-12/12 px-4 mb-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={format(new Date(formData.dateOfBirth), "yyyy-MM-dd")}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        max={today}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
                                    {errors.dateOfBirth && touched.dateOfBirth && (
                                        <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full sm:w-6/12 xs:w-12/12 px-4 mb-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
                                    {errors.address && touched.address && (
                                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full sm:w-6/12 xs:w-12/12 px-4 mb-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                        Date of Creation
                                    </label>
                                    <input
                                        type="text"
                                        name="dateOfCreation"
                                        value={format(new Date(formData.dateOfCreation), "yyyy-MM-dd")}
                                        onChange={handleInputChange}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {currentRole === "Admin" ? (
                <CustomerOrders user={user}/>
            ) : null}
            {currentRole === "SuperAdmin" ? (
            <div
                className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                <AdminProduct adminId={user}/>
            </div>
            ) : null}
        </>
    );
}
