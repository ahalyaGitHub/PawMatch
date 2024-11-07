const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Add user data (Sign up)
const addUser = async (req, res) => {
    const { name, phone, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password before saving the user
        const user = new User({ name, phone, email, password }); // Do not hash here
        await user.save(); // Password will be hashed in the pre-save hook
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Attempting login with email: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('User found:', user);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match status: ${isMatch}`);

        if (!isMatch) {
            console.log('Invalid credentials');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: 'User' },
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '1h' }
        );

        res.setHeader('Authorization', `Bearer ${token}`);
        res.setHeader('Role', 'User');

        console.log('JWT Token:', token);
        console.log('Role:', 'User');

        return res.status(200).json({ token, role: 'User' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Get all user details
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Adoption detail not found' });
        }
        res.status(200).json(user);
    } catch(error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
}

module.exports = {
    loginUser,
    addUser,
    getUser,
};
