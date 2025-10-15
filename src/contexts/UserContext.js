// UserContext.js
import React, { createContext, useState } from 'react';
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();


    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        sessionStorage.clear();
        navigate('/home');
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};