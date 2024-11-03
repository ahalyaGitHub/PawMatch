const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.post('/', petController.addPet);
router.get('/',petController.getAllPets);
router.get('/search',petController.searchPets);
router.get('/recent',petController.recentPetDetails);
router.get('/:id',petController.getParticularPet);
router.put('/:id',petController.updatePet);
router.delete('/:id',petController.deletePet);


module.exports = router;