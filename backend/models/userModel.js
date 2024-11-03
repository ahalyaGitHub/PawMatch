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
    if (!this.isModified('password')) return next(); // Only hash if password is modified
        
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10); // You can adjust the salt rounds
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', UserSchema, 'userDetails');
module.exports = User;

/* {
    "name": "Ahalya",
    "phone": "1234567890",
    "email": "ahal123@gmail.com",
    "role": "User",
    "password": "bavya123"
} */