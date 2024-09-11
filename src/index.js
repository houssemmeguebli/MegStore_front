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



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <Routes>
            {/* Routes with layouts */}
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/auth/*" element={<Auth />} />
            {/* Routes without layouts */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/" element={<Landing />} />
            {/* Redirect for all unmatched routes */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);
