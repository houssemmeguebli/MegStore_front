import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Pagination, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import OrderService from "../../../_services/OrderService"; // Adjust import according to your file structure
import Swal from "sweetalert2";
import ProductStatistics from "../Products/ProductStatistics";
import OrderStatistics from "./OrderStatistics";

export default function OrdersTable() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All"); // Filter state for Order Status
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5); // Number of orders per page
    const [sortOption, setSortOption] = useState("price-asc"); // Sort option state
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await OrderService.getAllOrders();
                setOrders(data);
                setFilteredOrders(data);
                console.log("data", data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [statusFilter, orders, sortOption]);

    const applyFilters = () => {
        let filtered = orders;

        // Filter by status
        if (statusFilter !== "All") {
            filtered = filtered.filter((order) => order.orderStatus === Number(statusFilter));
        }

        // Sorting functionality
        switch (sortOption) {
            case 'price-asc':
                filtered.sort((a, b) => a.totlaAmount - b.totlaAmount);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.totlaAmount - a.totlaAmount);
                break;
            default:
                break;
        }

        setFilteredOrders(filtered);
    };

    const handleDelete = async (orderId) => {
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
                Swal.fire("Deleted!", "Your order has been deleted.", "success");
            } catch (error) {
                console.error("Error deleting order:", error);
                Swal.fire("Error!", "There was an error deleting the order.", "error");
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

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setCurrentPage(1); // Reset to first page when sort changes
    };

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const getStatusLabel = (status) => {
        switch (status) {
            case 0:
                return { label: "Pending", color: "warning" };
            case 1:
                return { label: "Shipped", color: "success" };
            case 2:
                return { label: "Rejected", color: "error" };
            default:
                return { label: "Unknown", color: "default" };
        }
    };

    return (
        <>
        <OrderStatistics orders={orders} />
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">Orders Table</h3>
                        <FormControl margin="normal" sx={{ width: "maxWidth" }}>
                            <InputLabel id="order-status-filter">Oder Status</InputLabel>
                            <Select
                                labelId="order-status-filter"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                label="Order Status"
                                sx={{ width: "maxWidth" }}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="0">Pending</MenuItem>
                                <MenuItem value="1">Shipped</MenuItem>
                                <MenuItem value="2">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl margin="normal" sx={{ width: "maxWidth", marginLeft:"1%"}}>
                        <Select
                            value={sortOption}
                            onChange={handleSortChange}
                            sx={{ width: "maxWidth" }}
                        >
                            <MenuItem value="price-asc">Amount: Low to High</MenuItem>
                            <MenuItem value="price-desc">Amount: High to Low</MenuItem>
                        </Select>
                        </FormControl>

                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                    <tr>
                        {["Order ID","Order Date", "Shipped Date", "Customer Name", "Total Amount", "Order Status", ""].map(
                            (heading) => (
                                <th
                                    key={heading}
                                    className="px-6 align-middle border border-solid py-3 text-xs font-bold uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                >
                                    {heading}
                                </th>
                            )
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {currentOrders.map((order) => {
                        const { label, color } = getStatusLabel(order.orderStatus);
                        return (
                            <tr key={order.orderId}>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 font-bold text-xs whitespace-nowrap p-4">
                                    {order.orderId}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-blueGray-600">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs font-bold whitespace-nowrap p-4">
                                    {order.shippedDate
                                        ? new Date(order.shippedDate).toLocaleDateString()
                                        : "Not Shipped"}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 font-bold text-xs whitespace-nowrap p-4">
                                    {order.customerName}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 font-bold text-xs whitespace-nowrap p-4">
                                    ${order.totlaAmount}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <Chip label={label} color={color}/>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 font-bold text-xs whitespace-nowrap p-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <IconButton
                                            onClick={() => handleDelete(order.orderId)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleViewDetails(order.orderId)}
                                            className="text-green-500 hover:text-green-700"
                                            title="View Details"
                                        >
                                            <VisibilityIcon/>
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
                    count={Math.ceil(filteredOrders.length / ordersPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
        </div>
        </>
    );
}

OrdersTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
