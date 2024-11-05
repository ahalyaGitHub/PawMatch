const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String},
});

// Middleware to hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Use a consistent salt round
        console.log("Generated Salt:", salt); // Check if salt is generated
        this.password = await bcrypt.hash(this.password, salt);
        console.log("Hashed Password:", this.password); // Verify hashed password
        next();
    } catch (error) {
        console.error("Hashing Error:", error);
        next(error);
    }
});



const User = mongoose.model('User', UserSchema, 'userDetails');
module.exports = User;

/* {
    "name": "Ahalya",
    "phone": "1234567890",
    "email": "ahal123@gmail.com",
    "password": "ahal123"
} */