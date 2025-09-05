// src/components/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/userService';
import React from "react";

const ProtectedRoute = () => {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;