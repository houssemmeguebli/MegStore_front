import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../../../_services/OrderService';
import UserService from '../../../_services/UserService';
import { FaCalendarAlt, FaShippingFast, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import 'jspdf-autotable'; // Import the plugin
import jsPDF from 'jspdf';
import DeliveryNotePDF from './DeliveryNotePDF';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderData = await OrderService.getOrderProductsById(orderId);
                setOrder(orderData);
                if (orderData.customerId) {
                    const customerData = await UserService.getUserById(orderData.customerId);
                    setCustomer(customerData);
                }
            } catch (err) {
                setError('Failed to fetch order or customer details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <div className="text-center text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;
    if (!order) return <div className="text-center text-gray-600">No order found.</div>;

    const formatPrice = (price) => price ? price.toFixed(2) : '0.00';
    const totalPrice = order.products?.reduce((acc, item) => acc + item.productPrice * item.itemQuantiy, 0) || 0;


    return (
        <div className="container mx-auto p-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Order Details</h1>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out"
                    >
                        Back to Orders
                    </button>
                </div>

                {/* Order Information Section */}
                <div className="px-6 py-4">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
                            <FaCalendarAlt className="mr-2 text-gray-500" />
                            Order & Customer Information
                        </h2>
                        <table className="min-w-full bg-white border rounded-lg">
                            <tbody>
                            <tr>
                                <td className="px-6 py-4 border text-gray-600 font-semibold">Order ID</td>
                                <td className="px-6 py-4 border">{order.orderId}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 border text-gray-600 font-semibold">Order Date</td>
                                <td className="px-6 py-4 border">{new Date(order.orderDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 border text-gray-600 font-semibold">Shipped Date</td>
                                <td className="px-6 py-4 border">{order.shippedDate ? new Date(order.shippedDate).toLocaleDateString() : 'Not Shipped Yet'}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 border text-gray-600 font-semibold">Order Status</td>
                                <td className="px-6 py-4 border">
                                        <span className={`px-3 py-1 rounded-full text-white text-sm ${
                                            order.orderStatus === 'Shipped' ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 border text-gray-600 font-semibold">Total Price</td>
                                <td className="px-6 py-4 border">${formatPrice(totalPrice)}</td>
                            </tr>
                            {customer && (
                                <>
                                    <tr>
                                        <td className="px-6 py-4 border text-gray-600 font-semibold">Customer Name</td>
                                        <td className="px-6 py-4 border">{customer.fullName}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 border text-gray-600 font-semibold">Customer Email</td>
                                        <td className="px-6 py-4 border">{customer.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 border text-gray-600 font-semibold">Customer Phone</td>
                                        <td className="px-6 py-4 border">{customer.phoneNumber}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 border text-gray-600 font-semibold">Customer Address</td>
                                        <td className="px-6 py-4 border">{customer.address || 'Not Provided'}</td>
                                    </tr>
                                </>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Order Items Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
                            <FaShippingFast className="mr-2 text-gray-500" />
                            Order Items
                        </h2>
                        <table className="min-w-full bg-white border rounded-lg">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 border text-left text-gray-600">Product</th>
                                <th className="px-6 py-3 border text-right text-gray-600">Quantity</th>
                                <th className="px-6 py-3 border text-right text-gray-600">Price</th>
                                <th className="px-6 py-3 border text-right text-gray-600">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.products?.map(product => (
                                <tr key={product.productId}>
                                    <td className="px-6 py-4 border flex items-center">
                                        <img
                                            src={`https://localhost:7048/${product.imageUrl}`}
                                            alt={product.productName}
                                            className="w-12 h-12 object-cover rounded-lg mr-4"
                                        />
                                        <span>{product.productName}</span>
                                    </td>
                                    <td className="px-6 py-4 border text-right">{product.itemQuantiy}</td>
                                    <td className="px-6 py-4 border text-right">${formatPrice(product.productPrice)}</td>
                                    <td className="px-6 py-4 border text-right">${formatPrice(product.productPrice * product.itemQuantiy)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <DeliveryNotePDF order={order} totalPrice={totalPrice} />

                    {/* Action Buttons Section */}
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                        >
                            Back to Orders
                        </button>
                        <button
                            onClick={() => navigate(`/admin/orders/edit/${order.orderId}`)}
                            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 font-semibold rounded-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                        >
                            Edit Order
                        </button>
                        <button
                            onClick={async () => {
                                if (window.confirm("Are you sure you want to cancel this order?")) {
                                    try {
                                        await OrderService.deleteOrder(order.orderId);
                                        navigate('/admin/orders');
                                    } catch (err) {
                                        setError('Failed to cancel order.');
                                    }
                                }
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 font-semibold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
                        >
                            <GiCancel className="inline-block mr-2" />
                            Cancel Order
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
