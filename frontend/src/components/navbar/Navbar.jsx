import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-sky-500 p-4 shadow-md">

            <div className="container mx-auto flex justify-between items-center h-20">
                <Link to="/" className="flex flex-row gap-2 text-2xl text-white font-bold justify-center items-center ms-24">
                    <img src="/logo.png" alt="logo" width={45} />
                    <p>PAW MATCH</p>
                </Link>
            </div>
        </nav>
    );
}
