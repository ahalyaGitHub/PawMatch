import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Middle() {
    const [pets, setPets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await axios.get('https://pet-adoption-jr7a.onrender.com/pets');
                setPets(response.data.slice(0, 3)); // Get the top three pets
            } catch (err) {
                console.log(err);
            }
        };

        fetchPets();
    }, []);

    const handleInterestedClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/pets');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.length === 0 ? (
                    <p className="text-center text-gray-600">No pets available</p>
                ) : (
                    pets.map((pet) => (
                        <div key={pet._id} className="bg-white shadow-lg overflow-hidden rounded-lg">
                            <img src={pet.imageUrl} alt={pet.name} className="h-64 w-full object-cover" />
                            <div className="p-4">
                                <h5 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h5>
                                <div className="space-y-2 text-base text-gray-600">
                                    {[
                                        { label: 'Age', value: `${pet.age} years` },
                                        { label: 'Category', value: pet.category },
                                        { label: 'Gender', value: pet.gender },
                                        { label: 'Breed', value: pet.breed },
                                        { label: 'Description', value: pet.description },
                                        { label: 'Vaccine', value: pet.vaccine ? 'Yes' : 'No' },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex">
                                            <p className="font-semibold w-1/3">{label}:</p>
                                            <p className="w-2/3">{value}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold w-full"
                                    onClick={handleInterestedClick}
                                >
                                    Interested
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="flex justify-center my-5">
                <span
                    onClick={handleInterestedClick}
                    className="font-bold text-lg text-sky-500 hover:underline cursor-pointer"
                >
                    Explore more...
                </span>
            </div>
        </>
    );
}
