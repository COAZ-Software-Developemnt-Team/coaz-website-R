import React, {useContext} from "react";
import {UserContext} from "../contexts/UserContext";
import {FaTimes} from "react-icons/fa";

const Sidebar = () => {
    const { user, logout, mode, setMode, sidebarOpen, setSidebarOpen } = useContext(UserContext);

    if (!user) return null;

    return (
        <>
            {/* Overlay (when sidebar open) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 flex flex-col space-y-6 shadow-lg z-50 transform transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Close button */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="self-end text-white text-2xl"
                >
                    <FaTimes />
                </button>

                <h2 className="text-lg font-bold">Dashboard</h2>
                <p>Hello, {user.username}</p>

                {/* Toggle Mode */}
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => setMode("view")}
                        className={`px-3 py-2 rounded ${
                            mode === "view" ? "bg-blue-600" : "bg-gray-600"
                        }`}
                    >
                        View Mode
                    </button>
                    <button
                        onClick={() => setMode("edit")}
                        className={`px-3 py-2 rounded ${
                            mode === "edit" ? "bg-green-600" : "bg-gray-600"
                        }`}
                    >
                        Edit Mode (CMS)
                    </button>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="mt-auto bg-red-600 px-3 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default Sidebar;
