const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Add user data (Sign up)
const addUser = async(req, res) =>{
    try{
        const user= new User(req.body);
        user.save();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to login an admin
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('Admin not found');

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: 'User' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token and role in headers
        res.setHeader('Authorization', `Bearer ${token}`);
        res.setHeader('Role', 'User');

        // Log the token and role in the console
        console.log('JWT Token:', token);
        console.log('Role:', 'User');

        // Return the token and role in the response body as well (optional)
        return res.json({ token, role: 'User' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).send('Server error');
    }
};


module.exports ={
    loginUser,
    addUser,
};