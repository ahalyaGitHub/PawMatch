import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../navbar/Navbar';

export default function AdoptionForm() {
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
            try {
                const res = await fetch(`http://localhost:5000/adoptions/status/${petId}`);
                const data = await res.json();
                if (data.status === 'interest-to-adopt') {
                    setIsInterested(true);
                }
            } catch (error) {
                console.error("Error checking adoption status:", error);
            }
        };
        checkStatus();
    }, [petId]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reasonToAdopt) {
            alert("Please provide a reason for adoption.");
            return;
        }
    
        const token = localStorage.getItem('token'); // Get token here
    
        if (!token) {
            alert("You need to be logged in to submit an adoption request.");
            return;
        }
    
        try {
            const res = await fetch('http://localhost:5000/adoptions/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({ userId, petId, reasonToAdopt }),
            });
    
            if (res.ok) {
                alert('Adoption request submitted successfully!');
                setIsInterested(true);
                navigate('/pets');
            } else {
                const errorData = await res.json();
                if (errorData.error === "This pet already has an interested user.") {
                    setIsInterested(true);
                    alert("This pet is already marked as 'interested' by another user.");
                } else {
                    alert(`Error: ${errorData.error || 'An unexpected error occurred.'}`);
                }
            }
        } catch (error) {
            console.error('Error submitting adoption request:', error);
            alert('An error occurred while submitting your adoption request. Please try again.');
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
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                    disabled={isInterested} // Disable if already interested
                >
                    Submit Request
                </button>
            </form>
        </div>
        </>
    );
}
