import React, { useState, useEffect } from 'react';
import OrderService from "../../../_services/OrderService";
import { useParams } from "react-router-dom";

const OrderEdit = () => {
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { orderId } = useParams();
    const [formData, setFormData] = useState({
        orderDate: '',
        customerName: '',
        customerAddress: '',
        orderStatus: '',
        products: [],
        totalPrice: 0,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const fetchedOrder = await OrderService.getOrderById(orderId);
                setOrder(fetchedOrder);
                setFormData({
                    orderDate: new Date(fetchedOrder.orderDate).toISOString().slice(0, 10),
                    customerName: fetchedOrder.customerName,
                    customerAddress: fetchedOrder.customerAddress,
                    orderStatus: fetchedOrder.orderStatus,
                    products: fetchedOrder.products,
                    totalPrice: fetchedOrder.totalPrice,
                });
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch order data');
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const newProducts = [...formData.products];
        newProducts[index] = {
            ...newProducts[index],
            [name]: value,
        };
        setFormData({
            ...formData,
            products: newProducts,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await OrderService.updateOrder(orderId, formData);
            alert('Order updated successfully');
        } catch (err) {
            setError('Failed to update order');
        }
    };

    if (isLoading) return <p className="text-gray-700">Loading...</p>;

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-300 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Order</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Order Date:</label>
                        <input
                            type="date"
                            name="orderDate"
                            value={formData.orderDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Customer Name:</label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Customer Address:</label>
                    <textarea
                        name="customerAddress"
                        value={formData.customerAddress}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Order Status:</label>
                    <input
                        type="text"
                        name="orderStatus"
                        value={formData.orderStatus}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    />
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Products:</h3>
                    {formData.products.map((product, index) => (
                        <div key={index} className="p-4 mb-4 bg-white shadow-sm rounded-lg border border-gray-200">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Product Name:</label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={product.productName}
                                    onChange={(e) => handleProductChange(index, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Quantity:</label>
                                    <input
                                        type="number"
                                        name="itemQuantiy"
                                        value={product.itemQuantiy}
                                        onChange={(e) => handleProductChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Price:</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="productPrice"
                                        value={product.productPrice}
                                        onChange={(e) => handleProductChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Total Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        name="totalPrice"
                        value={formData.totalPrice}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default OrderEdit;
