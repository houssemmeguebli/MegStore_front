import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
                <p className="mb-6">You do not have permission to view this page.</p>
                <button
                    onClick={handleGoBack}
                    className="bg-blue-500  font-semibold py-2 px-6 rounded-md border-2 border-blue-500 hover:bg-white hover:text-blue-500 hover:border-blue-600 transition duration-300  transform hover:scale-105"
                >
                    Go Back
                </button>

            </div>
        </div>
    );
};

export default Unauthorized;
