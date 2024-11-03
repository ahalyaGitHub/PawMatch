const Adoption= require('../models/adoptionModel');

// Add adoption details
const addAdoption = async(req, res) =>{
    try {
        const adoption = new  Adoption(req.body);
        adoption.save();
        res.status(200).json(adoption);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
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
}