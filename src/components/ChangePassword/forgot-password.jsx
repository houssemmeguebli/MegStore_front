import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SweetAlert from "sweetalert2";
import AuthService from "../../_services/AuthService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await AuthService.forgotPassword(email); // Call the forgotPassword method
            SweetAlert.fire({
                icon: 'success',
                title: 'Check your email!',
                text: 'If the email address is registered, you will receive a password reset link shortly.',
            });

            navigate(`/auth/resetPassword?email=${encodeURIComponent(email)}`);

        } catch (error) {
            SweetAlert.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while sending the reset link. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-4/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <h2 className="text-center text-2xl font-bold text-blueGray-700">Forgot Password</h2>
                            <hr className="mt-6 border-b-1 border-blueGray-300"/>
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleForgotPassword}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Email"
                                        required
                                    />
                                </div>

                                <div className="text-center mt-6">
                                    <button
                                        className={`bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        type="submit"
                                        disabled={loading} // Disable button while loading
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Code'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="flex flex-wrap mt-6 relative">
                        <div className="w-1/2">
                            <Link to="/auth/login" className="text-blueGray-200">
                                <small>Back to Login</small>
                            </Link>
                        </div>
                        <div className="w-1/2 text-right">
                            <Link to="/auth/register" className="text-blueGray-200">
                                <small>Create new account</small>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
