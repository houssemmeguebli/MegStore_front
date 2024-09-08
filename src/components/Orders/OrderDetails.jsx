import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from "../../_services/OrderService";
import UserService from "../../_services/UserService";
import { FaCalendarAlt, FaShippingFast, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderAndCustomer = async () => {
            try {
                const orderData = await OrderService.getOrderById(orderId);
                setOrder(orderData);

                // Fetch customer details
                const customerData = await UserService.getUserById(orderData.customerId);
                setCustomer(customerData);
                console.log("customerData:",customerData);
            } catch (err) {
                setError('Failed to fetch order or customer details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndCustomer();
    }, [orderId]);

    if (loading) return <div className="text-center text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;
    if (!order) return <div className="text-center text-gray-600">No order found.</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Order Details</h1>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Back to Orders
                    </button>
                </div>
                <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Order Information */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                                <FaCalendarAlt className="mr-2 text-gray-500" />
                                Order Information
                            </h2>
                            <p className="mt-2 text-gray-600"><strong>Order ID:</strong> {order.orderId}</p>
                            <p className="mt-2 text-gray-600"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p className="mt-2 text-gray-600"><strong>Shipped Date:</strong> {order.shippedDate ? new Date(order.shippedDate).toLocaleDateString() : 'Not Shipped Yet'}</p>
                            <p className="mt-2 text-gray-600"><strong>Status:</strong> {order.orderStatus}</p>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                                <FaUser className="mr-2 text-gray-500" />
                                Customer Information
                            </h2>
                            {customer && (
                                <>
                                    <p className="mt-2 text-gray-600"><strong>Customer ID:</strong> {customer.id}</p>
                                    <p className="mt-2 text-gray-600"><strong>Name:</strong> {customer.fullName}</p>
                                    <p className="mt-2 text-gray-600 flex items-center"><FaEnvelope className="mr-2 text-gray-500"/><strong>Email:</strong> {customer.email}</p>
                                    <p className="mt-2 text-gray-600 flex items-center"><FaPhone className="mr-2 text-gray-500"/><strong>Phone:</strong> {customer.phoneNumber}</p>
                                    <p className="mt-2 text-gray-600 flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500"/><strong>Address:</strong> {customer.address || 'Not Provided'}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                            <FaShippingFast className="mr-2 text-gray-500" />
                            Order Items
                        </h2>
                        <div className="mt-4">
                            {order.items.map(item => (
                                <div key={item.productId} className="flex items-center justify-between bg-gray-100 p-4 mb-2 rounded-lg shadow">
                                    <div className="flex items-center">
                                        <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded-lg mr-4"/>
                                        <div>
                                            <p className="text-gray-700 font-semibold">{item.productName}</p>
                                            <p className="text-gray-600"><strong>Quantity:</strong> {item.quantity}</p>
                                            <p className="text-gray-600"><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">${(item.quantity * item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mr-2"
                    >
                        Back to Orders
                    </button>
                    <button
                        onClick={() => navigate(`/admin/orders/edit/${order.orderId}`)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    >
                        Edit Order
                    </button>
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to cancel this order?")) {
                                try {
                                    await OrderService.cancelOrder(order.orderId); // Assuming a cancelOrder method exists
                                    navigate('/admin/orders');
                                } catch (err) {
                                    setError('Failed to cancel order.');
                                }
                            }
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        <GiCancel className="inline mr-1"/> Cancel Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
