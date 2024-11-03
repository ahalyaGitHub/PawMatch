import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';

export default function User() {
    const [pets, setPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPets(); // Fetch all pets on component mount
    }, []);

    const fetchPets = async (query = '') => {
        try {
            const url = query
                ? `http://localhost:5000/pets/search?search=${query}`
                : 'http://localhost:5000/pets'; // Endpoint to fetch all pets
            console.log('Fetching pets from:', url); // Log the URL
            const response = await axios.get(url);
            console.log('Pets fetched:', response.data); // Log the fetched data
            setPets(response.data);
        } catch (err) {
            console.error('Error fetching pets:', err.response ? err.response.data : err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPets(searchTerm); // Fetch pets based on current search term
    };

    return (
        <>
            <Navbar />

            <div className="container mx-auto mt-8 px-4">
                <form className="flex justify-center mb-8" onSubmit={handleSearch}>
                    <input
                        className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 font-semibold"
                        type="search"
                        placeholder="Search by breed, age, or category"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="bg-sky-500 text-white px-4 py-2 hover:bg-sky-600 focus:outline-none font-bold" type="submit">
                        Search
                    </button>
                </form>

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
                                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 font-semibold">
                                        Interested
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
