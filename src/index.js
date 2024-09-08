import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// Layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// Views without layouts
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <Routes>
            {/* Routes with layouts */}
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/auth/*" element={<Auth />} />
            {/* Routes without layouts */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Index />} />
            {/* Redirect for all unmatched routes */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);
