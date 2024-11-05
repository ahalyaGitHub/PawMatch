import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../navbar/Navbar';

export default function AdoptionForm({ markPetAsRequested }) {
    const [reasonToAdopt, setReasonToAdopt] = useState('');
    const [isInterested, setIsInterested] = useState(false);
    const { petId } = useParams();
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.id); // Get the user ID from the token
        }
    }, []);

    useEffect(() => {
        const checkStatus = async () => {
            if (userId) {
                const res = await fetch(`https://pet-adoption-jr7a.onrender.com/adoptions/status/${userId}/${petId}`);
                const data = await res.json();
                if (data.status === 'interested') {
                    setIsInterested(true);
                }
            }
        };
        checkStatus();
    }, [userId, petId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reasonToAdopt) {
            alert("Please provide a reason for adoption.");
            navigate('/pets'); // Redirect to the pets page if validation fails
            return;
        }

        try {
            const res = await fetch('https://pet-adoption-jr7a.onrender.com/adoptions/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, petId, reasonToAdopt }),
            });

            if (res.ok) {
                alert('Adoption request submitted successfully!');
                markPetAsRequested(petId);
                setIsInterested(true);
                navigate('/users'); // Redirect to the users page upon successful submission
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error submitting adoption request:', error);
        }
    };

    return (
        <>
        <Navbar />
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 shadow-md rounded">
                <h2 className="text-2xl font-bold mb-6">Adoption Request</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                        Reason for Adoption
                    </label>
                    <textarea
                        id="reason"
                        value={reasonToAdopt}
                        onChange={(e) => setReasonToAdopt(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                {isInterested ? (
                    <p className="w-full text-gray-700 text-center py-2 font-bold"><span className='text-red-500'>Status: </span>Interested</p> // Display text if already interested
                ) : (
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                        disabled={isInterested} // Disable if already interested
                    >
                        Submit Request
                    </button>
                )}
            </form>
        </div>
        </>
    );
}
