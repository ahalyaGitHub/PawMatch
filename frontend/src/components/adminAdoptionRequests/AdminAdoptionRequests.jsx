import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/Navbar';

export default function AdminAdoptionRequests() {
    const [adoptionRequests, setAdoptionRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem('token'); // Get the token from local storage
            try {
                // Fetch all adoption requests
                const res = await fetch('https://pet-adoption-jr7a.onrender.com/adoptions', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include the token here
                    }
                });
                const requests = await res.json();

                // Fetch user and pet details for each adoption request
                const detailedRequests = await Promise.all(requests.map(async (request) => {
                    const userRes = await fetch(`https://pet-adoption-jr7a.onrender.com/users/${request.userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Include the token for user fetch
                        }
                    });
                    const petRes = await fetch(`https://pet-adoption-jr7a.onrender.com/pets/${request.petId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Include the token for pet fetch
                        }
                    });
                    const user = await userRes.json();
                    const pet = await petRes.json();

                    return {
                        ...request,
                        user, // include user details
                        pet   // include pet details
                    };
                }));

                setAdoptionRequests(detailedRequests);
            } catch (error) {
                console.error("Error fetching adoption requests:", error);
            }
        };
        fetchRequests();
    }, []);

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem('token'); // Get the token again
        try {
            await fetch(`https://pet-adoption-jr7a.onrender.com/adoptions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token for update request
                },
                body: JSON.stringify({ status, resolvedDate: new Date() })
            });
            setAdoptionRequests((prev) => 
                prev.map((req) => (req._id === id ? { ...req, status } : req))
            );
        } catch (error) {
            console.error("Error updating adoption status:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center p-8">
                <h1 className="text-3xl font-bold mb-6">Adoption Requests</h1>
                {adoptionRequests.map((request) => (
                    <div key={request._id} className="border p-4 shadow-md mb-4 w-full max-w-md">
                        <h2 className="bg-sky-500 text-white text-center text-xl font-semibold">Adoption Details</h2>
                        <div className="mt-2">
                            <p><strong>Adopter Name:</strong> {request.user.name}</p>
                            <p><strong>Adopter Email:</strong> {request.user.email}</p>
                            <p><strong>Adopter Phone:</strong> {request.user.phone}</p>
                            <p><strong>Requested to Adopt Date:</strong> {new Date(request.requestedDate).toLocaleDateString()}</p>
                            <p><strong>Reason to Adopt:</strong> {request.reasonToAdopt}</p>
                            <p><strong>Status:</strong> {request.status}</p>
                            <p><strong>Resolved Date:</strong> {request.resolvedDate ? new Date(request.resolvedDate).toLocaleDateString() : 'Pending'}</p>
                        </div>
                        <div className="mt-4">
                            <h3 className="bg-sky-500 text-white text-center text-xl font-semibold">Pet Details</h3>
                            <p><strong>Pet Name:</strong> {request.pet.name}</p>
                            <p><strong>Pet Breed:</strong> {request.pet.breed}</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => updateStatus(request._id, 'revoke')}
                                className="bg-sky-500 text-white py-1 px-4 hover:bg-red-600"
                            >
                                Revoke
                            </button>
                            <button
                                onClick={() => updateStatus(request._id, 'adopted')}
                                className="bg-green-500 text-white py-1 px-4 hover:bg-green-600"
                            >
                                Adopted
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
