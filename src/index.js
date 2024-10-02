import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// Layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// Views without layouts
import Landing from "./views/frontOfiice/Landing.js";
import Shop from "./views/frontOfiice/Shop";
import Cart from "./views/frontOfiice/Cart";
import Order from "./views/frontOfiice/Order";
import ProductDetail from "./components/FrontOfficeComponents/Product/ProductDetail";
import CustomerProfile from "./views/frontOfiice/CustomerProfile";
import CustomerOrdersFront from "./components/FrontOfficeComponents/Customer/CustomerOrdersFront";
import CustomerOrderEdit from "./components/FrontOfficeComponents/Customer/CustomerOrderEdit";
import ProtectedRoute from "./_services/ProtectedRoute";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import {AuthProvider} from "./_services/AuthContext";




const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/auth/*" element={<Auth />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/shop/productDetails/:productId" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                {/* Protected Routes for Customer Role */}
                <Route element={<ProtectedRoute roles={["Customer","Admin", "SuperAdmin"]} />}>
                    <Route path="/customerProfile" element={<CustomerProfile />} />
                    <Route path="/customerProfile/orders/:orderId" element={<CustomerOrdersFront />} />
                    <Route path="/customerProfile/orders/edit/:orderId" element={<CustomerOrderEdit />} />
                    <Route path="/order" element={<Order />} />
                </Route>
                {/* Redirect for all unmatched routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);
