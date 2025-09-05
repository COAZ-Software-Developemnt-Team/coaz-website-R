// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const [password, setPassword] = useState("");
    const adminPassword = "admin123"; // hardcoded password
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === adminPassword) {
            setIsLoggedIn(true);
            navigate("/cms");
        } else {
            alert("Incorrect password!");
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="password"
                    placeholder="Enter Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
