
import React, { useContext } from 'react';
import { UserContext } from "../contexts/UserContext";

const User = () => {
    const { user, logout } = useContext(UserContext);

    if (!user) return null;

    return (
        <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded shadow">
            <span className="font-semibold">Hello, {user.displayName || user.username}!</span>
            <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Log Out
            </button>
        </div>
    );
};

export default User;