// src/services/userService.js
export const loginUser = async (username, password) => {
    // In a real app, this would check against your database
    // For demo purposes, we'll use a fixed credential
    if (username === 'admin' && password === 'secret123') {
        return { id: 1, username: 'admin', role: 'admin' };
    }
    return null;
};

export const getCurrentUser = () => {
    // In a real app, this would retrieve the current user from session/token
    // For demo, we'll return our fixed user
    return { id: 1, username: 'admin', role: 'admin' };
};