const Pet = require('../models/petModel');

// Create pet data
const addPet = async (req, res) => {
    try {
        const { category, breed, description, gender, vaccine, age } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const pet = new Pet({
            pet_id,
            category,
            breed,
            description,
            gender,
            vaccine,
            age,
            imageUrl
        });

        await pet.save();
        res.status(201).json(pet);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = { ...req.body };

        if (req.file) {
            updatedData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const pet = await Pet.findByIdAndUpdate(id, updatedData, { new: true });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.status(200).json(pet);
    } catch (err) {
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
                { name: { $regex: searchQuery, $options: 'i' } },
                { breed: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } },
                { gender: { $regex: searchQuery, $options: 'i' } }
            ]
        });
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching pets' });
    }
  };

  const updatePetStatus = async(req, res) => {
    const { petId } = req.params;
    const { status } = req.body;

    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Update pet status
        pet.status = status; // Status can be 'interested', 'adopted', etc.
        await pet.save();

        res.status(200).json(pet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  }


module.exports={
   addPet,
   getAllPets,
   getParticularPet,
   recentPetDetails,
   updatePet,
   deletePet,
   searchPets,
   updatePetStatus,
};