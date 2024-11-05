import React, { useEffect, useState } from 'react';

export default function AdminAdoptionRequests() {
    const [adoptionRequests, setAdoptionRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const res = await fetch('https://pet-adoption-jr7a.onrender.com/adoptions');
            const data = await res.json();
            setAdoptionRequests(data);
        };
        fetchRequests();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await fetch(`https://pet-adoption-jr7a.onrender.com/adoptions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
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
        <div className="flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-6">Interested Users</h1>
            {adoptionRequests.map((request) => (
                <div key={request._id} className="border p-4 rounded shadow-md mb-4 w-full max-w-md">
                    <p><strong>User ID:</strong> {request.userId}</p>
                    <p><strong>Pet ID:</strong> {request.petId}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => updateStatus(request._id, 'revoke')}
                            className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                        >
                            Revoke
                        </button>
                        <button
                            onClick={() => updateStatus(request._id, 'adopted')}
                            className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                        >
                            Adopted
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
