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
    status: { type: String, enum: ['requested', 'revoke', 'adopted'], required: true},
    requestedDate: { type: Date },
    resolvedDate: { type: Date },
    reasonToAdopt: { type: String },
    reasonToReject: { type:String },
});

const Adoption = mongoose.model( 'Adoption', AdoptionSchema, 'adoptionDetails');
module.exports= Adoption;

/*
{
    "userId": "672244dc9bb6e393ed40d882",
    "petId": "6721ef59399fa0e1bf48209d", 
    "status": "requested",
    "requestedDate": "2024-10-30T00:00:00Z",
    "resolvedDate": null,
    "reasonToAdopt": "I've always wanted a dog and have a big yard.",
    "reasonToReject": ""
}
*/