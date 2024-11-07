const Adoption = require('../models/adoptionModel');

// Add adoption details
const addAdoption = async (req, res) => {
    try {
        const { userId, petId, reasonToAdopt } = req.body;

        // Check if required fields are present
        if (!userId || !petId || !reasonToAdopt) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if the pet is already marked as "interested" by another user
        const existingAdoption = await Adoption.findOne({ petId, status: 'interested' });
        if (existingAdoption) {
            return res.status(400).json({ error: "This pet already has an interested user." });
        }

        // Check if the user has already shown interest in the pet
        const userExistingAdoption = await Adoption.findOne({ userId, petId, status: 'interested' });
        if (userExistingAdoption) {
            return res.status(400).json({ error: "You have already expressed interest in this pet." });
        }

        // If no existing adoption, proceed to create the new adoption request
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
        console.error("Error in addAdoption:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// This will help us show a disabled "Interested" button if they've already expressed interest.
const checkAdoptionStatus = async (req, res) => {
    const { petId } = req.params;
    const adoption = await Adoption.findOne({ petId });
    res.status(200).json({ status: adoption ? adoption.status : null });
};

// List all adoptions
const getAllAdoptions = async (req, res) => {
    try {
        const adoptions = await Adoption.find();
        res.json(adoptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Display details of a particular adoption
const getParticularAdoption = async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            return res.status(404).json({ message: 'Adoption detail not found' });
        }
        res.status(200).json(adoption);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update adoption data
const updateAdoption = async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            return res.status(404).json({ message: 'Adoption detail not found' });
        }
        adoption.set(req.body);
        await adoption.save();
        res.status(200).json(adoption);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addAdoption,
    getAllAdoptions,
    getParticularAdoption,
    updateAdoption,
    checkAdoptionStatus,
};
