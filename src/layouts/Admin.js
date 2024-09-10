import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

import Dashboard from "views/BackOffice/Dashboard.js";
import Settings from "views/BackOffice/Settings.js";
import Tables from "views/BackOffice/Products.js";
import ProductDetail from "../components/AdminComponents/Products/ProductDetail";
import Categories from "../views/BackOffice/Categories";
import Products from "../views/BackOffice/Products";
import CategoriesDetails from "../components/AdminComponents/Categories/CategoriesDetails";
import OrderDetails from "../components/AdminComponents/Orders/OrderDetails";
import Orders from "../views/BackOffice/Orders";

export default function Admin() {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100">
                <AdminNavbar />
                {/* Header */}
                <HeaderStats />
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/:productId" element={<ProductDetail />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="categories/:categoryId" element={<CategoriesDetails/>} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="orders/:orderId" element={<OrderDetails/>} />
                        <Route path="orders" element={<Orders />} />

                        {/* Redirect from /BackOffice to /BackOffice/dashboard */}
                        <Route path="/" element={<Navigate to="dashboard" />} />
                        {/* Redirect any unmatched routes */}
                        <Route path="*" element={<Navigate to="dashboard" />} />
                    </Routes>
                    <FooterAdmin />
                </div>
            </div>
        </>
    );
}
