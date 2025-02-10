const Adoption = require('../models/adoptionModel');

// Add adoption details
const addAdoption = async (req, res) => {
    try {
        const { userId, petId, reasonToAdopt } = req.body;

        if (!userId || !petId || !reasonToAdopt) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if the pet is already adopted
        const existingAdoption = await Adoption.findOne({ petId, status: 'adopted' });
        if (existingAdoption) {
            return res.status(400).json({ error: "This pet has already been adopted." });
        }

        // Create the new adoption request
        const adoption = new Adoption({
            userId,
            petId,
            status: 'interest-to-adopt',
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

// Check the adoption status of a pet
const checkAdoptionStatus = async (req, res) => {
    const { petId } = req.params;
    try {
        const adoption = await Adoption.findOne({ petId, status: 'interest-to-adopt' });
        res.status(200).json({ status: adoption ? adoption.status : 'available' });
    } catch (error) {
        console.error("Error checking adoption status:", error);
        res.status(500).json({ error: "Failed to check adoption status" });
    }
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
            return res.status(404).json({ message: 'Adoption request not found' });
        }
        res.status(200).json(adoption);
    } catch (err) {
        console.error("Error retrieving adoption request:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// Update the adoption status (e.g., mark as adopted or rejected)
const updateAdoption = async (req, res) => {
    const { id } = req.params;  
    const { status, reasonToReject } = req.body; 
    const resolvedDate = new Date();  

    try {
        const adoption = await Adoption.findById(id);

        if (!adoption) {
            return res.status(404).json({ message: 'Adoption record not found' });
        }

        // Update the adoption status and resolved date
        adoption.status = status;
        adoption.resolvedDate = resolvedDate;  // Ensure the resolved date is set
        if (status === 'revoke') {
            adoption.reasonToReject = reasonToReject;  // Only add rejection reason if status is 'revoke'
        }

        await adoption.save();

        res.status(200).json(adoption);  // Return the updated adoption record
    } catch (err) {
        console.error('Error updating adoption status:', err);
        res.status(500).json({ error: 'Failed to update adoption status' });
    }
};


// Get adoption history of a particular user
const getAdoptionHistory = async (req, res) => {
    try {
        const userId = req.params.id;

        const adoptionHistory = await Adoption.find({ userId })
            .populate({path:'petId', select: 'name breed age', strictPopulate: false}) // Adjust as per your pet model fields
            .exec();

        const history = {
            interested: adoptionHistory.filter(adoption => adoption.status === 'interest-to-adopt'),
            adopted: adoptionHistory.filter(adoption => adoption.status === 'adopted'),
            rejected: adoptionHistory.filter(adoption => adoption.status === 'revoke'), // Corrected filter
        };

        res.json(history);
    } catch (error) {
        console.error('Error fetching adoption history:', error);
        res.status(500).json({ message: 'Error fetching adoption history', error });
    }
};


const checkOrCreateAdoption = async (req, res) => {
    const { petId, userId } = req.params;

    try {
        // Check if the adoption record already exists
        let adoption = await Adoption.findOne({ petId, userId });

        if (!adoption) {
            // If adoption record doesn't exist, create one with status 'available'
            adoption = new Adoption({
                petId,
                userId,
                status: 'available',  // Status can be 'available', 'adopted', etc.
            });
            await adoption.save();
        }

        // Return the adoption record (either existing or newly created)
        res.status(200).json({ adoptionId: adoption._id, status: adoption.status });
    } catch (err) {
        console.error('Error checking or creating adoption:', err);
        res.status(500).json({ message: 'Error handling adoption' });
    }
};

// Export functions
module.exports = {
    addAdoption,
    getAllAdoptions,
    getParticularAdoption,
    updateAdoption,
    checkAdoptionStatus,
    getAdoptionHistory,
    checkOrCreateAdoption,
};
