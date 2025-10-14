import React, { createContext, useState } from "react";

// Create Context
export const UserContext = createContext();

// Create Provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState("view"); // "view" or "edit"
    const [sidebarOpen, setSidebarOpen] = useState(false);


    const login = (user) => {
        setUser({ user });
    };

    const logout = () => {
        setUser(null);
        setMode("view");

    };

    return (
        <UserContext.Provider value={{ user, login, logout,mode,setMode,sidebarOpen,setSidebarOpen }}>
            {children}
        </UserContext.Provider>
    );
};
