import React, { useEffect, useState } from "react";
import OrderService from "../../_services/OrderService";
import ProductService from "../../_services/ProductService";
import UserService from "../../_services/UserService";

export default function HeaderStats() {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);

    // Fetch total orders, products, and customers on component mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const orders = await OrderService.getAllOrders();
                setTotalOrders(orders.length); // Assuming orders is an array
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }

            try {
                const products = await ProductService.getAllProducts();
                setTotalProducts(products.length); // Assuming products is an array
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }

            try {
                const users = await UserService.GetUsersWithRole(1);
                setTotalCustomers(users.length); // Assuming users is an array
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <>
            {/* Header */}
            <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
                <div className="px-4 md:px-10 mx-auto w-full">
                    <div>
                        {/* Card stats */}
                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                                <div className="bg-white shadow-md rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h6 className="text-gray-600 text-sm uppercase font-bold">
                                                TOTAL ORDERS
                                            </h6>
                                            <span className="text-2xl font-semibold text-gray-800">
                        {totalOrders}
                      </span>
                                        </div>
                                        <div className="bg-green-500  rounded-full p-3">
                                            <i className="fas fa-shopping-cart"></i>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">Total orders made</p>
                                </div>
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                                <div className="bg-white shadow-md rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h6 className="text-gray-600 text-sm uppercase font-bold">
                                                TOTAL PRODUCTS
                                            </h6>
                                            <span className="text-2xl font-semibold text-gray-800">
                                                {totalProducts}
                                              </span>
                                        </div>
                                        <div className="bg-blue-500  rounded-full p-3">
                                            <i className="fas fa-box fa-lg"></i>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">Total products available</p>
                                </div>
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                                <div className="bg-white shadow-md rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h6 className="text-gray-600 text-sm uppercase font-bold">
                                                TOTAL CUSTOMERS
                                            </h6>
                                            <span className="text-2xl font-semibold text-gray-800">
                                                {totalCustomers}
                                              </span>
                                        </div>
                                        <div className=" rounded-full p-3">
                                            <i className="fas fa-user-friends"></i>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">Total registered customers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
