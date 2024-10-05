import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { Box, Button } from "@mui/material";
import { format } from "date-fns";
import AuthService from "../../_services/AuthService";
import UserService from "../../_services/UserService";
import AdminProduct from "../../components/AdminComponents/Admin/AdminProducts";
import ChangePassword from "../../components/ChangePassword/ChangePassword";

export default function AdminProfile ( ){
    const currentAdmin= AuthService.getCurrentUser();
    const currentRole =currentAdmin.role
    console.log("currentAdmin",currentAdmin)

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
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
    console.log("user",user)

    useEffect(() => {
        console.log("currentAdmin",currentAdmin)

        const fetchUser = async () => {
            try {
                const data = await UserService.getUserById(currentAdmin.id);
                setUser(data);
                console.log("currentAdmin",currentAdmin)
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
    }, [currentAdmin.id]);

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

    const handleSaveClick = async () => {
        try {
            await UserService.updateUser(currentAdmin.id, formData);
            setUser(formData); // Update user state with form data
            setEditMode(false); // Exit edit mode after saving
            Swal.fire("Success", "User updated successfully", "success");
        } catch (error) {
            console.error("Error updating user", error);
            Swal.fire("Error", "Failed to update user", "error");
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
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                    <div className="text-center flex justify-between">
                        <h6 className="text-blueGray-700 text-xl font-bold">My Profile</h6>
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
                                    style={{ marginRight: 8 }}
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
                            My Information
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
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
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
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
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
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
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
                                        onChange={handleRoleChange} // Use the new handler
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    >
                                        <option value={0}>Admin</option>
                                        <option value={1}>Customer</option>
                                        <option value={2}>SuperAdmin</option>
                                    </select>
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
                                        onChange={handleUserStatusChange} // Use the new handler
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    >
                                        <option value={0}>Inactive</option>
                                        <option value={1}>Active</option>
                                        <option value={2}>Suspended</option>
                                    </select>
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
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
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
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        disabled={!editMode}
                                    />
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
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <AdminProduct adminId={currentAdmin}/>
            </div>
            <ChangePassword currentUser={currentAdmin} />


        </>
    );
}
