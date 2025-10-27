import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useData} from './UseData';


const LoginPage = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useData();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.trim() && password.trim()) {
            try {
                const response = await login(username, password);

                //exception handling
                if (response.error_message) {
                    alert(response.error_message);
                }
            } catch (error) {
                console.error('Login failed:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div className="flex justify-center mb-6">
                    <svg className="w-16 h-16 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M4 18C4 14.134 7.58172 11 12 11C16.4183 11 20 14.134 20 18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>

                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            id="username"
                            type="text"
                            placeholder="User name..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>


                    {/*<div className="text-right">*/}
                    {/*    <a href="#" className="text-blue-500 hover:text-blue-600 text-sm">Forgot Password?</a>*/}
                    {/*</div>*/}

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-200"
                    >
                        Login
                    </button>

                    {/*<div className="text-center pt-2">*/}
                    {/*    <span className="text-gray-600">Don't have an account? </span>*/}
                    {/*    <a href="#" className="text-blue-500 hover:text-blue-600">Register</a>*/}
                    {/*</div>*/}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;