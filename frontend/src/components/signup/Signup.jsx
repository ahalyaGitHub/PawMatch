import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message

        try {
            const response = await fetch('https://pet-adoption-jr7a.onrender.com/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, phone, email, password }),
            });

            if (response.ok) {
                // Redirect to login page upon successful signup
                navigate('/login');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Error:', error.message);
            setErrorMessage('An error occurred during signup');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-sky-200">
            <div className="flex flex-col gap-y-4 border border-solid w-11/12 sm:w-96 p-6 bg-white shadow-lg">
                <div className='mx-auto text-lg font-bold'>Create your account</div>
                <form onSubmit={handleSignup} className="flex flex-col gap-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-sky-500 text-white hover:bg-sky-600 transition duration-300 font-bold"
                    >
                        Sign Up
                    </button>
                    <div className="flex justify-center text-gray-500 text-sm font-semibold">
                        <span>Already have an account?</span>
                        <Link to="/login" className="text-sky-500 ml-1 hover:underline">Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
