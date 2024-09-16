import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Pagination, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import OrderService from "../../../_services/OrderService"; // Adjust import according to your file structure
import Swal from "sweetalert2";

export default function OrdersTable() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All"); // Filter state for Order Status
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(3); // Number of orders per page
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await OrderService.getAllOrders();
                setOrders(data);
                setFilteredOrders(data);
                console.log("data",data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        let filtered = orders;
        if (statusFilter !== "All") {
            filtered = orders.filter(order => order.orderStatus === Number(statusFilter));
        }
        setFilteredOrders(filtered);
    }, [statusFilter, orders]);

    const handleDelete = async (orderId) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await OrderService.deleteOrder(orderId);
                setOrders(orders.filter((order) => order.orderId !== orderId));
                setFilteredOrders(filteredOrders.filter((order) => order.orderId !== orderId));
                Swal.fire(
                    "Deleted!",
                    "Your order has been deleted.",
                    "success"
                );
            } catch (error) {
                console.error("Error deleting order:", error);
                Swal.fire(
                    "Error!",
                    "There was an error deleting the order.",
                    "error"
                );
            }
        }
    };

    const handleViewDetails = (orderId) => {
        navigate(`/admin/orders/${orderId}`);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">Orders Table</h3>
                        <FormControl margin="normal">
                            <InputLabel id="order-status-filter">Order Status</InputLabel>
                            <Select
                                labelId="order-status-filter"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                label="Order Status"
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="0">Pending</MenuItem>
                                <MenuItem value="1">Shipped</MenuItem>
                                <MenuItem value="2">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                    <tr>
                        {["Order Date", "Shipped Date", "Order Status", "Total Amount", "Customer Name", ""].map((heading) => (
                            <th
                                key={heading}
                                className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {currentOrders.map((order) => (
                        <tr key={order.orderId}>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-blueGray-600">
                                {new Date(order.orderDate).toLocaleDateString()}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.shippedDate ? new Date(order.shippedDate).toLocaleDateString() : "Not Shipped"}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.orderStatus === 0 ? "Pending" : order.orderStatus === 1 ? "Shipped" : "Rejected"}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                ${order.totlaAmount}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.customerName}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                <div className="flex justify-end space-x-2">
                                    <IconButton
                                        onClick={() => handleDelete(order.orderId)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleViewDetails(order.orderId)}
                                        className="text-green-500 hover:text-green-700"
                                        title="View Details"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 flex justify-center items-center">
                <Pagination
                    count={Math.ceil(filteredOrders.length / ordersPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
        </div>
    );
}

OrdersTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
