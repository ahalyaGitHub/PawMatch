import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function AdoptionForm({ markPetAsRequested }) {
    const [reasonToAdopt, setReasonToAdopt] = useState('');
    const { petId } = useParams();
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.id); // Assuming the token contains the user ID
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('User ID:', userId); // Log userId to check

        try {
            const res = await fetch('https://pet-adoption-jr7a.onrender.com/adoptions/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    petId,
                    reasonToAdopt,
                }),
            });

            if (res.ok) {
                alert('Adoption request submitted successfully!');
                markPetAsRequested(petId); // Call to disable the Interested button
                navigate('/');
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error submitting adoption request:', error);
        }
    };

    return (
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
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                    Submit Request
                </button>
            </form>
        </div>
    );
}
