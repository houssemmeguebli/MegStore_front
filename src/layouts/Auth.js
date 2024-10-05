import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "components/Navbars/AuthNavbar.js";

// Views
import Login from "../views/frontOfiice/auth/Login.js";
import Register from "../views/frontOfiice/auth/Register.js";
import Footer from "../components/Footers/Footer";
import ForgotPassword from "../components/ChangePassword/forgot-password";
import ResetPassword from "../components/ChangePassword/ResetPassword";

export default function Auth() {
    return (
        <>
            <Navbar className="bg-blueGray-200" />
            <main>
                <section className="relative w-full h-full py-40 min-h-screen">
                    <div
                        className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
                        style={{
                            backgroundImage: `url(${require("assets/img/register_bg_2.png").default})`,
                        }}
                    ></div>
                    <Routes>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="forgot-password" element={<ForgotPassword/>} />
                        <Route path="resetPassword" element={<ResetPassword/>} />

                        {/* Redirect from /auth to /auth/login */}
                        <Route path="/" element={<Navigate to="/auth/login" />} />
                        {/* Redirect any unmatched routes */}
                        <Route path="*" element={<Navigate to="/auth/login" />} />
                    </Routes>
                </section>
            </main>
            <Footer/>

        </>
    );
}
