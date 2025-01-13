import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Middle from '../middle/Middle';
import ContactInfo from '../contactInfo/ContactInfo';
import AdminDashboard from '../adminDashboard/AdminDashboard';

export default function Home() {
    const middleRef = useRef(null);
    const contactRef = useRef(null);
    const [username, setUsername] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Token:', token);
            const decoded = jwtDecode(token);
            console.log('Decoded token:', decoded);
            const userId = decoded.id;
            const role = decoded.role;
            setIsAdmin(role === 'admin');

            if (role === 'admin') {
                setUsername('Admin');
            } else {
                fetch(`https://pet-adoption-jr7a.onrender.com/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch user data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Fetched data:', data);
                        setUsername(data.name);
                    })
                    .catch(error => console.error('Error fetching user data:', error));
            }
        }
    }, []);

    const handleMiddleScroll = () => {
        if (middleRef.current) {
            middleRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleContactScroll = () => {
        if (contactRef.current) {
            contactRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUsername(null);
        setIsAdmin(false);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="bg-sky-500 p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center h-20">
                    <a href="#" className="text-2xl font-bold pl-4 text-white">Pet Adoption Center</a>
                    <div className="flex space-x-6">
                        {username ? (
                            <>
                                <span className="text-lg font-bold text-white">
                                    Logged in as {isAdmin ? 'Admin' : username}
                                </span>
                                <button onClick={handleLogout} className="text-lg font-bold text-white hover:text-sky-500">Log out</button>
                            </>
                        ) : (
                            <Link to="/login" className="text-lg font-bold text-white hover:text-sky-500">Log in</Link>
                        )}
                        <button className="text-lg font-bold text-white hover:text-sky-500" onClick={handleContactScroll}>Contact</button>
                    </div>
                </div>
            </nav>

            {isAdmin ? (
                <>
                    <AdminDashboard />
                    <div ref={contactRef}>
                        <ContactInfo />
                    </div>
                </>
            ) : (
                <>
                    {/* Home Page Content */}
                    <div className="h-screen flex flex-col items-center justify-center">
                        <div className="container mx-auto flex flex-col items-center md:flex-col lg:flex-row lg:items-start p-5 md:p-10 space-y-8 lg:space-y-0 lg:space-x-10">
                            {/* Image Section */}
                            <div className="flex justify-center w-full md:w-auto lg:w-1/2 lg:order-2 mb-5 lg:mb-0">
                                <img
                                    src="https://img.freepik.com/premium-vector/animal-shelter-cartoon-illustration-with-pets-cages-volunteers-feeding-animals-adopting_2175-6039.jpg"
                                    alt="Happy pet and owner"
                                    className="w-full md:w-2/3 lg:w-full h-auto"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-col space-y-4 w-full lg:w-1/2 text-center lg:text-left lg:items-start">
                                <h1 className="text-4xl font-bold text-gray-800">
                                    Welcome to the Pet Adoption Center!
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Find your perfect pet companion today. Our center is dedicated to helping animals find loving homes.
                                </p>
                                <button className="text-white bg-sky-500 px-6 py-3 rounded font-semibold text-lg hover:bg-sky-600 transition duration-300" onClick={handleMiddleScroll}>
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>

                   {/* Middle and ContactInfo Section */}
<div className="flex flex-col h-screen">
    <div ref={middleRef} className="flex-grow p-5">
        <Middle />
    </div>
    <div ref={contactRef} className="flex-grow content-end">
        <ContactInfo />
    </div>
</div>


                </>
            )}
        </>
    );
}
