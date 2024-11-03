const express = require('express');
const mongoose= require('mongoose');
const cors = require('cors');
require('dotenv').config();
const petRoute = require('./routes/petRoute');
const userRoute = require('./routes/userRoute');
const adoptionRoute = require('./routes/adoptionRoute');
const adminRoute = require('./routes/adminRoute');

const app= express();
const PORT=5000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/pet-adoption', {})
.then(()=>{
    console.log('MongoDB connected');
})
.catch(err =>{
    console.log(err);
})

app.use('/pets',petRoute);
app.use('/users',userRoute);
app.use('/adoptions',adoptionRoute);
app.use('/admins',adminRoute);

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});