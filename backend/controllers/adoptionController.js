const Adoption= require('../models/adoptionModel');

// Add adoption details
const addAdoption = async (req, res) => {
    try {
        const { userId, petId, reasonToAdopt } = req.body;

        // Check if required fields are present
        if (!userId || !petId || !reasonToAdopt) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const adoption = new Adoption({
            userId,
            petId,
            status: 'interested',
            requestedDate: new Date(),
            reasonToAdopt,
            
        });

        await adoption.save();
        res.status(200).json(adoption);
    } catch (err) {
        console.error("Error in addAdoption:", err.message); // Log the exact error message
        res.status(500).json({ error: err.message });
    }
};


// This will help us show a disabled "Interested" button if they've already expressed interest.
const checkAdoptionStatus = async (req, res) => {
    const { userId, petId } = req.params;
    const adoption = await Adoption.findOne({ userId, petId });
    res.status(200).json({ status: adoption ? adoption.status : null });
};


// List all pets
const getAllAdoptions = async (req, res) => {
    try{
        const adoptions = await Adoption.find();
        res.json(adoptions);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

// Display details of a particular adoption
const getParticularAdoption = async (req, res) => {
    try{
        const adoption = await Adoption.findById(req.params.id);
        if(!adoption) {
            return res.status(404).json({ message: 'Adpotion detail not found' });
        }
        res.status(200).json(adoption);
    } catch(err) {
        res.status(500).json({ error: err.message});
    }
};

// Update adoption data
const updateAdoption = async (req, res) =>{
    try {
        const adoption = await Adoption.findById(req.params.id);
        if(!adoption){
            return res.status(404).json({ message: 'Adoption detail not found' });
        }
        adoption.set(req.body);
        await adoption.save();
        res.status(200).json(adoption);
    } catch(err) {
        res.status(500).json({ error: err.message });
    } 
};

module.exports = {
    addAdoption,
    getAllAdoptions,
    getParticularAdoption,
    updateAdoption,
    checkAdoptionStatus,
}