import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, MenuItem, Select, FormControl, InputLabel, Pagination, Chip } from "@mui/material";
import Swal from "sweetalert2";
import UserService from "../../../_services/UserService";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AuthService from "../../../_services/AuthService";

const CustomerTable = ({ color }) => {
    const [customers, setCustomers] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 6; // Number of customers per page
    const navigate = useNavigate();
    const currentUser=AuthService.getCurrentUser();
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await UserService.GetUsersWithRole(1);
                setCustomers(response);
                console.log("Fetched customers:", response);
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        };
        fetchCustomers();
    }, []);



    const handleDelete = async (customerId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await UserService.deleteUser(customerId);
                setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.customerId !== customerId));
                Swal.fire("Deleted!", "The customer has been deleted.", "success");
            } catch (error) {
                console.error("Error deleting customer:", error);
                Swal.fire("Error!", "There was an issue deleting the customer.", "error");
            }
        }
    };

    const handleViewDetails = (customerId) => {
        navigate(`/admin/users/${customerId}`);
    };

    const handleStatusFilterChange = (event) => {
        setFilterStatus(event.target.value);
        setCurrentPage(1); // Reset to the first page when filter changes
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // Filter and paginate customers
    const filteredCustomers = customers.filter(customer => {
        if (filterStatus === "all") return true;
        return filterStatus === "active" ? customer.isActive : !customer.isActive;
    });

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const getStatusDetails = (status) => {
        switch (status) {
            case 1:
                return { label: "Active", color: "success" }; // Active
            case 0:
                return { label: "Inactive", color: "default" }; // Inactive
            case 2:
                return { label: "Suspended", color: "error" }; // Fallback
            default:
                return { label: "Unknown", color: "default" };
        }
    };

    return (
        <div className={`relative mt-8 flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
            <div className="flex p-4 border-b-2 border-gray-200">
                <FormControl variant="outlined" className="w-1/4 mr-4">
                    <InputLabel>Status</InputLabel>
                    <Select value={filterStatus} onChange={handleStatusFilterChange} label="Status">
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                    <tr>
                        {["Customer Name", "Email", "Phone", "Status", ""].map((heading) => (
                            <th key={heading} className={`px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"}`}>
                                {heading}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {currentCustomers.map((customer) => {
                        const { label, color: statusColor } = getStatusDetails(customer.userStatus);

                        return (
                            <tr key={customer.customerId} className="font-bold">
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                                        <span className={`font-bold ${color === "light" ? "text-blueGray-600" : "text-white"}`}>
                                            {customer.fullName}
                                        </span>
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{customer.email}</td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{customer.phoneNumber}</td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <Chip label={label} color={statusColor} />
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        {currentUser.role === "SuperAdmin" &&
                                        <IconButton onClick={() => handleDelete(customer.id)} className="text-red-500 hover:text-red-700" title="Delete">
                                            <span className="text-xl"> <DeleteIcon /></span>
                                        </IconButton>
                                        }
                                        <IconButton onClick={() => handleViewDetails(customer.id)} className="text-green-500 hover:text-green-700" title="View Details">
                                            <span className="text-xl"><VisibilityIcon /></span>
                                        </IconButton>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <div className="p-4 flex justify-center items-center">
                <Pagination
                    count={Math.ceil(filteredCustomers.length / customersPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
        </div>
    );
};

CustomerTable.defaultProps = {
    color: "light",
};

CustomerTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};

export default CustomerTable;
