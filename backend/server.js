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

mongoose.connect('mongodb+srv://ahalyar2004:V3o4P54brHVOj2la@cluster0.0q1sw.mongodb.net/pet-adoption', {})
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