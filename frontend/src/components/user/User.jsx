import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function User() {
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
      const petsWithStatus = await Promise.all(response.data.map(async (pet) => {
        const statusRes = await axios.get(`https://pet-adoption-jr7a.onrender.com/adoptions/status/${pet._id}`);
        return { ...pet, status: statusRes.data.status };
      }));
      const availablePets = petsWithStatus.filter(pet => pet.status !== 'adopted'); // Filter out adopted pets
      setPets(availablePets);
    } catch (err) {
      console.error('Error fetching pets:', err.response ? err.response.data : err);
    }
  };

  const handleAdoptStatusChange = async (petId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`https://pet-adoption-jr7a.onrender.com/adoptions/status/${petId}`);
        if (response.data.status === 'available' || response.data.status === 'revoke') {
          navigate(`/adopt/${petId}`);
        } else if (response.data.status === 'adopted') {
          alert('This pet has already been adopted.');
        } else if (response.data.status === 'interest-to-adopt') {
          alert('This pet is already marked as interested by another user.');
        }
      } catch (error) {
        console.error('Error checking adoption status:', error);
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
      <nav className="bg-sky-500 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center h-20">
          <Link to="/" className="flex flex-row gap-2 text-3xl text-white font-semibold justify-center items-center">
            <img src="/logo.png" alt="logo" width={45} />
            <p>PAW MATCH</p>
          </Link>
          <div className="flex space-x-6">
            <Link to="/history" className="text-xl font-semibold bg-white text-sky-500 px-2 py-2 rounded hover:bg-sky-100">Adoption History</Link>
          </div>
        </div>
      </nav>
      <div className="container mx-auto mt-8 px-4">
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
            <p className="text-center text-gray-600">Pet details Loading...</p>
          ) : (
            pets.map((pet) => (
              <div key={pet._id} className="bg-white shadow-lg overflow-hidden">
                <img src={pet.imageUrl} alt={pet.name} className="h-64 w-full object-cover" />
                <div className="p-4">
                  <h5 className="text-xl font-bold text-gray-800 mb-4">{pet.pet_id}</h5>
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
                  <button
                    onClick={() => handleAdoptStatusChange(pet._id)}
                    className="mt-4 bg-green-500 text-white py-2 w-full hover:bg-green-600 transition duration-300"
                  >
                    Adopt
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
