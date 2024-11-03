import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-sky-500 p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center h-20">
                    <a href="#" className="text-2xl font-bold pl-4 text-white">Pet Adoption Center</a>
                    <div className="flex space-x-6">
                        <Link to="/" className="text-lg font-bold text-white hover:text-sky-500">Home</Link>
                    </div>
                </div>
            </nav>
    );
}
