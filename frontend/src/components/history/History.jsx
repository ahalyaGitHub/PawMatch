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
                const response = await axios.get(`http://localhost:5000/adoptions/history/${userId}`);
                console.log('Fetched History:', response.data);
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching history', error);
            }
        };
        fetchHistory();
    }, []);

    const renderPets = (pets) => (
        pets?.map((adoption) => (
            <div key={adoption._id} className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-transform transform hover:scale-105">

                <h1 className="text-gray-600 font-bold">{adoption.petId.breed}</h1>
                
                <p className="text-gray-600 font-bold">Age: {adoption.petId.age} years</p>

                <p className="text-gray-600 font-bold">Status: {adoption.status === 'revoke' && <span className='text-red-500 font-bold'>Rejected</span>} {adoption.status === 'adopted' && <span className='text-green-500 font-bold'>Adopted</span>}  {adoption.status === 'interest-to-adopt' && <span className='text-sky-500 font-bold'>Interested</span>}</p>

                <p className="text-gray-600 font-bold">Requested on: {new Date(adoption.requestedDate).toLocaleDateString()}</p>

                {adoption.status === 'revoke' && <><p className="text-gray-600 font-bold">Reason to reject: {adoption.reasonToReject}</p>
                <p className="text-gray-600 font-bold">Rejected on:{new Date(adoption.resolvedDate).toLocaleDateString()} </p></>}
                {adoption.status === 'adopted' && <p className="text-gray-600 font-bold">Adopted on: {new Date(adoption.resolvedDate).toLocaleDateString()} </p>}
            </div>
        ))
    );

    return (
        <>
            <Navbar />
            <div className="flex flex-col max-w-5xl mx-auto p-8 space-y-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Adoption History</h2>
    <div className="grid grid-cols-1 gap-8">
        <div className="w-full bg-blue-50 shadow-lg rounded-lg p-6">
            <div className="w-full">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Interested</h3>
                {history.interested?.length ? renderPets(history.interested) : <p className="text-gray-500">No interested pets.</p>}
               
            </div>
        </div>

        <div className="w-full bg-green-50 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Adopted</h3>
            {history.adopted?.length ? renderPets(history.adopted) : <p className="text-gray-500">No adopted pets.</p>}
        </div>

        <div className="w-full bg-red-50 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-red-800 mb-4">Rejected</h3>
            {history.rejected?.length ? renderPets(history.rejected) : <p className="text-gray-500">No rejected applications.</p>}
        </div>
    </div>
</div>

        </>
    );
};

export default History;
