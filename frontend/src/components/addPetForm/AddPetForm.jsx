import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../navbar/Navbar';

export default function AddPetsForm() {
    const { id } = useParams(); // Check if there is a pet ID for editing
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pet_id: '',
        category: '',
        breed: '',
        description: '',
        gender: 'Male',
        vaccine: 0,
        age: '',
        imageUrl: '',
    });

    useEffect(() => {
        if (id) {
            // Fetch the pet's existing data if editing
            const fetchPet = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/pets/${id}`);
                    setFormData(response.data);
                } catch (err) {
                    console.error('Error fetching pet details:', err);
                }
            };
            fetchPet();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, imageUrl: e.target.files[0] });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });
    
        try {
            if (id) {
                await axios.put(`http://localhost:5000/pets/${id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post('http://localhost:5000/pets', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/admin/pets');
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };
    

    return (
        <>
        <Navbar />
        <div className="container mx-auto mt-10 p-6 max-w-lg bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {id ? 'Edit Pet Details' : 'Add New Pet'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                    <label className="block text-gray-600 font-medium">ID</label>
                    <input
                        type="text"
                        name="pet_id"
                        placeholder="Pet's ID"
                        value={formData.pet_id}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Category</label>
                    <input
                        type="text"
                        name="category"
                        placeholder="e.g., Dog, Cat"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Breed</label>
                    <input
                        type="text"
                        name="breed"
                        placeholder="e.g., Golden Retriever"
                        value={formData.breed}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Description</label>
                    <textarea
                        name="description"
                        placeholder="Brief description of the pet"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Gender</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === 'Male'}
                                onChange={handleChange}
                                className="form-radio text-blue-500"
                            />
                            <span className="ml-2 text-gray-700">Male</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === 'Female'}
                                onChange={handleChange}
                                className="form-radio text-blue-500"
                            />
                            <span className="ml-2 text-gray-700">Female</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Vaccine</label>
                    <input
                        type="number"
                        name="vaccine"
                        placeholder="Vaccine count"
                        value={formData.vaccine}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Age</label>
                    <input
                        type="number"
                        name="age"
                        placeholder="Pet's age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Image</label>
                    <input
                        type="file"
                        name="imageUrl"
                        onChange={handleImageChange}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                    {id ? 'Update Pet' : 'Add Pet'}
                </button>
            </form>
        </div>
        </>
    );
}
