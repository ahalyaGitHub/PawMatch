import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-sky-500 p-4 shadow-md">
            
                <div className="container mx-auto flex justify-between items-center h-20">
                    <Link to="/" className="text-2xl font-bold pl-4 text-white">Pet Adoption Center</Link>
                </div>
            </nav>
    );
}
