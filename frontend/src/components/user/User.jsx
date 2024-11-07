import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';

export default function User() {
    const [pets, setPets] = useState([]);
    const [interestedPets, setInterestedPets] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async (query = '') => {
        try {
            const url = query ? `http://localhost:5000/pets/search?search=${query}` : 'http://localhost:5000/pets';
            const response = await axios.get(url);
            setPets(response.data);

            const interestedPetIds = await Promise.all(
                response.data.map(async (pet) => {
                    const statusResponse = await axios.get(`http://localhost:5000/adoptions/status/${pet._id}`);
                    return statusResponse.data.status === 'interested' ? pet._id : null;
                })
            );
            setInterestedPets(new Set(interestedPetIds.filter(id => id)));
        } catch (err) {
            console.error('Error fetching pets:', err.response ? err.response.data : err);
        }
    };

    // Function to update the pet status (e.g., 'adopted' or 'interested')
    const updateStatus = async (petId, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:5000/pets/${petId}`, { status: newStatus });
            if (response.status === 200) {
                // Update the interestedPets state after changing the status
                setInterestedPets((prevState) => {
                    const updatedPets = new Set(prevState);
                    if (newStatus === 'adopted') {
                        updatedPets.delete(petId); // Remove from interestedPets if adopted
                    } else {
                        updatedPets.add(petId); // Add back to interestedPets if marked as interested
                    }
                    return updatedPets;
                });
            }
        } catch (err) {
            console.error('Error updating pet status:', err.response ? err.response.data : err);
        }
    };

    const handleInterestedClick = (petId) => {
        const token = localStorage.getItem('token');
        if (token) {
            // If the pet is currently marked as 'interested', and the admin changes its status
            if (interestedPets.has(petId)) {
                // Change the status to 'adopted' when the pet is already marked as 'interested'
                updateStatus(petId, 'adopted');
            } else {
                navigate(`/adopt/${petId}`);
            }
        } else {
            alert('Please log in to express interest in adopting a pet.');
            navigate('/login');
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        fetchPets(query);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-8 px-4">
                {/* Search Input */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search pets by name, breed, gender, or category..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.length === 0 ? (
                        <p className="text-center text-gray-600">No pets available</p>
                    ) : (
                        pets.map((pet) => (
                            <div key={pet._id} className="bg-white shadow-lg overflow-hidden">
                                <img src={pet.imageUrl} alt={pet.name} className="h-64 w-full object-cover" />
                                <div className="p-4">
                                    <h5 className="text-xl font-bold text-gray-800">{pet.name}</h5>
                                    <p className="text-gray-600"><span className="font-semibold">Age:</span> {pet.age}</p>
                                    <p className="text-gray-600"><span className="font-semibold">Category:</span> {pet.category}</p>
                                    <p className="text-gray-600"><span className="font-semibold">Gender:</span> {pet.gender}</p>
                                    <p className="text-gray-600"><span className="font-semibold">Breed:</span> {pet.breed}</p>
                                    <p className="text-gray-600"><span className="font-semibold">Description:</span> {pet.description}</p>
                                    <p className="text-gray-600"><span className="font-semibold">Vaccine:</span> {pet.vaccine}</p>

                                    {interestedPets.has(pet._id) ? (
                                        <p className="w-full text-gray-700 text-center py-2 font-bold">
                                            <span className='text-red-500'>Status: </span>Interested
                                        </p>
                                    ) : pet.status === 'adopted' ? (
                                        <p className="w-full text-gray-700 text-center py-2 font-bold">
                                            <span className='text-red-500'>Status: </span>Adopted
                                        </p>
                                    ) : (
                                        <button
                                            onClick={() => handleInterestedClick(pet._id)}
                                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                                        >
                                            Express Interest
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
