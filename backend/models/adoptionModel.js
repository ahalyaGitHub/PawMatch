const mongoose = require('mongoose');

const AdoptionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  // References the User schema
        required: true 
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    status: { type: String, enum: ['revoke', 'adopted', 'interest-to-adopt']},
    requestedDate: { type: Date },
    resolvedDate: { type: Date },
    reasonToAdopt: { type: String },
    reasonToReject: { type:String },
});

const Adoption = mongoose.model( 'Adoption', AdoptionSchema, 'adoptionDetails');
module.exports= Adoption;
