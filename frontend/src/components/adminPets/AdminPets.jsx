import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Navbar from '../navbar/Navbar';

export default function AdminPets() {
    const [pets, setPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async (query = '') => {
        try {
            const url = query ? `https://pet-adoption-jr7a.onrender.com/pets/search?search=${query}` : 'https://pet-adoption-jr7a.onrender.com/pets';
            const response = await axios.get(url);
            setPets(response.data);
        } catch (err) {
            console.error('Error fetching pets:', err.response ? err.response.data : err);
        }
    };

    const handleDelete = async (petId) => {
        try {
            await axios.delete(`https://pet-adoption-jr7a.onrender.com/pets/${petId}`);
            fetchPets(); // Refresh the list after deletion
        } catch (err) {
            console.error('Error deleting pet:', err.response ? err.response.data : err);
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
                <button
                    onClick={() => navigate('/admin/add')}
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                >
                    Add Pet
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map((pet) => (
                        <div key={pet._id} className="bg-white shadow-lg overflow-hidden rounded-lg">
                            <img
                                src={pet.imageUrl}
                                alt={pet.name}
                                className="h-64 w-full object-cover rounded-t-lg"
                            />
                            <div className="p-6">
                                <h5 className="text-2xl font-bold mb-4 text-gray-800 text-center">{pet.pet_id}</h5>

                                <div className="space-y-2 text-base text-gray-600">
                                    {[
                                        { label: "Category", value: pet.category },
                                        { label: "Breed", value: pet.breed },
                                        { label: "Age", value: `${pet.age} years` },
                                        { label: "Gender", value: pet.gender },
                                        { label: "Vaccine", value: pet.vaccine ? "Yes" : "No" },
                                        { label: "Description", value: pet.description },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex">
                                            <p className="font-bold w-1/3">{label}:</p>
                                            <p className="w-2/3">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <FaEdit
                                        onClick={() => navigate(`/admin/edit/${pet._id}`)}
                                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                                        size={20}
                                    />
                                    <FaTrashAlt
                                        onClick={() => handleDelete(pet._id)}
                                        className="cursor-pointer text-red-500 hover:text-red-700"
                                        size={20}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
