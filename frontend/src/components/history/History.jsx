import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../navbar/Navbar';

const History = () => {
    const [history, setHistory] = useState({
        interested: [],
        adopted: [],
        rejected: []
    });

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            try {
                const response = await axios.get(`https://pet-adoption-jr7a.onrender.com/adoptions/history/${userId}`);
                console.log('Fetched History:', response.data);
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching history', error);
            }
        };
        fetchHistory();
    }, []);

    const renderPets = (pets) => (
        pets?.map((adoption) => {
            const petInfo = adoption.petId ? (
                <>
                    <div className="flex items-center">
                        <span className="text-gray-500 font-bold w-32">Breed:</span>
                        <span className="text-gray-600">{adoption.petId.breed}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-500 font-bold w-32">Age:</span>
                        <span className="text-gray-600">{adoption.petId.age} years</span>
                    </div>
                </>
            ) : (
                <p className="text-gray-500 italic">Pet information not available</p>
            );

            return (
                <div key={adoption._id} className="bg-white shadow-lg  p-6 mb-6 transition-transform transform hover:scale-105">
                    {petInfo}
                    <div className="flex items-center">
                        <span className="text-gray-500 font-bold w-32">Status:</span>
                        <span className={`text-gray-600 font-bold ${adoption.status === 'revoke' ? 'text-red-500' :
                                adoption.status === 'adopted' ? 'text-green-500' :
                                    'text-sky-500'}`}>
                            {adoption.status === 'revoke' ? 'Rejected' :
                                adoption.status === 'adopted' ? 'Adopted' : 'Interested'}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <span className="text-gray-500 font-bold w-32">Requested on:</span>
                        <span className="text-gray-600">{new Date(adoption.requestedDate).toLocaleDateString()}</span>
                    </div>

                    {adoption.status === 'revoke' && (
                        <>
                            <div className="flex items-center">
                                <span className="text-gray-500 font-bold w-32">Reason to reject:</span>
                                <span className="text-gray-600">{adoption.reasonToReject || 'No reason provided'}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-500 font-bold w-32">Rejected on:</span>
                                <span className="text-gray-600">{new Date(adoption.resolvedDate).toLocaleDateString()}</span>
                            </div>
                        </>
                    )}
                    {adoption.status === 'adopted' && (
                        <div className="flex items-center">
                            <span className="text-gray-500 font-bold w-32">Adopted on:</span>
                            <span className="text-gray-600">{new Date(adoption.resolvedDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            );
        })
    );



    return (
        <>
            <Navbar />
            <div className="flex flex-col max-w-5xl mx-auto p-8 space-y-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Adoption History</h2>
                <div className="grid grid-cols-1 gap-8">
                    <div className="w-full bg-blue-50 shadow-lg p-6">
                        <div className="w-full">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">Interested</h3>
                            {history.interested?.length ? renderPets(history.interested) : <p className="text-gray-500">No interested pets.</p>}

                        </div>
                    </div>

                    <div className="w-full bg-green-50 shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">Adopted</h3>
                        {history.adopted?.length ? renderPets(history.adopted) : <p className="text-gray-500">No adopted pets.</p>}
                    </div>

                    <div className="w-full bg-red-50 shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-red-800 mb-4">Rejected</h3>
                        {history.rejected?.length ? renderPets(history.rejected) : <p className="text-gray-500">No rejected applications.</p>}
                    </div>
                </div>
            </div>

        </>
    );
};

export default History;
