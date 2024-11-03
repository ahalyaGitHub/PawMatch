const Pet = require('../models/petModel');

// Create pet data
const addPet = async (req, res) => {
    try{
        const pet = await Pet.insertMany(req.body);
        res.status(200).json(pet);
    } catch(err) {
        res.status(404).json({ error: err.message });
    }
};

// List all pets
const getAllPets = async (req, res) => {
    try{
        const pets = await Pet.find();
        res.json(pets);
    } catch(err) {
        // 500 - Internal Server Error
        res.status(500).json({ error: err.message });
    }
};

// Display details of a particular pet
const getParticularPet = async (req, res) => {
    try{
        const pet = await Pet.findById(req.params.id);
        if(!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json(pet);
    } catch(err) {
        res.status(500).json({ error: err.message});
    }
};

// Top-3 pets details
const recentPetDetails = async (req, res) =>{
    try {
        const pets = await Pet.find().sort({_id: -1}).limit(3);
        res.status(200).json(pets);
    } catch(err) {
        res.status(500).json({ error: err.message});
    }
};

// Update pet data
const updatePet = async (req, res) =>{
    try {
        const pet = await Pet.findById(req.params.id);
        if(!pet){
            return res.status(404).json({ message: 'Pet not found' });
        }
        pet.set(req.body);
        await pet.save();
        res.status(200).json(pet);
    } catch(err) {
        res.status(500).json({ error: err.message });
    } 
};

// Delete pet data
const deletePet = async (req, res)=>{
    try{
        const pet= await Pet.findByIdAndDelete(req.params.id);
        if(!pet){
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json(pet);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

// Search pets
const searchPets = async (req, res) => {
    const searchQuery = req.query.search;
    console.log('Search Query:', searchQuery);
    try {
        const pets = await Pet.find({
            $or: [
                { breed: { $regex: searchQuery, $options: 'i' } },
                { age: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } },
            ]
        });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching pets' });
    }
  };

module.exports={
   addPet,
   getAllPets,
   getParticularPet,
   recentPetDetails,
   updatePet,
   deletePet,
   searchPets,
};