const mongoose = require('mongoose');

const PetSchema= new mongoose.Schema({
    category: {type: String, required: true},
    breed: {type: String, required: true},
    description: {type: String},
    gender: {type:String, enum: ['Male', 'Female'], required:true},
    vaccine: {type: Number},
    age: {type: Number, required: true},
    imageUrl: {type: String},
    pet_id: {type: String},
});

const Pet =mongoose.model('Pet', PetSchema, 'petDetails');
module.exports = Pet;

/*
[
    {
        "category": "Dog",
        "breed": "Beagle",
        "description": "Curious and friendly, great with families.",
        "gender": "Female",
        "vaccine": 2,
        "age": 3,
        "imageUrl": "https://example.com/beagle.jpg",
        "pet_id": "beagle_001"
    },
    {
        "category": "Dog",
        "breed": "German Shepherd",
        "description": "Intelligent and versatile, excellent guard dogs.",
        "gender": "Male",
        "vaccine": 1,
        "age": 4,
        "imageUrl": "https://example.com/germanshepherd.jpg",
        "pet_id": "germanshepherd_002"
    },
    {
        "category": "Cat",
        "breed": "Siamese",
        "description": "Affectionate and vocal, known for their striking blue eyes.",
        "gender": "Female",
        "vaccine": 3,
        "age": 2,
        "imageUrl": "https://example.com/siamese.jpg",
        "pet_id": "siamese_001"
    },
    {
        "category": "Cat",
        "breed": "Persian",
        "description": "Calm and gentle, enjoys a quiet environment.",
        "gender": "Male",
        "vaccine": 2,
        "age": 5,
        "imageUrl": "https://example.com/persian.jpg",
        "pet_id": "persian_002"
    },
    {
        "category": "Dog",
        "breed": "Poodle",
        "description": "Intelligent and trainable, great for families with allergies.",
        "gender": "Female",
        "vaccine": 1,
        "age": 1,
        "imageUrl": "https://example.com/poodle.jpg",
        "pet_id": "poodle_003"
    },
    {
        "category": "Cat",
        "breed": "Maine Coon",
        "description": "Large and friendly, known for their tufted ears and bushy tails.",
        "gender": "Male",
        "vaccine": 3,
        "age": 3,
        "imageUrl": "https://example.com/mainecoon.jpg",
        "pet_id": "mainecoon_004"
    },
    {
        "category": "Cat",
        "breed": "Bengal",
        "description": "Energetic and playful, with a distinctive spotted coat.",
        "gender": "Female",
        "vaccine": 2,
        "age": 4,
        "imageUrl": "https://example.com/bengal.jpg",
        "pet_id": "bengal_005"
    }
]

*/