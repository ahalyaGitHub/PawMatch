const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');

// Routes for adoption actions
router.post('/add', adoptionController.addAdoption);
router.get('/', adoptionController.getAllAdoptions);
router.get('/status/:petId', adoptionController.checkAdoptionStatus);
router.get('/:id', adoptionController.getParticularAdoption);
router.put('/:id', adoptionController.updateAdoption);

module.exports = router;
