import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import OrderService from "../../_services/OrderService"; // Adjust import according to your file structure

export default function OrdersTable() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await OrderService.getAllOrders();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        }
        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        try {
            await OrderService.deleteOrder(orderId);
            setOrders(orders.filter((order) => order.orderId !== orderId));
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handleViewDetails = (orderId) => {
        navigate(`/admin/orders/${orderId}`);
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                            Orders Table
                        </h3>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                    <tr>
                        {["Order Date", "Shipped Date", "Order Status", "Customer ID", "Actions"].map((heading) => (
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
                    {orders.map((order) => (
                        <tr key={order.orderId}>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-blueGray-600">
                                {new Date(order.orderDate).toLocaleDateString()}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.shippedDate ? new Date(order.shippedDate).toLocaleDateString() : "Not Shipped"}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.orderStatus}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.customerId}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
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
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

OrdersTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
