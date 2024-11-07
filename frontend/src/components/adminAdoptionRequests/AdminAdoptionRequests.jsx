import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/Navbar';

export default function AdminAdoptionRequests() {
    const [adoptionRequests, setAdoptionRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:5000/adoptions', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const requests = await res.json();
    
                const detailedRequests = await Promise.all(requests.map(async (request) => {
                    const userRes = await fetch(`http://localhost:5000/users/${request.userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    const petRes = await fetch(`http://localhost:5000/pets/${request.petId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    const user = await userRes.json();
                    const pet = await petRes.json();
                    return {
                        ...request,
                        user,
                        pet
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
        const token = localStorage.getItem('token');
        try {
            // Update adoption status in the backend
            await fetch(`http://localhost:5000/adoptions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, resolvedDate: new Date() })
            });
    
            // Update the pet's status in the frontend state
            setAdoptionRequests((prev) => 
                prev.map((req) => (req._id === id ? { ...req, status } : req))
            );
    
            // Also, update the pets' status if necessary (mark as adopted or interested)
            // For example, after "Adopt" action, update the pet's status
            const petUpdateRes = await fetch(`http://localhost:5000/pets/status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status }) // You can pass 'adopted' or 'interested'
            });
    
            if (!petUpdateRes.ok) {
                throw new Error('Failed to update pet status');
            }
    
        } catch (error) {
            console.error("Error updating adoption status:", error);
        }
    };
    

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Adoption Requests Dashboard</h1>

                <div className="w-full max-w-6xl space-y-6">
                    {adoptionRequests.map((request) => (
                        <div key={request._id} className="bg-white shadow-xl p-6 border-t-4 border-sky-500">
                            <div className="bg-sky-500 text-white text-center text-2xl font-semibold py-3">
                                Adoption Request Details
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800">Adopter Information</h2>
                                    <p className="text-gray-600"><strong>Name:</strong> {request.user?.name || 'Not Available'}</p>
                                    <p className="text-gray-600"><strong>Email:</strong> {request.user?.email || 'Not Available'}</p>
                                    <p className="text-gray-600"><strong>Phone:</strong> {request.user?.phone || 'Not Available'}</p>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800">Adoption Request Details</h2>
                                    <p className="text-gray-600"><strong>Requested Date:</strong> {new Date(request.requestedDate).toLocaleDateString()}</p>
                                    <p className="text-gray-600"><strong>Reason:</strong> {request.reasonToAdopt}</p>
                                    <p className="text-gray-600"><strong>Status:</strong> <span className={`font-semibold ${request.status === 'adopted' ? 'text-green-600' : 'text-red-500'}`}>{request.status}</span></p>
                                    <p className="text-gray-600"><strong>Resolved Date:</strong> {request.resolvedDate ? new Date(request.resolvedDate).toLocaleDateString() : 'Pending'}</p>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800">Pet Information</h2>
                                    <p className="text-gray-600"><strong>Pet Name:</strong> {request.pet?.pet_id || 'Not Available'}</p>
                                    <p className="text-gray-600"><strong>Breed:</strong> {request.pet?.breed || 'Not Available'}</p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6 border-t pt-4">
                                <button
                                    onClick={() => updateStatus(request._id, 'revoke')}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6  transition duration-300"
                                >
                                    Rejected
                                </button>
                                <button
                                    onClick={() => updateStatus(request._id, 'adopted')}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 transition duration-300"
                                >
                                    Adopted
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
