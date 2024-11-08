const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const petRoute = require('./routes/petRoute');
const userRoute = require('./routes/userRoute');
const adoptionRoute = require('./routes/adoptionRoute');
const adminRoute = require('./routes/adminRoute');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/pet-adoption', {})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.log(err);
  });

// Routes
app.use('/pets', petRoute);
app.use('/users', userRoute);
app.use('/adoptions', adoptionRoute);
app.use('/admins', adminRoute);

// Start the HTTP server (not `app.listen`, which would only start the Express server)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
