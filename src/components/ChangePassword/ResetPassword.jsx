import React, { useEffect, useState } from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import { Box, Button, Input, Text, Flex } from "@chakra-ui/react"; // Adjust imports as needed
import Swal from "sweetalert2";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthService from "../../_services/AuthService";

function ResetPassword() {
    const [pinCode, setPinCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [timeRemaining, setTimeRemaining] = useState(1/2 * 60);
    const [showResendButton, setShowResendButton] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailParam = queryParams.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }

        const timer = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    setShowResendButton(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [location.search]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();

        try {
            const response = await AuthService.resetPassword(email, pinCode, newPassword);
            console.log("Reset Password response:", response);
            console.log("email", email);

            await Swal.fire({
                title: "Password Reset Successful",
                text: "Your password has been reset successfully. You can now log in with your new password.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/auth/login");
        } catch (error) {
            console.error("Error resetting password:", error);
            await Swal.fire({
                title: "Error",
                text: error.message || "Failed to reset password. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleResendCode = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await AuthService.forgotPassword(email);
            await Swal.fire({
                title: "PIN Code Sent",
                text: "A new PIN code has been sent to your email.",
                icon: "success",
                confirmButtonText: "OK",
            });
            setShowResendButton(false);
            setTimeRemaining(15 * 60); // Reset the timer
        } catch (error) {
            console.error("Error resending PIN code:", error);
            await Swal.fire({
                title: "Error",
                text: error.message || "Failed to resend PIN code. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-4/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <h2 className="text-center text-2xl font-bold text-blueGray-700">Reset Your Password</h2>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleResetPassword}>
                                <Text mb={2}>Please enter the PIN code sent to your email along with your new password.</Text>
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="pinCode">
                                        PIN Code
                                    </label>
                                    <input
                                        type="text"
                                        id="pinCode"
                                        value={pinCode}
                                        onChange={(e) => setPinCode(e.target.value)}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="PIN Code"
                                        required
                                    />
                                </div>

                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="newPassword">
                                        New Password
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="New Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    >
                                        {showPassword ? <VisibilityOff className="text-gray-400" /> : <Visibility className="text-gray-400" />}
                                    </button>
                                </div>

                                <Text textAlign="center" fontSize="lg" color="blue.500" mb={2}>
                                    Time Remaining: <strong>{formatTime(timeRemaining)}</strong>
                                </Text>

                                {showResendButton && (
                                    <button
                                        className={`bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        type="submit"
                                        disabled={loading} // Disable button while loading
                                        onClick={handleResendCode}
                                    >
                                        {loading ? 'Sending...' : ' Resend PIN Code'}

                                    </button>
                                )}
                                <div className="text-center mt-6">
                                    <button
                                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                        type="submit"
                                    >
                                        Reset Password
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
