import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// Components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import Dashboard from "views/BackOffice/Dashboard.js";
import ProductDetail from "../components/AdminComponents/Products/ProductDetail";
import Categories from "../views/BackOffice/Categories";
import Products from "../views/BackOffice/Products";
import CategoriesDetails from "../components/AdminComponents/Categories/CategoriesDetails";
import OrderDetails from "../components/AdminComponents/Orders/OrderDetails";
import Orders from "../views/BackOffice/Orders";
import OrderEdit from "../components/AdminComponents/Orders/OrderEdit";
import Coupons from "../views/BackOffice/Coupons";
import CouponDetails from "../components/AdminComponents/Coupons/CouponDetails";
import Customers from "../views/BackOffice/Customers";
import CustomerDetails from "../components/AdminComponents/Customers/CustomerDetails";
import AdminProfile from "../views/BackOffice/AdminProfile";
import AdminsTable from "../components/SuperAdminComponents/AdminsTable";
import AdminAddForm from "../components/SuperAdminComponents/AdminAddForm";
import {AuthProvider} from "../_services/AuthContext";
import ProtectedRoute from "../_services/ProtectedRoute";
import Unauthorized from "../components/Unauthorized/Unauthorized";

export default function Admin() {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100">
                <AdminNavbar />
                {/* Header */}
                <HeaderStats />
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    <AuthProvider>
                        <Routes>
                            {/* Protected Routes for Admin and SuperAdmin Roles */}
                            <Route element={<ProtectedRoute roles={["Admin", "SuperAdmin"]} />}>
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="products" element={<Products />} />
                                <Route path="products/:productId" element={<ProductDetail />} />
                                <Route path="categories" element={<Categories />} />
                                <Route path="categories/:categoryId" element={<CategoriesDetails />} />
                                <Route path="coupons" element={<Coupons />} />
                                <Route path="users/:customerId" element={<CustomerDetails />} />
                                <Route path="customers" element={<Customers />} />
                                <Route path="adminProfile" element={<AdminProfile />} />
                                <Route path="coupons/:couponId" element={<CouponDetails />} />
                                <Route path="orders/:orderId" element={<OrderDetails />} />
                                <Route path="orders/edit/:orderId" element={<OrderEdit />} />
                                <Route path="orders" element={<Orders />} />
                                {/* Redirect from /BackOffice to /BackOffice/dashboard */}
                                <Route path="/" element={<Navigate to="dashboard" />} />
                                {/* Redirect any unmatched routes */}
                                <Route path="/unauthorized" element={<Unauthorized />} />
                                <Route path="*" element={<Navigate to="dashboard" />} />
                            </Route>
                            <Route element={<ProtectedRoute roles={["SuperAdmin"]} />}>
                                <Route path="admins" element={<AdminsTable />} />
                                <Route path="admins/addAdmin" element={<AdminAddForm />} />
                            </Route>
                        </Routes>
                    </AuthProvider>

                    <FooterAdmin />
                </div>
            </div>
        </>
    );
}
