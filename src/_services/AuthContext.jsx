import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthService from "./AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const userData =  AuthService.getCurrentUser(); // Ensure it's awaited if asynchronous
                setUser(userData);
                console.log("userData", userData);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
