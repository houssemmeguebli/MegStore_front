import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "components/Navbars/AuthNavbar.js";
import FooterSmall from "components/Footers/FooterSmall.js";

// Views
import Login from "../views/frontOfiice/auth/Login.js";
import Register from "../views/frontOfiice/auth/Register.js";

export default function Auth() {
    return (
        <>
            <Navbar transparent />
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
                        {/* Redirect from /auth to /auth/login */}
                        <Route path="/" element={<Navigate to="/auth/login" />} />
                        {/* Redirect any unmatched routes */}
                        <Route path="*" element={<Navigate to="/auth/login" />} />
                    </Routes>
                    <FooterSmall absolute />
                </section>
            </main>
        </>
    );
}
