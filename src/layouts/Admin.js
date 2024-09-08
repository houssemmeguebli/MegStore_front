import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

import Dashboard from "views/admin/Dashboard.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import ProductDetail from "../components/Products/ProductDetail";

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
                        <Route path="tables" element={<Tables />} />
                        <Route path="products/:productId" element={<ProductDetail />} />
                        {/* Redirect from /admin to /admin/dashboard */}
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
