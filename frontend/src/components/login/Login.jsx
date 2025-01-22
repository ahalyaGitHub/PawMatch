import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Login(props) {
    const { isAdmin } = props
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await fetch(`https://pet-adoption-jr7a.onrender.com/${isAdmin ? 'admins' : 'users'}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Login failed');
                return;
            }
            console.log('response: ', response);

            const data = await response.json();
            const token = data.token; // Get token from response
            console.log('JWT Token:', token);

            // Decode the token to get the user role
            const decodedToken = jwtDecode(token); // Use jwt_decode to decode the token
            const userRole = decodedToken.role; // Assuming the role is stored in the token

            // Store the token in local storage
            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);

            // Redirect based on user role

            navigate('/'); // Redirect to home page

        } catch (error) {
            console.error('Error:', error.message);
            setErrorMessage('Wrong email or password');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-sky-200">
            <div className="flex flex-col gap-y-4 border border-solid w-11/12 sm:w-96 p-6 bg-white shadow-lg">
                <div className='mx-auto text-lg font-bold'>{isAdmin ? "Admin" : "User"} Login</div>
                <form className="flex flex-col gap-y-4" onSubmit={handleLogin}>
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && (
                        <div className="text-red-500 text-sm">{errorMessage}</div>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-sky-500 text-white hover:bg-sky-600 transition duration-300 font-bold"
                        >
                            Log in
                        </button>
                    </div>

                    <div>
                        {isAdmin ? (
                            <div className="flex justify-center text-gray-500 text-sm font-semibold">
                                <span>Login as user?</span>
                                <Link to="/login" className="text-sky-500 ml-1 hover:underline">
                                    User Login
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-center text-gray-500 text-sm font-semibold">
                                    <span>Don’t have an account?</span>
                                    <Link to="/signup" className="text-sky-500 ml-1 hover:underline">
                                        Signup
                                    </Link>
                                </div>
                                <div className="flex justify-center text-gray-500 text-sm font-semibold mt-3">
                                    <span>Login as admin?</span>
                                    <Link to="/login/admin" className="text-sky-500 ml-1 hover:underline">
                                        Admin Login
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
}
